import {mysql, redis} from 'access-db'
import axios from 'axios'

import {product, gift_theme, gift_trade, gift_picked, users} from '../../constants/table'
import { authUse } from '../../middlewares/auth'
import { toImgUrl, randomCode, toImgUrls } from '../../utils/utils'
import {sendSms, smsVerify, sendSmsGiftNotice} from '../../utils/sms'
import { WEAPP, EXPRESS_SF, GIFT_TRADE_STATUS } from '../../constants/constants'




const giftRouter = require('koa-router')()

giftRouter.prefix('/zhihehe/gift')



// 生成一个运单
const addOneExpress = async (expressInfo) => {
  let accessToken = (await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP.APP_ID}&secret=${WEAPP.APP_SECRET}`)).data.access_token
  let addorder = (await axios.post(`https://api.weixin.qq.com/cgi-bin/express/business/order/add?access_token=${accessToken}`, expressInfo)).data
  return addorder
}


// 普通用户，未登录
giftRouter.get('/trade/detail/:gtid', async (ctx, next) => {
  const {gtid} = ctx.params
  let info = (await mysql.find(gift_trade.t, {
    j1: [gift_trade.uid, 'inner', users.id],
    j0: [gift_trade.gift_theme_id, 'inner', gift_theme.id],
    p0: [gift_trade.id, '=', gtid],
    p1: [gift_trade.status, '=', 2],
    r: 'p0 && p1',
    select: [
      gift_trade.id,
      gift_trade.article_id,
      gift_trade.picked_phone,
      gift_trade.title,
      gift_trade.cover_url,
      gift_trade.quantity,
      gift_trade.remain_quantity,
      gift_trade.trade_status,
      gift_trade.price,
      gift_trade.uid,
      gift_trade.des,
      gift_trade.message,
      users.nickname,
      users.avatar_url,
      gift_theme.title + ' as theme_title',
      gift_theme.bg_image,
      gift_theme.share_image,
      gift_theme.message + ' as theme_message'
    ],
  })).data.objects[0]
  let tempPhone = info.picked_phone ? info.picked_phone.split(',') : []
  if(tempPhone.length > 0) {
    for(let i = 0; i < tempPhone.length; i++){
      tempPhone[i] = tempPhone[i][0] + tempPhone[i][1] + tempPhone[i][2] + '****' +
                     tempPhone[i][7] + tempPhone[i][8] + tempPhone[i][9] + tempPhone[i][10]
    }
  }
  info.picked_phone = tempPhone

  // 获取哪些手机号领取过了
  let pickedList = (await mysql.find(gift_picked.t, {
    p0: [gift_picked.gift_trade_id, '=', gtid],
    r: 'p0'
  })).data.objects
  let pickPhones: string[] = []
  for(let j = 0; j < pickedList.length; j++){
    let p = pickedList[j].verify_phone
    if(p) {
      pickPhones.push(p[0] + p[1] + p[2] + '****' + p[7] + p[8] + p[9] + p[10])
    }
  }
  info.user_picked = pickPhones
  info.user_picked_status = []
  ctx.body = toImgUrl(toImgUrl(toImgUrl(info, 'cover_url'), 'bg_image'), 'share_image')
})


// 登录用户的，如果是发布者，则可以显示手机全号
giftRouter.get('/trade/detail/user/:gtid', authUse, async (ctx, next) => {
  const {user} = ctx
  const {gtid} = ctx.params
  let info = (await mysql.find(gift_trade.t, {
    j1: [gift_trade.uid, 'inner', users.id],
    j0: [gift_trade.gift_theme_id, 'inner', gift_theme.id],
    p0: [gift_trade.id, '=', gtid],
    p1: [gift_trade.status, '=', 2],
    r: 'p0 && p1',
    select: [
      gift_trade.id,
      gift_trade.article_id,
      gift_trade.picked_phone,
      gift_trade.title,
      gift_trade.cover_url,
      gift_trade.quantity,
      gift_trade.remain_quantity,
      gift_trade.trade_status,
      gift_trade.price,
      gift_trade.uid,
      gift_trade.des,
      gift_trade.message,
      users.nickname,
      users.avatar_url,
      gift_theme.title + ' as theme_title',
      gift_theme.bg_image,
      gift_theme.share_image,
      gift_theme.message + ' as theme_message'
    ],
  })).data.objects[0]
  let tempPhone = info.picked_phone ? info.picked_phone.split(',') : []
  if(tempPhone.length > 0 && user.id !== info.uid) {
    for(let i = 0; i < tempPhone.length; i++){
      tempPhone[i] = tempPhone[i][0] + tempPhone[i][1] + tempPhone[i][2] + '****' +
                     tempPhone[i][7] + tempPhone[i][8] + tempPhone[i][9] + tempPhone[i][10]
    }
  }
  info.picked_phone = tempPhone

  // 获取哪些手机号领取过了
  let pickedList = (await mysql.find(gift_picked.t, {
    p0: [gift_picked.gift_trade_id, '=', gtid],
    p1: [gift_picked.status, '=', 2],
    r: 'p0 && p1'
  })).data.objects
  let pickPhones: string[] = [], pickStatus: string[] = []
  for(let j = 0; j < pickedList.length; j++){
    let p = pickedList[j].verify_phone
    if(p) {
      if(user.id !== info.uid){
        pickPhones.push(p[0] + p[1] + p[2] + '****' + p[7] + p[8] + p[9] + p[10])
      }else{
        pickPhones.push(p)
        pickStatus.push(GIFT_TRADE_STATUS[pickedList[j].gift_trade_status])
      }
    }
  }
  info.user_picked = pickPhones
  info.user_picked_status = pickStatus

  ctx.body = toImgUrl(toImgUrl(toImgUrl(info, 'cover_url'), 'bg_image'), 'share_image')
})



// 查寻当前用户的领取信息
giftRouter.get('/trade/pick_info/:gpid', authUse, async (ctx, next) => {
  const {params} = ctx
  const {gpid} = params
  const pickinfo = (await mysql.get(gift_picked.t, gpid)).data
  ctx.body = pickinfo
})

// 更新用户的祝语
giftRouter.put('/update_message', authUse, async (ctx, next) => {
  const {user} = ctx
  const {id, message} = ctx.request.body
  const gift_t = (await mysql.get(gift_trade.t, id)).data
  if(gift_t.uid !== user.id){
    return ctx.body ={
      status: 0,
      message: '暂无权限'
    }
  }
  await mysql.update(gift_trade.t, id, {
    message: message,
  })
  ctx.body = {
    status: 2,
    message: '更新成功'
  }
})

// 添加领取的手机号
giftRouter.put('/picked_phone/add', authUse, async (ctx, next) => {
  const {user} = ctx
  const {id, phone} = ctx.request.body
  const gift_t = (await mysql.get(gift_trade.t, id)).data
  if(gift_t.uid !== user.id){
    return ctx.body = {
      status: 0,
      message: '暂无权限'
    }
  }
  let pick = gift_t.picked_phone
  if(pick.indexOf(phone) > -1) {
    return ctx.body = {
      status: 0,
      message: '该手机号已存在'
    }
  }
  if(pick){
    pick = pick + ',' + phone
  }else{
    pick = phone
  }
  await mysql.update(gift_trade.t, id, {
    picked_phone: pick,
  })
  let tempPhone = pick ? pick.split(',') : []
  ctx.body = {
    pickList: tempPhone,
    status: 2,
    message: '添加成功'
  }
})

// 删除可领取手机号
giftRouter.put('/picked_phone/del', authUse, async (ctx, next) => {
  const {user} = ctx
  const {id, phone} = ctx.request.body
  const gift_t = (await mysql.get(gift_trade.t, id)).data
  if(gift_t.uid !== user.id){
    return ctx.body = {
      status: 0,
      message: '暂无权限'
    }
  }
  const gift_pick_num = (await mysql.count(gift_picked.t, {
    p0: [gift_picked.verify_phone, '=', phone],
    p1: [gift_picked.gift_trade_id, '=', gift_t.id],
    p2: [gift_picked.status, '=', 2],
    r: 'p0 && p1 && p2'
  })).data
  if(gift_pick_num > 0){
    return ctx.body = {
      status: 0,
      message: '该手机号已有领取记录'
    }
  }
  let pick = gift_t.picked_phone ? gift_t.picked_phone.split(',') : []
  if(pick.indexOf(phone) === -1) {
    return ctx.body = {
      status: 0,
      message: '该手机号不存在'
    }
  }
  pick.splice(pick.indexOf(phone), 1)
  
  await mysql.update(gift_trade.t, id, {
    picked_phone: pick.toString(),
  })
  let tempPhone = pick
  ctx.body = {
    pickList: tempPhone,
    status: 2,
    message: '删除成功'
  }
})




//发验证码
giftRouter.post('/send_sms', authUse, async (ctx, next) => {
  const {phone} = ctx.request.body
  await sendSms(phone)
  ctx.body = {
    status: 2,
    message: '验证码已发送'
  }
})



// 用户收下礼物
giftRouter.post('/recive', authUse, async (ctx, next) => {
  const {user} = ctx
  const {gtid, verfiyPhone, code} = ctx.request.body


  let result: any = {}

  // 验证的手机号 和 验证码
  let isPhoneOk = await smsVerify(verfiyPhone, code)
  
  if(!isPhoneOk){
    result = {
      status: 0,
      message: '验证码错误或已过期'
    }
    return ctx.body = result
  }


  const {begin, run, commit, rollback, locks} = await mysql.transaction()

  await begin(async () => {
    try{
      const sql_gift_t = (await mysql.get(gift_trade.t, gtid, {}, 'sentence')) + locks.exclusive_locks
      const giftTrade = (await run(sql_gift_t)).data
      if(giftTrade.uid === user.id){
        result = {
          status: 0,
          message: '不能领取自己的礼物哦'
        }
        return await rollback()
      }
      if(giftTrade.picked_phone.split(',').indexOf(verfiyPhone) === -1){
        // 手机号不在礼物内，不可以领取
        result = {
          status: 0,
          message: '该手机号不能领取此礼物'
        }
        return await rollback()
      }
      if(giftTrade.remain_quantity <= 0){
        result = {
          status: 0,
          message: '礼物已被领完啦'
        }
        return await rollback()
      }

      const sql_is_pick = await mysql.find(gift_picked.t, {
        p0: [gift_picked.verify_phone, '=', verfiyPhone],
        p1: [gift_picked.gift_trade_id, '=', gtid],
        p2: [gift_picked.status, '=', 2],
        r: 'p0 && p1 && p2'
      }, 'sentence')
      const pickList = (await run(sql_is_pick)).data.objects
      if(pickList.length > 0){
        // 已经领取了
        result = {
          status: 2,
          message: '该手机号已领取',
          gpid: pickList[0].id,
          gift_trade_status: pickList[0].gift_trade_status,
        }
        return await rollback()
      }
      const tradeNo = '2' + Date.now().toString() + randomCode(6, '0')
      const sql_add_picked = await mysql.set(gift_picked.t, {
        article_id: giftTrade.article_id,
        product_id: giftTrade.product_id,
        title: giftTrade.title,
        des: giftTrade.des,
        cover_url: giftTrade.cover_url,
        uid: user.id,
        gift_trade_status: 8,
        quantity: 1,
        picked_no: tradeNo,
        price: giftTrade.price,
        total_price: giftTrade.total_price,
        business_uid: giftTrade.business_uid,
        express_no: giftTrade.express_no,
        gift_trade_id: gtid,
        verify_phone: verfiyPhone
      }, 'sentence')
      const sql_upd_gift = await mysql.update(gift_trade.t, gtid, {
        remain_quantity: ['incr', -1]
      }, 'sentence')
      let respick = await run(sql_add_picked)
      await run(sql_upd_gift)
      
      result = {
        status: 2,
        message: '恭喜您，礼物已领取！',
        gpid: respick.data.insertId,
        gift_trade_status: 8,
      }
      await commit()
    }catch(err: any){
      await rollback()
      throw new Error(err)
    }
  })
  ctx.body = result
})



// 收礼人，更新他的收礼地址
giftRouter.put('/add/address', authUse, async (ctx, next) => {
  const {user} = ctx
  const {name, phone, address, province, city, area, addr, gpid} = ctx.request.body
  await mysql.update(gift_picked.t, gpid, {
    phone: phone,
    name: name,
    address: address,
    province: province,
    city: city,
    area: area,
    addr: addr,
  })
  ctx.body = {
    status: 2,
    message: '操作成功'
  }
})


// 用户确认礼物发货
giftRouter.post('/start/express', authUse, async (ctx, next) => {
  const {user} = ctx
  const {name, phone, address, province, city, area, addr, gpid} = ctx.request.body

  // 获取礼物信息
  const giftInfo = (await mysql.find(gift_picked.t, {
    j0: [gift_picked.gift_trade_id, 'inner', gift_trade.id],
    j1: [gift_picked.product_id, 'inner', product.id],
    p0: [gift_picked.id, '=', gpid],
    r: 'p0',
    select: [
      product.name,
      product.mobile,
      product.company,
      product.province,
      product.city,
      product.area,
      product.addr,
      product.weight,
      product.space_x,
      product.space_y,
      product.space_z,
      product.title,
      gift_picked.article_id,
      gift_picked.cover_url,
      gift_picked.picked_no,
      gift_picked.quantity,
    ]
  })).data.objects[0]

  // 呼叫快递的，如果有寄件人手机号，就叫快递
  if(giftInfo.mobile){
    const expressData = await addOneExpress({
      add_source: 0,
      order_id: giftInfo.picked_no,
      openid: user.openid,
      delivery_id: EXPRESS_SF.ID,
      biz_id: EXPRESS_SF.BIZ_ID,
      sender: {
        name: giftInfo.name,
        mobile: giftInfo.mobile,
        company: giftInfo.company || '天天购享家',
        province: giftInfo.province,
        city: giftInfo.city,
        area: giftInfo.area,
        address: giftInfo.addr
      },
      receiver: {
        name: name,
        mobile: phone,
        province: province,
        city: city,
        area: area,
        address: addr
      },
      cargo: {
        count: giftInfo.quantity,
        weight: giftInfo.weight,
        space_x: giftInfo.space_x,
        space_y: giftInfo.space_y,
        space_z: giftInfo.space_z,
        detail_list: [
          {
            name: giftInfo.title,
            count: giftInfo.quantity,
          }
        ]
      },
      shop: {
        wxa_path: "/pages/article/ArticleDetail?aid=" + giftInfo.article_id,
        img_url: process.env.STATIC_URL + giftInfo.cover_url,
        goods_name: giftInfo.title,
        goods_count: giftInfo.quantity
      },
      insured: {
        use_insured: 0,
        insured_value: 0
      },
      service: {
        service_type: EXPRESS_SF.SERVICE_TYPE,
        service_name: EXPRESS_SF.SERVICE_NAME
      },
      expect_time: (new Date().getTime() / 1000 >>> 0) + 30 * 60,
    })
    if(expressData.errcode === 0){
      // 下运单成功，更新订单状态
      await mysql.update(gift_picked.t, gpid, {
        phone: phone,
        name: name,
        address: address,
        province: province,
        city: city,
        area: area,
        addr: addr,
        express_no: expressData.waybill_id,
        gift_trade_status: 15,
      })
      return ctx.body = {
        status: 2,
        message: '礼物等待揽收'
      }
    }
  }
  //不叫快递的流程
  await mysql.update(gift_picked.t, gpid, {
    phone: phone,
    name: name,
    address: address,
    province: province,
    city: city,
    area: area,
    addr: addr,
    gift_trade_status: 10,
  })
  ctx.body = {
    status: 2,
    message: '礼物正在准备发货中'
  }
})



// 贺卡主题列表，
// 送礼的贺卡列表
giftRouter.get('/gift_theme_list', authUse, async (ctx, next) => {
  let list = (await mysql.find(gift_theme.t, {
    p0: [gift_theme.status, '=', 2],
    r: 'p0'
  })).data.objects
  for(let i = 0; i < list.length; i++){
    list[i].bg_image_url = process.env.STATIC_URL + list[i].bg_image
    list[i].share_image_url = process.env.STATIC_URL + list[i].share_image
  }
  ctx.body = list
})

// 更改主题
giftRouter.put('/gift_theme/change', authUse, async (ctx, next) => {
  const {user} = ctx
  const {theme_id, gtid} = ctx.request.body

  if((await mysql.get(gift_trade.t, gtid)).data.uid !== user.id){
    return ctx.body = {
      status: 0,
      message: '没有权限'
    }
  }
  const temp = (await mysql.get(gift_theme.t, theme_id)).data
  
  let info = {
    bg_image: temp.bg_image,
    share_image: temp.share_image,
    message: temp.message
  }
  await mysql.update(gift_trade.t, gtid, {
    gift_theme_id: theme_id,
    message: temp.message
  })
  ctx.body = toImgUrl(toImgUrl(info, 'share_image'), 'bg_image')
})

// 获取用户购买的礼物的列表
giftRouter.get('/user/gift_buy/:page', authUse, async (ctx, next) => {
  const {user, params} = ctx
  const LIMIT = 10
  const {page='1'} = params
  let tempList = (await mysql.find(gift_trade.t, {
    j0: [gift_trade.gift_theme_id, 'inner', gift_theme.id],
    p0: [gift_trade.status, '=', 2],
    p2: [gift_trade.uid, '=', user.id],
    r: 'p0 && p2',
    page: +page,
    limit: LIMIT,
    orderBy: ['-' + gift_trade.created_at],
    select: [
      gift_trade.id,
      gift_trade.price,
      gift_trade.article_id,
      gift_trade.total_price,
      gift_trade.trade_no,
      gift_trade.title,
      gift_trade.cover_url,
      gift_trade.quantity,
      gift_trade.remain_quantity,
      gift_trade.trade_status,
      gift_trade.created_at,
      gift_trade.picked_phone,
      gift_theme.title + ' as theme_title'
    ]
  })).data.objects
  let list: any = []
  for(let l of tempList){
    let tempPhone = l.picked_phone ? l.picked_phone.split(',') : []
    if(tempPhone.length > 0) {
      for(let i = 0; i < tempPhone.length; i++){
        tempPhone[i] = tempPhone[i][0] + tempPhone[i][1] + tempPhone[i][2] + '****' +
                      tempPhone[i][7] + tempPhone[i][8] + tempPhone[i][9] + tempPhone[i][10]
      }
    }
    l.picked_phone = tempPhone
    list.push({
      ...l,
      trade_status_name: l.trade_status === 20 ? (l.remain_quantity <= 0 ? '已领完' : '待领取') : GIFT_TRADE_STATUS[l.trade_status],
      trade_status: l.trade_status === 20 ? (l.remain_quantity <= 0 ? 30 : 25) : l.trade_status
    })
  }
  ctx.body = {
    list: toImgUrls(list, 'cover_url'),
    have: list.length < LIMIT ? false : true
  }
})


// 获取用户 收到的礼物列表
giftRouter.get('/user/gift_recive/:page', authUse, async (ctx, next) => {
  const {user, params} = ctx
  const LIMIT = 10
  const {page='1'} = params
  let tempList = (await mysql.find(gift_picked.t, {
    j0: [gift_picked.gift_trade_id, 'inner', gift_trade.id],
    j1: [gift_trade.uid, 'inner', users.id],
    j2: [gift_trade.gift_theme_id, 'inner', gift_theme.id],
    p0: [gift_picked.status, '=', 2],
    p2: [gift_picked.uid, '=', user.id],
    r: 'p0 && p2',
    page: +page,
    limit: LIMIT,
    orderBy: ['-' + gift_picked.created_at],
    select: [
      gift_picked.id,
      gift_picked.price,
      gift_picked.article_id,
      gift_picked.total_price,
      gift_picked.picked_no,
      gift_picked.title,
      gift_picked.cover_url,
      gift_picked.quantity,
      gift_picked.name,
      gift_picked.phone,
      gift_picked.address,
      gift_picked.gift_trade_status,
      gift_picked.created_at,
      gift_picked.express_no,
      gift_picked.gift_trade_id,
      users.nickname + ' as sender_nickname',
      users.avatar_url + ' as sender_avatar_url',
      gift_theme.title + ' as theme_title',
      gift_theme.message + ' as theme_message'
    ]
  })).data.objects
  let list: any = []
  for(let l of tempList){
    list.push({
      ...l,
      trade_status_name: GIFT_TRADE_STATUS[l.gift_trade_status]
    })
  }
  ctx.body = {
    list: toImgUrls(list, 'cover_url'),
    have: list.length < LIMIT ? false : true
  }
})

// 用户没有送出或收取的礼物，的红点提示
giftRouter.get('/notice', authUse, async (ctx, next) => {
  const {user} = ctx
  // 查寻用户已经购买的礼物，但没领取完的数量
  const canReciveNum = (await mysql.count(gift_trade.t, {
    p0: [gift_trade.trade_status, '=', 20],
    p1: [gift_trade.remain_quantity, '>', 0],
    p2: [gift_trade.uid, '=', user.id],
    r: 'p0 && p1 && p2'
  })).data

  const needReciveNum = (await mysql.count(gift_picked.t, {
    p0: [gift_picked.gift_trade_status, '=', 8],
    p1: [gift_picked.uid, '=', user.id],
    r: 'p0 && p1'
  })).data
  ctx.body = {
    send_num: canReciveNum,
    recive_num: needReciveNum
  }
})



// 用户手机号查寻礼物状态
giftRouter.get('/status_by_phone/:phone', authUse, async(ctx, next) => {
  const {user, params} = ctx
  const {phone} = params

  // 已领取的
  let l2 = (await mysql.find(gift_picked.t, {
    p0: [gift_picked.verify_phone, '=', phone],
    p1: [gift_picked.status, '=', 2],
    p2: [gift_picked.uid, '=', user.id],
    r: 'p0 && p1 && p2',
    select: [
      gift_picked.title,
      gift_picked.des,
      gift_picked.cover_url,
      gift_picked.price,
      gift_picked.created_at,
      gift_picked.id + ' as gpid',
      gift_picked.gift_trade_id + ' as gtid',
      gift_picked.gift_trade_status + ' as gift_status'
    ],
    orderBy: ['-' + gift_picked.created_at]
  })).data.objects

  let gtids: number[] = []
  for(let i = 0; i < l2.length; i++){
    gtids.push(l2[i].gtid)
    l2[i].gift_status_name = GIFT_TRADE_STATUS[l2[i].gift_status]
  }

  // 获取未领取的
  let l1 = (await mysql.find(gift_trade.t, {
    p0: [gift_trade.picked_phone, 'like', `%${phone}%`],
    p1: [gift_trade.trade_status, '=', 20],
    p2: [gift_trade.remain_quantity, '>', 0],
    p3: [gift_trade.id, 'notIn', gtids],
    r: gtids.length > 0 ? 'p0 && p1 && p2 && p3' : 'p0 && p1 && p2',
    select: [
      gift_trade.title,
      gift_trade.des,
      gift_trade.cover_url,
      gift_trade.price,
      gift_trade.created_at,
      gift_trade.id + ' as gtid',
    ],
    orderBy: ['-' + gift_trade.created_at]
  })).data.objects

  l1 = l1.map((item) => ({
    ...item,
    gift_status_name: '待领取',
    gift_status: 0,
  }))
  ctx.body = toImgUrls([...l1, ...l2], 'cover_url')
})


// 给未领取礼物的用户发送提醒
giftRouter.post('/send/receive_notice', authUse, async (ctx, next) => {
  const {user} = ctx
  const {gtid} = ctx.request.body
  const giftInfo = (await mysql.get(gift_trade.t, gtid)).data
  const REDIS_TABLE = 'gift_sms_notice'
  let phoneList = giftInfo.picked_phone.split(',')

  let sendNum = (await redis.get(REDIS_TABLE, gtid)).data.num || '0'
  
  if(+sendNum >= 3){
    return ctx.body = {status: 0, message: '很抱歉，提醒次数已用完'}
  }

  let pickList = (await mysql.find(gift_picked.t, {
    p0: [gift_picked.gift_trade_id, '=', gtid],
    p1: [gift_picked.status, '=', 2],
    r: 'p0 && p1'
  })).data.objects
  let pickphone: string[] = []
  for(let i = 0; i < pickList.length; i++){
    pickphone.push(pickList[i].verify_phone)
  }

  let sendPhone: string[] = []
  for(let n = 0; n < phoneList.length; n++){
    if(pickphone.indexOf(phoneList[n]) === -1){
      sendPhone.push(phoneList[n])
    }
  }

  // 发送短信
  for(let j = 0; j < sendPhone.length; j++){
    sendSmsGiftNotice(user.nickname, giftInfo.title, sendPhone[j])
  }
  if(+sendNum === 0){
    await redis.set(REDIS_TABLE, {
      id: gtid,
      num: 1
    })
  }else{
    await redis.update(REDIS_TABLE, gtid, {
      num: ['incr', 1]
    })
  }
  ctx.body = {status: 2, message: '提醒短信已发送，剩余提醒次数：' + (3 - (+sendNum) - 1)}
})

export default giftRouter
