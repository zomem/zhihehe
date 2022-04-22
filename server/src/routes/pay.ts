import {mysql} from 'access-db'
import {Decimal} from 'decimal.js'
import axios from 'axios'
import {
  article, 
  product, 
  users, 
  trade, 
  sale_user_rela, 
  sale_rela,
  share_money,
  wait_paid,
  shop_cart,
  gift_picked,
  gift_trade,
  users_account,
  users_account_record,
  account_recharge
} from '../constants/table'
import {WEAPP, EXPRESS_SF, PAY_WAY, PRIVATE_KEY} from '../constants/constants'
import {authUse} from '../middlewares/auth'
import {randomCode, getTime, isRole} from '../utils/utils'
import {productCacheQuantity} from '../utils/cache'


const schedule = require('node-schedule')

const Payment = require('../utils/wxPay')
const payRouter = require('koa-router')()

payRouter.prefix('/pay')


// TODo 采用引入文件的方式引入。。请检查其他地方是不是也改了

const payment = new Payment({
  appid: WEAPP.APP_ID,
  mchid: process.env.WECHAT_PAY_MCH_ID,
  private_key: PRIVATE_KEY,
  serial_no: process.env.WECHAT_PAY_SERIAL,
  apiv3_private_key: process.env.WECHAT_PAY_APIV3,
  notify_url: process.env.WXPAY_NOTIFY_URL, // 支付退款结果通知的回调地址
})




const PREPAY_TIME = 20 * 60 // 120 * 60  //秒




// 生成一个运单
const addOneExpress = async (expressInfo) => {
  let accessToken = (await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP.APP_ID}&secret=${WEAPP.APP_SECRET}`)).data.access_token
  let addorder = (await axios.post(`https://api.weixin.qq.com/cgi-bin/express/business/order/add?access_token=${accessToken}`, expressInfo)).data
  return addorder
}

// 支付回调接口
// plaintext ={
//   mchid: '1490441182',
//   appid: 'wx11f9efb21118e0bf',
//   out_trade_no: 'JG_1631107900035',
//   transaction_id: '42000012 1620210 9085650103442',
//   trade_type: 'JSAPI',
//   trade_state: 'SUCCESS',
//   trade_state_desc: '支付成功',
//   bank_type: 'OTHERS',
//   attach: '',
//   success_time: '2021-09-08T21:31:47+08:00',
//   payer: { openid: 'oYXUj5B9qIb17Du3S1RjY-o5h6A4' },
//   amount: { total: 1, payer_total: 1, currency: 'CNY', payer_currency: 'CNY' }
// }
// 分账返回》》》》 {
//   status: 200,
//   data: {
//     order_id:"30002710112021091317950088011",
//     out_order_no:"P16315152784752014393",
//     receivers:[
//       {
//         account:"oYXUj5B9qIb17Du3S1RjY-o5h6A4",
//         amount:5,
//         create_time:"2021-09-13T14:43:24+08:00",
//         description:"水果礼盒的销售分成。",
//         detail_id:"36002710112021091323318394260",
//         finish_time:"1970-01-01T08:00:00+08:00",
//         result:"PENDING",
//         type:"PERSONAL_OPENID"
//       },{
//         account:"1490441182",
//         amount:45,
//         create_time:"2021-09-13T14:43:24+08:00",
//         description:"解冻给分账方",
//         detail_id:"36002710112021091323318394261",
//         finish_time:"1970-01-01T08:00:00+08:00",
//         result:"PENDING",
//         type:"MERCHANT_ID"
//       }
//     ],
//     state:"PROCESSING",
//     transaction_id:"4200001232202109131545993279"
//   }
// }

payRouter.post('/notify_url/action', async (ctx, next) => {
  var {resource={}} = ctx.request.body
  const plaintext = payment.decodeResource(resource)
  const {mchid, appid, out_trade_no, trade_state, trade_type, transaction_id, payer, amount, attach} = plaintext
  if(mchid !== process.env.WECHAT_PAY_MCH_ID) {
    ctx.status = 403
    ctx.body = {   
      code: "ERROR",
      message: "失败"
    }
    return
  }
  if(appid !== WEAPP.APP_ID){
    ctx.status = 403
    ctx.body = {   
      code: "ERROR",
      message: "失败"
    }
    return
  }
  if(trade_state !== 'SUCCESS'){
    ctx.status = 403
    ctx.body = {   
      code: "ERROR",
      message: "失败"
    }
    return
  }

  if(attach.indexOf('8_') > -1){
    // 充值，支付回调
    let arid = attach.split('_')[1]
    let userData = (await mysql.get(users.t, {openid: payer.openid})).data as any
    let userAccountId = (await mysql.get(users_account.t, {uid: userData.id})).data.id
    if(!userAccountId){
      userAccountId = (await mysql.set(users_account.t, {uid: userData.id})).data.insertId
    }
    let accountRecharge = (await mysql.get(account_recharge.t, arid)).data

    if(new Decimal(accountRecharge.pay_price).mul(new Decimal(100)).toNumber() !== amount.total){
      ctx.status = 403
      ctx.body = {   
        code: "ERROR",
        message: "失败"
      }
      return
    }

    let {run, begin, rollback, commit} = await mysql.transaction()

    await begin(async () => {
      try{
        let sql1 = await mysql.update(users_account.t, {uid: userData.id}, {
          balance: ['incr', accountRecharge.price],
        }, 'sentence')
        let accountRecord = {
          users_account_id: userAccountId,
          uid: userData.id,
          content: `余额充值${accountRecharge.price}元；实付${accountRecharge.pay_price}元。`,
          type: 11,
          change_balance: accountRecharge.price,
          obj: JSON.stringify({
            ...accountRecharge,
            out_trade_no: out_trade_no,
            transaction_id: transaction_id,
          })
        }
        let sql2 = await mysql.set(users_account_record.t, accountRecord, 'sentence')
        
        await run(sql1)
        await run(sql2)
        await commit()
      }catch(err: any){
        await rollback()
        throw new Error(err)
      }
    })
    return ctx.body = {   
      code: "SUCCESS",
      message: "成功"
    }
  }


  // 商品，礼物的购买回调
  let orderInfo
  if(attach === '3'){
    orderInfo = (await mysql.get(gift_trade.t, {trade_no: out_trade_no})).data
  }else{
    orderInfo = (await mysql.get(trade.t, {trade_no: out_trade_no})).data
  }
  const userInfo = (await mysql.get(users.t, orderInfo.uid)).data
  const quoterInfo = (await mysql.get(users.t, orderInfo.business_uid)).data
  const salerInfo = (await mysql.get(users.t, orderInfo.sale_uid)).data
  const productInfo = (await mysql.get(product.t, orderInfo.product_id)).data

  if(!orderInfo.id || !userInfo.id){
    ctx.status = 403
    ctx.body = {   
      code: "ERROR",
      message: "失败"
    }
    return
  }
  if(userInfo.openid !== payer.openid){
    ctx.status = 403
    ctx.body = {   
      code: "ERROR",
      message: "失败"
    }
    return
  }

  if(new Decimal(orderInfo.total_price).mul(new Decimal(100)).toNumber() !== amount.total){
    ctx.status = 403
    ctx.body = {   
      code: "ERROR",
      message: "失败"
    }
    return
  }

  const nowTime = getTime('date_time')
  // 更新购买用户的订单信息，同时更改 待支付表的记录为删除
  const {begin, rollback, run, commit} = await mysql.transaction()
  await begin(async () => {
    try{
      if(attach === '3'){
        await run(
          await mysql.update(gift_trade.t, orderInfo.id as number, {
            transaction_id: transaction_id,
            trade_type: trade_type,
            trade_status: 20,  //礼物的订单，直接为已完成
            updated_at: nowTime
          }, 'sentence')
        )
      }else{
        await run(
          await mysql.update(trade.t, orderInfo.id as number, {
            transaction_id: transaction_id,
            trade_type: trade_type,
            trade_status: 10,  //待发货
            updated_at: nowTime
          }, 'sentence')
        )
        await run(
          await mysql.update(wait_paid.t, {trade_id: orderInfo.id as number}, {
            status: 0
          }, 'sentence')
        )
      }
      await commit()
    }catch(err: any){
      await rollback()
    }
  })

  // 生成一个快递单，在有商家寄件地址的时候（正常购买流程，才有的叫快递）
  if(productInfo.mobile && attach !== '3'){  // attach为8_x时，上面已经返回了。
    const expressData = await addOneExpress({
      add_source: 0,
      order_id: orderInfo.trade_no,
      openid: userInfo.openid,
      delivery_id: EXPRESS_SF.ID,
      biz_id: EXPRESS_SF.BIZ_ID,
      sender: {
        name: productInfo.name,
        mobile: productInfo.mobile,
        company: productInfo.company || '天天购享家',
        province: productInfo.province,
        city: productInfo.city,
        area: productInfo.area,
        address: productInfo.addr
      },
      receiver: {
        name: orderInfo.name,
        mobile: orderInfo.phone,
        province: orderInfo.province,
        city: orderInfo.city,
        area: orderInfo.area,
        address: orderInfo.addr
      },
      cargo: {
        count: orderInfo.quantity,
        weight: productInfo.weight,
        space_x: productInfo.space_x,
        space_y: productInfo.space_y,
        space_z: productInfo.space_z,
        detail_list: [
          {
            name: orderInfo.title,
            count: orderInfo.quantity,
          }
        ]
      },
      shop: {
        wxa_path: "/pages/article/ArticleDetail?aid=" + orderInfo.article_id,
        img_url: process.env.STATIC_URL + orderInfo.cover_url,
        goods_name: orderInfo.title,
        goods_count: orderInfo.quantity
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
      await mysql.update(trade.t, orderInfo.id, {
        express_no: expressData.waybill_id,
        trade_status: 15,
      })
    }
  }

  // 记录报价员的分成（成本）
  let quoter_money = new Decimal(orderInfo.cost || 0).mul(new Decimal(100)).mul(new Decimal(orderInfo.quantity)).toNumber()
  if(isRole('quoter', quoterInfo.role) && quoter_money > 0){
    const quoterFinish = (await mysql.count(share_money.t, {
      p0: [share_money.out_order_no, '=', 'P' + orderInfo.trade_no],
      p1: [share_money.transaction_id, '=', transaction_id],
      p2: [share_money.account, '=', quoterInfo.openid],
      p3: [share_money.amount, '=', quoter_money],
      p5: [share_money.type, '=', 'QUOTER_OPENID'],
      r: 'p0 && p1 && p2 && p3 && p5'
    })).data
    if(quoterFinish === 0){
      await mysql.set(share_money.t, {
        out_order_no: 'P' + orderInfo.trade_no,
        transaction_id: transaction_id,
        account: quoterInfo.openid,
        amount: quoter_money,
        create_at:  nowTime,
        description: orderInfo.title + '的成本提取(报价员)' + (orderInfo.is_group === 1 ? '【团购】' : ''),
        finish_at: nowTime,
        type: 'QUOTER_OPENID',
        is_group: orderInfo.is_group || 0
      })
    }
  }
  // 分账预处理 ， 用户是销售员才分成
  if(isRole('salespeople', salerInfo.role) && amount.total > 0){
    //同时，如果用户没有销售员，则将用户绑定到该销售员下
    if((await mysql.count(sale_user_rela.t, {
      p1: [sale_user_rela.uid, '=', orderInfo.uid],
      r: 'p1'
    })).data === 0){
      await mysql.set(sale_user_rela.t, {
        sale_uid: orderInfo.sale_uid,
        uid: orderInfo.uid,
        created_at: nowTime,
      })
    }
    // 获取总销售信息
    let fUserInfo = (await mysql.get(users.t, orderInfo.f_sale_uid)).data
    let sale_share_money = new Decimal(orderInfo.sale_cost || 0).mul(new Decimal(100)).mul(new Decimal(orderInfo.quantity)).toNumber()
    let f_sale_share_money = new Decimal(orderInfo.f_sale_cost || 0).mul(new Decimal(100)).mul(new Decimal(orderInfo.quantity)).toNumber()
    

    // 判断分成比例是否小于29%，如果超过了，就不分成
    if((sale_share_money + f_sale_share_money) / amount.total >= 0.29){
      ctx.status = 403
      ctx.body = {   
        code: "ERROR",
        message: "失败"
      }
      return
    }

    let receiversList: any[] = []
    if(sale_share_money > 0){
      receiversList.push({
        type: 'PERSONAL_OPENID', // MERCHANT_ID 商户
        account: salerInfo.openid,
        amount: sale_share_money,
        description: orderInfo.title + '的销售分成' + (orderInfo.is_group === 1 ? '【团购】' : '')
      })
    }

    if(isRole('salesleader', fUserInfo.role) && f_sale_share_money > 0){
      if(salerInfo.id !== fUserInfo.id){
        receiversList.push({
          type: 'PERSONAL_OPENID', // MERCHANT_ID 商户
          account: fUserInfo.openid,
          amount: f_sale_share_money,
          description: orderInfo.title + '的总销售分成' + (orderInfo.is_group === 1 ? '【团购】' : '')
        })
      }else{
        // 是同一个人，就合成一条
        receiversList = [{
          type: 'PERSONAL_OPENID', // MERCHANT_ID 商户
          account: fUserInfo.openid,
          amount: new Decimal(sale_share_money).add(new Decimal(f_sale_share_money)).toNumber(),
          description: orderInfo.title + '的总销售分成' + (orderInfo.is_group === 1 ? '【团购】' : '')
        }]
      }
    }

    // 经过2分钟之后，进行分账操作
    setTimeout(async () => {
      // 分账，当有分账时，才进行分账
      if(receiversList.length > 0){
        // 添加接收方
        await payment.addreceivers({
          type: 'PERSONAL_OPENID',
          account: salerInfo.openid,
          relation_type: 'PARTNER'
        })
        if(isRole('salesleader', fUserInfo.role) && salerInfo.id !== fUserInfo.id){
          await payment.addreceivers({
            type: 'PERSONAL_OPENID',
            account: fUserInfo.openid,
            relation_type: 'PARTNER'
          })
        }

        let share = await payment.profitsharing({
          transaction_id: transaction_id,
          out_order_no: 'P' + orderInfo.trade_no,
          unfreeze_unsplit: true,
          receivers: receiversList
        })
        let sharedata = JSON.parse(share.data)
        if(sharedata.state === 'PROCESSING'){
          // 正在分账中，记录用户的分账
          let sharetmie = getTime('date_time')
          let shareMoney: any = []
          for(let i = 0; i < sharedata.receivers.length; i++){
            shareMoney.push({
              order_id: sharedata.order_id,
              out_order_no: sharedata.out_order_no,
              transaction_id: sharedata.transaction_id,
              account: sharedata.receivers[i].account,
              amount: sharedata.receivers[i].amount,
              create_at:  sharetmie,
              description: sharedata.receivers[i].description,
              detail_id: sharedata.receivers[i].detail_id,
              finish_at: sharetmie,
              type: sharedata.receivers[i].type,
              is_group: orderInfo.is_group || 0
            })
          }
          await mysql.setmany(share_money.t, shareMoney)
  
          //再计时2分钟后，进行查寻分账是否成功
          setTimeout(async () => {
            let tempGetShare = await payment.getProfitsharing({
              out_order_no: sharedata.out_order_no,
              transaction_id: sharedata.transaction_id,
            })
            let shareendData = JSON.parse(tempGetShare.data)
            let updateData: any = []
            for(let j = 0; j < shareendData.receivers.length; j++){
              updateData.push({
                out_order_no: shareendData.out_order_no,
                account: shareendData.receivers[j].account,
                type: shareendData.receivers[j].type,
                share_status: shareendData.receivers[j].result === 'SUCCESS' ? 2 : 
                              shareendData.receivers[j].result === 'PENDING' ? 1 : 5,
              })
            }
            await mysql.updatemany(share_money.t, ['out_order_no', 'account', 'type'], updateData)
           
          }, 2 * 60 * 1000)
        }
      }
    }, 2 * 60 * 1000)
  }
  ctx.body = {   
    code: "SUCCESS",
    message: "成功"
  }
})



// 统一下单
payRouter.get('/test', authUse, async function(ctx, next) {
  const {user} = ctx
  let preData = await payment.jsapi({
    description:'水果兄弟，支付测试',
    out_trade_no: Date.now().toString(),
    amount:{
      total: 1  //金额，单位为分
    },
    payer:{
      openid: user.openid
    },
  })
  let wxData = {
    signType: 'RSA',
    paySign: '',
    package: `prepay_id=${JSON.parse(preData.data).prepay_id}`,
    nonceStr: randomCode(32, '0aA'),
    timeStamp: (((getTime('stamp') as number) / 1000) >>> 0).toString()
  }
  wxData.paySign = payment.rsaSign(`${WEAPP.APP_ID}\n${wxData.timeStamp}\n${wxData.nonceStr}\n${wxData.package}\n`, PRIVATE_KEY)
  ctx.body = wxData
})



// 购买文章里的水果，下单
interface IFruitsResult {
  status: number,
  message: string
}
payRouter.post('/buy/article/fruits', authUse, async function(ctx, next) {
  const {user} = ctx
  const {
    pid, 
    aid, 
    fuid,
    buyNum=1,
    name, 
    phone, 
    address,
    province,
    city,
    area,
    addr,
  } = ctx.request.body

  let result: IFruitsResult = {
    status: 0,
    message: ''
  }
  let wxData: any = {}, sale_uid = fuid, f_sale_uid

  if(!pid || !aid){
    result = {
      status: 0,
      message: '未找到相关商品'
    }
    return ctx.body = result
  }

  // 如果用户有销售，那就覆盖转发的销售
  let tempRela = (await mysql.get(sale_user_rela.t, {uid: user.id})).data
  if(tempRela.sale_uid) sale_uid = tempRela.sale_uid

  if(sale_uid){
    let saleUser = (await mysql.get(users.t, sale_uid)).data
    if(!isRole('salespeople', saleUser.role)){
      // 用户不是销售
      sale_uid = 0
    }
  }
  const tempArt = (await mysql.get(article.t, aid)).data
  
  if(tempArt.product_id !== pid){
    result = {
      status: 0,
      message: '文章信息和商品不相符'
    }
    return ctx.body = result
  }


  // 查寻商品是否足够，并下单
  let {run, begin, rollback, commit, locks} = await mysql.transaction()
  let trade_id

  let tempFSData = (await mysql.find(sale_rela.t, {
    p0: [sale_rela.sale_uid, '=', sale_uid],
    p1: [sale_rela.status, '=', 2],
    r: 'p0 && p1'
  })).data.objects
  let fSaleData = tempFSData.length > 0 ? tempFSData[0] : {}
  let fSaleUserInfo = (await mysql.get(users.t, fSaleData.f_sale_uid)).data
  
  if(isRole('salesleader', fSaleUserInfo.role)){
    // 是总销售
    f_sale_uid = fSaleData.f_sale_uid
  }
  
  await begin(async () => {
    try{
      // 需要加锁的时候，就直接在返回的sql语句后面加上相应的锁，注意要将await括起来
      let sql1 = (await mysql.get(product.t, pid, {}, 'sentence')) + locks.exclusive_locks
      let pInfo = (await run(sql1)).data
      if(pInfo.quantity <= 0){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已被抢光啦'
        }
        return await rollback()
      }
      if(pInfo.quantity < buyNum){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】的数量不足了'
        }
        return await rollback()
      }
      if(pInfo.status !== 20){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已下架了'
        }
        return await rollback()
      }
      let sql2 = await mysql.update(product.t, pid, {quantity: ['incr', -buyNum]}, 'sentence')
      const tradeNo = Date.now().toString() + randomCode(7, '0')
      const dateTime = getTime('date_time')
      let orData = {
        article_id: aid,
        product_id: pid,
        title: pInfo.title,
        des: pInfo.des || '',
        cover_url: pInfo.img_urls.split(',')[0] || '',
        uid: user.id,  // 购买者的id
        business_uid: pInfo.uid,  // 发布者（报价员）的id
        sale_uid: sale_uid || null,  //销售的uid,
        f_sale_uid: f_sale_uid || null,
        phone: phone,
        name: name,
        address: address,
        province: province,
        city: city,
        area: area,
        addr: addr,
        trade_status: 5, // 待支付
        cost: pInfo.cost || null,
        sale_cost: pInfo.sale_cost || null,
        f_sale_cost: pInfo.f_sale_cost || null,
        quantity: buyNum,
        price: pInfo.price,
        total_price: new Decimal(pInfo.price).mul(new Decimal(buyNum)).toNumber(),
        trade_no: tradeNo,
        created_at: dateTime,
        updated_at: dateTime
      }
      let sql3 = await mysql.set(trade.t, orData, 'sentence')
      await run(sql2)
      let res3 = await run(sql3)
      trade_id = res3.data.insertId
      let preData = await payment.jsapi({
        description: pInfo.title,
        out_trade_no: tradeNo,
        amount:{
          total: new Decimal(pInfo.price).mul(new Decimal(100)).mul(new Decimal(buyNum)).toNumber()  //金额，单位为分
        },
        payer:{
          openid: user.openid
        },
        settle_info: {
          profit_sharing: sale_uid ? true : false // 该订单是否支持分账
        }
      })
      wxData = {
        signType: 'RSA',
        paySign: '',
        package: `prepay_id=${JSON.parse(preData.data).prepay_id}`,
        nonceStr: randomCode(32, '0aA'),
        timeStamp: (((getTime('stamp') as number) / 1000) >>> 0).toString()
      }
      wxData.paySign = payment.rsaSign(`${WEAPP.APP_ID}\n${wxData.timeStamp}\n${wxData.nonceStr}\n${wxData.package}\n`, PRIVATE_KEY)
      // 保存订单参数
      const sql4 = await mysql.set(wait_paid.t, {
        sign_type: wxData.signType,
        pay_sign: wxData.paySign,
        package: wxData.package,
        nonce_str: wxData.nonceStr,
        time_stamp: wxData.timeStamp,
        trade_id: trade_id,
        created_at: dateTime,
        uid: user.id //购买者
      }, 'sentence')
      await run(sql4)
      result = {
        status: 2,
        message: '订单生成成功'
      }
      await commit()
      productCacheQuantity(aid, -buyNum)
    }catch(err: any){
      await rollback()
      result = {
        status: 0,
        message: '订单生成失败'
      }
      throw new Error(err)
    }
  })


  // 定义一个未来的时间，自动删除未支付的订单,和微信支付信息
  let date = new Date(Date.now() + PREPAY_TIME * 1000)
  // 定义一个任务
  let job = schedule.scheduleJob(date, async () => {
    // 删除订单
    let tempTra = (await mysql.get(trade.t, trade_id)).data
    if(tempTra.trade_status === 5){
      let {run, begin, rollback, commit} = await mysql.transaction()
      await begin(async () => {
        try{
          let sql1 = await mysql.update(trade.t, trade_id, {trade_status: 3}, 'sentence')
          await run(sql1)
          let sql2 = await mysql.update(product.t, tempTra.product_id, {quantity: ['incr', tempTra.quantity]}, 'sentence')
          await run(sql2)
          let sql3 = await mysql.update(wait_paid.t, {trade_id: trade_id}, {status: 0}, 'sentence')
          await run(sql3)
          await commit()
          productCacheQuantity(aid, tempTra.quantity)
        }catch(err: any){
          await rollback()
          throw new Error(err)
        }
      })
    }
  })

  ctx.body = {
    ...result,
    wxData: wxData
  }
})
// 购买文章里的水果，团购下单
interface IFruitsResult {
  status: number,
  message: string
}
payRouter.post('/buy/fruits/group', authUse, async function(ctx, next) {
  const {user} = ctx
  const {
    pid, 
    aid, 
    fuid,
    buyNum=1,
    name, 
    phone, 
    address,
    province,
    city,
    area,
    addr,
  } = ctx.request.body

  let result: IFruitsResult = {
    status: 0,
    message: ''
  }
  let wxData: any = {}, sale_uid = fuid, f_sale_uid

  if(!pid || !aid){
    result = {
      status: 0,
      message: '未找到相关商品'
    }
    return ctx.body = result
  }

  // 如果用户有销售，那就覆盖转发的销售
  let tempRela = (await mysql.get(sale_user_rela.t, {uid: user.id})).data
  if(tempRela.sale_uid) sale_uid = tempRela.sale_uid

  if(sale_uid){
    let saleUser = (await mysql.get(users.t, sale_uid)).data
    if(!isRole('salespeople', saleUser.role)){
      // 用户不是销售
      sale_uid = 0
    }
  }
  const tempArt = (await mysql.get(article.t, aid)).data
  
  if(tempArt.product_id !== pid){
    result = {
      status: 0,
      message: '文章信息和商品不相符'
    }
    return ctx.body = result
  }


  // 查寻商品是否足够，并下单
  let {run, begin, rollback, commit, locks} = await mysql.transaction()
  let trade_id

  let tempFSData = (await mysql.find(sale_rela.t, {
    p0: [sale_rela.sale_uid, '=', sale_uid],
    p1: [sale_rela.status, '=', 2],
    r: 'p0 && p1'
  })).data.objects
  let fSaleData = tempFSData.length > 0 ? tempFSData[0] : {}
  let fSaleUserInfo = (await mysql.get(users.t, fSaleData.f_sale_uid)).data
  
  if(isRole('salesleader', fSaleUserInfo.role)){
    // 是总销售
    f_sale_uid = fSaleData.f_sale_uid
  }
  
  await begin(async () => {
    try{
      // 需要加锁的时候，就直接在返回的sql语句后面加上相应的锁，注意要将await括起来
      let sql1 = (await mysql.get(product.t, pid, {}, 'sentence')) + locks.exclusive_locks
      let pInfo = (await run(sql1)).data
      if(pInfo.can_group !== 1){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】团购活动已关闭'
        }
        return await rollback()
      }
      if(new Date(pInfo.group_end) < new Date()){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】团购已结束'
        }
        return await rollback()
      }
      if(pInfo.group_quantity <= 0){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已被抢光啦'
        }
        return await rollback()
      }
      if(pInfo.group_quantity < buyNum){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】的数量不足了'
        }
        return await rollback()
      }
      if(pInfo.status !== 20){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已下架了'
        }
        return await rollback()
      }
      let sql2 = await mysql.update(product.t, pid, {group_quantity: ['incr', -buyNum]}, 'sentence')
      const tradeNo = Date.now().toString() + randomCode(7, '0')
      const dateTime = getTime('date_time')
      let orData = {
        article_id: aid,
        product_id: pid,
        title: pInfo.title,
        des: pInfo.des || '',
        cover_url: pInfo.img_urls.split(',')[0] || '',
        uid: user.id,  // 购买者的id
        business_uid: pInfo.uid,  // 发布者（报价员）的id
        sale_uid: sale_uid || null,  //销售的uid,
        f_sale_uid: f_sale_uid || null,
        phone: phone,
        name: name,
        address: address,
        province: province,
        city: city,
        area: area,
        addr: addr,
        trade_status: 5, // 待支付
        cost: pInfo.group_cost || null,
        sale_cost: pInfo.group_sale_cost || null,
        f_sale_cost: pInfo.group_f_sale_cost || null,
        quantity: buyNum,
        price: pInfo.group_price,
        total_price: new Decimal(pInfo.group_price).mul(new Decimal(buyNum)).toNumber(),
        trade_no: tradeNo,
        created_at: dateTime,
        updated_at: dateTime,
        is_group: 1,  // 为团购
      }
      let sql3 = await mysql.set(trade.t, orData, 'sentence')
      await run(sql2)
      let res3 = await run(sql3)
      trade_id = res3.data.insertId
      let preData = await payment.jsapi({
        description: pInfo.title,
        out_trade_no: tradeNo,
        amount:{
          total: new Decimal(pInfo.group_price).mul(new Decimal(100)).mul(new Decimal(buyNum)).toNumber()  //金额，单位为分
        },
        payer:{
          openid: user.openid
        },
        settle_info: {
          profit_sharing: sale_uid ? true : false // 该订单是否支持分账
        }
      })
      wxData = {
        signType: 'RSA',
        paySign: '',
        package: `prepay_id=${JSON.parse(preData.data).prepay_id}`,
        nonceStr: randomCode(32, '0aA'),
        timeStamp: (((getTime('stamp') as number) / 1000) >>> 0).toString()
      }
      wxData.paySign = payment.rsaSign(`${WEAPP.APP_ID}\n${wxData.timeStamp}\n${wxData.nonceStr}\n${wxData.package}\n`, PRIVATE_KEY)
      // 保存订单参数
      const sql4 = await mysql.set(wait_paid.t, {
        sign_type: wxData.signType,
        pay_sign: wxData.paySign,
        package: wxData.package,
        nonce_str: wxData.nonceStr,
        time_stamp: wxData.timeStamp,
        trade_id: trade_id,
        created_at: dateTime,
        uid: user.id //购买者
      }, 'sentence')
      await run(sql4)
      result = {
        status: 2,
        message: '订单生成成功'
      }
      await commit()
      productCacheQuantity(aid, -buyNum, true)
    }catch(err: any){
      await rollback()
      result = {
        status: 0,
        message: '订单生成失败'
      }
      throw new Error(err)
    }
  })


  // 定义一个未来的时间，自动删除未支付的订单,和微信支付信息
  let date = new Date(Date.now() + PREPAY_TIME * 1000)
  // 定义一个任务
  let job = schedule.scheduleJob(date, async () => {
    // 删除订单
    let tempTra = (await mysql.get(trade.t, trade_id)).data
    if(tempTra.trade_status === 5){
      let {run, begin, rollback, commit} = await mysql.transaction()
      await begin(async () => {
        try{
          let sql1 = await mysql.update(trade.t, trade_id, {trade_status: 3}, 'sentence')
          await run(sql1)
          let sql2 = await mysql.update(product.t, tempTra.product_id, {group_quantity: ['incr', tempTra.quantity]}, 'sentence')
          await run(sql2)
          let sql3 = await mysql.update(wait_paid.t, {trade_id: trade_id}, {status: 0}, 'sentence')
          await run(sql3)
          await commit()
          productCacheQuantity(aid, tempTra.quantity, true)
        }catch(err: any){
          await rollback()
          throw new Error(err)
        }
      })
    }
  })

  ctx.body = {
    ...result,
    wxData: wxData
  }
})




// 送礼，的下单
payRouter.post('/buy/gift', authUse, async (ctx, next) => {
  const {user} = ctx
  const {
    pid, 
    aid, 
    fuid,
    buyNum=1,
    phoneStr,
    gift_theme_id,
  } = ctx.request.body

  let result: any = {
    status: 0,
    message: ''
  }
  let wxData: any = {}, sale_uid = fuid, f_sale_uid

  if(!pid || !aid){
    result = {
      status: 0,
      message: '未找到相关商品'
    }
    return ctx.body = result
  }
  if(!phoneStr){
    result = {
      status: 0,
      message: '领取手机号不能为空'
    }
    return ctx.body = result
  }
  if(phoneStr.split(',').length < buyNum){
    result = {
      status: 0,
      message: '领取手机号不能少于购买的件数'
    }
    return ctx.body = result
  }

  // 如果用户有销售，那就覆盖转发的销售
  let tempRela = (await mysql.get(sale_user_rela.t, {uid: user.id})).data
  if(tempRela.sale_uid) sale_uid = tempRela.sale_uid

  if(sale_uid){
    let saleUser = (await mysql.get(users.t, sale_uid)).data
    if(!isRole('salespeople', saleUser.role)){
      // 用户不是销售
      sale_uid = 0
    }
  }
  const tempArt = (await mysql.get(article.t, aid)).data
  
  if(tempArt.product_id !== pid){
    result = {
      status: 0,
      message: '文章信息和商品不相符'
    }
    return ctx.body = result
  }


  // 查寻商品是否足够，并下单
  let {run, begin, rollback, commit, locks} = await mysql.transaction()
  let trade_id

  let tempFSData = (await mysql.find(sale_rela.t, {
    p0: [sale_rela.sale_uid, '=', sale_uid],
    p1: [sale_rela.status, '=', 2],
    r: 'p0 && p1'
  })).data.objects
  let fSaleData = tempFSData.length > 0 ? tempFSData[0] : {}
  let fSaleUserInfo = (await mysql.get(users.t, fSaleData.f_sale_uid)).data
  
  if(isRole('salesleader', fSaleUserInfo.role)){
    // 是总销售
    f_sale_uid = fSaleData.f_sale_uid
  }
  
  await begin(async () => {
    try{
      // 需要加锁的时候，就直接在返回的sql语句后面加上相应的锁，注意要将await括起来
      let sql1 = (await mysql.get(product.t, pid, {}, 'sentence')) + locks.exclusive_locks
      let pInfo = (await run(sql1)).data
      if(pInfo.quantity <= 0){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已被抢光啦'
        }
        return await rollback()
      }
      if(pInfo.quantity < buyNum){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】的数量不足了'
        }
        return await rollback()
      }
      if(pInfo.status !== 20){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已下架了'
        }
        return await rollback()
      }
      
      let sql2 = await mysql.update(product.t, pid, {quantity: ['incr', -buyNum]}, 'sentence')
      const tradeNo = Date.now().toString() + randomCode(7, '0')
      const dateTime = getTime('date_time')
      let orData = {
        article_id: aid,
        product_id: pid,
        title: pInfo.title,
        des: pInfo.des || '',
        cover_url: pInfo.img_urls.split(',')[0] || '',
        uid: user.id,  // 购买者的id
        business_uid: pInfo.uid,  // 发布者（报价员）的id
        sale_uid: sale_uid || null,  //销售的uid,
        f_sale_uid: f_sale_uid || null,
        picked_phone: phoneStr,
        gift_theme_id: gift_theme_id,
        trade_status: 5, // 待支付
        cost: pInfo.cost || null,
        sale_cost: pInfo.sale_cost || null,
        f_sale_cost: pInfo.f_sale_cost || null,
        quantity: buyNum,
        remain_quantity: buyNum,
        price: pInfo.price,
        total_price: new Decimal(pInfo.price).mul(new Decimal(buyNum)).toNumber(),
        trade_no: tradeNo,
        created_at: dateTime,
        updated_at: dateTime
      }
      
      let sql3 = await mysql.set(gift_trade.t, orData, 'sentence')
      await run(sql2)
      let res3 = await run(sql3)
      trade_id = res3.data.insertId
      let preData = await payment.jsapi({
        description: pInfo.title,
        out_trade_no: tradeNo,
        amount:{
          total: new Decimal(pInfo.price).mul(new Decimal(100)).mul(new Decimal(buyNum)).toNumber()  //金额，单位为分
        },
        attach: '3',  // 为3，说明是购买的礼物
        payer:{
          openid: user.openid
        },
        settle_info: {
          profit_sharing: sale_uid ? true : false // 该订单是否支持分账
        }
      })
      
      wxData = {
        signType: 'RSA',
        paySign: '',
        package: `prepay_id=${JSON.parse(preData.data).prepay_id}`,
        nonceStr: randomCode(32, '0aA'),
        timeStamp: (((getTime('stamp') as number) / 1000) >>> 0).toString()
      }
      wxData.paySign = payment.rsaSign(`${WEAPP.APP_ID}\n${wxData.timeStamp}\n${wxData.nonceStr}\n${wxData.package}\n`, PRIVATE_KEY)

      result = {
        status: 2,
        message: '订单生成成功',
        gtid: trade_id,
      }
      await commit()
      productCacheQuantity(aid, -buyNum)
    }catch(err: any){
      await rollback()
      result = {
        status: 0,
        message: '订单生成失败'
      }
      throw new Error(err)
    }
  })


  // 定义一个未来的时间，自动删除未支付的订单,和微信支付信息
  let date = new Date(Date.now() + PREPAY_TIME * 1000)
  // 定义一个任务
  let job = schedule.scheduleJob(date, async () => {
    // 删除订单
    let tempTra = (await mysql.get(gift_trade.t, trade_id)).data
    if(tempTra.trade_status === 5){
      let {run, begin, rollback, commit} = await mysql.transaction()
      await begin(async () => {
        try{
          let sql1 = await mysql.update(gift_trade.t, trade_id, {trade_status: 3}, 'sentence')
          await run(sql1)
          let sql2 = await mysql.update(product.t, tempTra.product_id, {quantity: ['incr', tempTra.quantity]}, 'sentence')
          await run(sql2)
          // 礼物没有待支付，如果有待支付，则表也要加新的字段，来存trade id
          // let sql3 = await mysql.update(wait_paid.t, {trade_id: trade_id}, {status: 0}, 'sentence')
          // await run(sql3)
          await commit()
          productCacheQuantity(aid, tempTra.quantity)
        }catch(err: any){
          await rollback()
          throw new Error(err)
        }
      })
    }
  })
  ctx.body = {
    ...result,
    wxData: wxData
  }
})



// 用户直接充值
payRouter.post('/recharge', authUse, async (ctx, next) => {
  const {user} = ctx
  const {
    arid, // 充值的id
  } = ctx.request.body
  let result: any = {
    status: 0,
    message: ''
  }
  
  let accountRecharge = (await mysql.get(account_recharge.t, arid)).data
  
  if(!accountRecharge.id){
    result = {
      status: 0,
      message: '未找到相关充值金额'
    }
    return ctx.body = result
  }
  if(accountRecharge.status !== 2){
    result = {
      status: 0,
      message: '该充值方案暂不可用'
    }
    return ctx.body = result
  }
  if(accountRecharge.price * 0.7 > accountRecharge.pay_price){
    result = {
      status: 0,
      message: '该充值方案暂不可用2'
    }
    return ctx.body = result
  }


  let wxData: any = {}

  
  const tradeNo = 'JGCZ' + Date.now().toString() + randomCode(7, '0')
  let accountRecord = {
    content: `余额充值${accountRecharge.price}元；实付${accountRecharge.pay_price}元。`,
  }
  
  let preData = await payment.jsapi({
    description: accountRecord.content,
    out_trade_no: tradeNo,
    amount:{
      total: new Decimal(accountRecharge.pay_price).mul(new Decimal(100)).toNumber()  //金额，单位为分
    },
    attach: '8_' + arid,  // 为8，说明是余额充值
    payer:{
      openid: user.openid
    },
    settle_info: {
      profit_sharing: false // 该订单是否支持分账
    }
  })
  
  wxData = {
    signType: 'RSA',
    paySign: '',
    package: `prepay_id=${JSON.parse(preData.data).prepay_id}`,
    nonceStr: randomCode(32, '0aA'),
    timeStamp: (((getTime('stamp') as number) / 1000) >>> 0).toString()
  }
  wxData.paySign = payment.rsaSign(`${WEAPP.APP_ID}\n${wxData.timeStamp}\n${wxData.nonceStr}\n${wxData.package}\n`, PRIVATE_KEY)

  result = {
    status: 2,
    message: '订单生成成功',
  }
  ctx.body = {
    ...result,
    wxData: wxData
  }

})




// 购买商品，余额支付
payRouter.post('/buy/fruits/balance', authUse, async function(ctx, next) {
  const {user} = ctx
  const {
    pid, 
    aid, 
    fuid,
    buyNum=1, 
    name, 
    phone, 
    address,
    province,
    city,
    area,
    addr,
  } = ctx.request.body

  let result: IFruitsResult = {
    status: 0,
    message: ''
  }
  let wxData: any = {}, sale_uid = fuid, f_sale_uid

  if(!pid || !aid){
    result = {
      status: 0,
      message: '未找到相关商品'
    }
    return ctx.body = result
  }


  const tempArt = (await mysql.get(article.t, aid)).data
  
  if(tempArt.product_id !== pid){
    result = {
      status: 0,
      message: '文章信息和商品不相符'
    }
    return ctx.body = result
  }


  // 查寻商品是否足够，并下单
  let {run, begin, rollback, commit, locks} = await mysql.transaction()
  let trade_id, orderInfo

  await begin(async () => {
    try{
      // 需要加锁的时候，就直接在返回的sql语句后面加上相应的锁，注意要将await括起来
      const sql1 = (await mysql.get(product.t, pid, {}, 'sentence')) + locks.exclusive_locks
      const sql0 = await mysql.get(users_account.t, {uid: user.id}, {}, 'sentence')

      
      let pInfo = (await run(sql1)).data
      let totalPay = new Decimal(pInfo.price).mul(new Decimal(buyNum)).toNumber()
      let userAccount = (await run(sql0)).data
      if(userAccount.balance < totalPay || userAccount.balance <= 0){
        result = {
          status: 0,
          message: '余额不足'
        }
        return await rollback()
      }
      
      if(pInfo.quantity <= 0){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已被抢光啦'
        }
        return await rollback()
      }
      if(pInfo.quantity < buyNum){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】的数量不足了'
        }
        return await rollback()
      }
      if(pInfo.status !== 20){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已下架了'
        }
        return await rollback()
      }
      const sql2 = await mysql.update(product.t, pid, {quantity: ['incr', -buyNum]}, 'sentence')
      const tradeNo = Date.now().toString() + randomCode(7, '0')
      const dateTime = getTime('date_time')
      orderInfo = {
        article_id: aid,
        product_id: pid,
        title: pInfo.title,
        des: pInfo.des || '',
        cover_url: pInfo.img_urls.split(',')[0] || '',
        uid: user.id,  // 购买者的id
        business_uid: pInfo.uid,  // 发布者（报价员）的id
        sale_uid: sale_uid || null,  //销售的uid,
        f_sale_uid: f_sale_uid || null,
        phone: phone,
        name: name,
        address: address,
        province: province,
        city: city,
        area: area,
        addr: addr,
        cost: pInfo.cost || null,
        sale_cost: pInfo.sale_cost || null,
        f_sale_cost: pInfo.f_sale_cost || null,
        quantity: buyNum,
        price: pInfo.price,
        total_price: totalPay,
        trade_no: tradeNo,
        created_at: dateTime,
        updated_at: dateTime,
        transaction_id: tradeNo,
        trade_type: PAY_WAY[5],
        trade_status: 10,  //待发货
      }
      const sql3 = await mysql.set(trade.t, orderInfo, 'sentence')
      const sql5 = await mysql.update(users_account.t, {uid: user.id}, {balance: ['incr', -totalPay]}, 'sentence')
      const sql4 = await mysql.set(users_account_record.t, {
        users_account_id: userAccount.id,
        uid: user.id,
        content: `购买【${orderInfo.title}】，共计${orderInfo.quantity}件。`,
        change_balance: -totalPay,
        type: 1,
        obj: JSON.stringify({
          trade_id: orderInfo.id,
          title: orderInfo.title,
          des: orderInfo.des,
          uid: orderInfo.uid,
          price: orderInfo.price,
          cover_url: orderInfo.cover_url,
          article_id: orderInfo.article_id,
          product_id: orderInfo.product_id,
        }),
      }, 'sentence')
      await run(sql2)
      await run(sql3)
      await run(sql5)
      await run(sql4)

      result = {
        status: 2,
        message: '下单成功'
      }
      await commit()
      productCacheQuantity(aid, -buyNum)
    }catch(err: any){
      await rollback()
      result = {
        status: 0,
        message: '订单生成失败'
      }
      throw new Error(err)
    }
  })


  // 下单成功
  if(result.status === 2){
    
    const productInfo = (await mysql.get(product.t, orderInfo.product_id)).data
  
    // 生成一个快递单，在有商家寄件地址的时候（正常购买流程，才有的叫快递）
    if(productInfo.mobile){
      const expressData = await addOneExpress({
        add_source: 0,
        order_id: orderInfo.trade_no,
        openid: user.openid,
        delivery_id: EXPRESS_SF.ID,
        biz_id: EXPRESS_SF.BIZ_ID,
        sender: {
          name: productInfo.name,
          mobile: productInfo.mobile,
          company: productInfo.company || '天天购享家',
          province: productInfo.province,
          city: productInfo.city,
          area: productInfo.area,
          address: productInfo.addr
        },
        receiver: {
          name: orderInfo.name,
          mobile: orderInfo.phone,
          province: orderInfo.province,
          city: orderInfo.city,
          area: orderInfo.area,
          address: orderInfo.addr
        },
        cargo: {
          count: orderInfo.quantity,
          weight: productInfo.weight,
          space_x: productInfo.space_x,
          space_y: productInfo.space_y,
          space_z: productInfo.space_z,
          detail_list: [
            {
              name: orderInfo.title,
              count: orderInfo.quantity,
            }
          ]
        },
        shop: {
          wxa_path: "/pages/article/ArticleDetail?aid=" + orderInfo.article_id,
          img_url: process.env.STATIC_URL + orderInfo.cover_url,
          goods_name: orderInfo.title,
          goods_count: orderInfo.quantity
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
        await mysql.update(trade.t, orderInfo.id, {
          express_no: expressData.waybill_id,
          trade_status: 15,
        })
      }
    }
  
  
    const quoterInfo = (await mysql.get(users.t, orderInfo.business_uid)).data
    const nowTime = getTime('date_time')
    // 记录报价员的分成（成本）
    let quoter_money = new Decimal(orderInfo.cost).mul(new Decimal(100)).mul(new Decimal(orderInfo.quantity)).toNumber()
    if(isRole('quoter', quoterInfo.role) && orderInfo.price > 0){
      await mysql.set(share_money.t, {
        out_order_no: 'P' + orderInfo.trade_no,
        transaction_id: orderInfo.trade_no,
        account: quoterInfo.openid,
        amount: quoter_money,
        create_at:  nowTime,
        description: orderInfo.title + '的成本提取(报价员)',
        finish_at: nowTime,
        type: 'QUOTER_OPENID',
      })
    }
  }

  ctx.body = {
    ...result,
    wxData: wxData
  }
})
// 团购商品，余额支付
payRouter.post('/buy/fruits/balance/group', authUse, async function(ctx, next) {
  const {user} = ctx
  const {
    pid, 
    aid, 
    fuid,
    buyNum=1, 
    name, 
    phone, 
    address,
    province,
    city,
    area,
    addr,
  } = ctx.body

  let result: IFruitsResult = {
    status: 0,
    message: ''
  }
  let wxData: any = {}, sale_uid = fuid, f_sale_uid

  if(!pid || !aid){
    result = {
      status: 0,
      message: '未找到相关商品'
    }
    return ctx.body = result
  }


  const tempArt = (await mysql.get(article.t, aid)).data
  
  if(tempArt.product_id !== pid){
    result = {
      status: 0,
      message: '文章信息和商品不相符'
    }
    return ctx.body = result
  }


  // 查寻商品是否足够，并下单
  let {run, begin, rollback, commit, locks} = await mysql.transaction()
  let trade_id, orderInfo

  await begin(async () => {
    try{
      // 需要加锁的时候，就直接在返回的sql语句后面加上相应的锁，注意要将await括起来
      const sql1 = (await mysql.get(product.t, pid, {}, 'sentence')) + locks.exclusive_locks
      const sql0 = await mysql.get(users_account.t, {uid: user.id}, {}, 'sentence')
      
      let pInfo = (await run(sql1)).data
      let totalPay = new Decimal(pInfo.group_price).mul(new Decimal(buyNum)).toNumber()
      let userAccount = (await run(sql0)).data
      if(userAccount.balance < totalPay || userAccount.balance <= 0){
        result = {
          status: 0,
          message: '余额不足'
        }
        return await rollback()
      }
      if(pInfo.can_group !== 1){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】团购活动已关闭'
        }
        return await rollback()
      }
      if(new Date(pInfo.group_end) < new Date()){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】团购已结束'
        }
        return await rollback()
      }
      if(pInfo.group_quantity <= 0){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已被抢光啦'
        }
        return await rollback()
      }
      if(pInfo.group_quantity < buyNum){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】的数量不足了'
        }
        return await rollback()
      }
      if(pInfo.status !== 20){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已下架了'
        }
        return await rollback()
      }
      const sql2 = await mysql.update(product.t, pid, {group_quantity: ['incr', -buyNum]}, 'sentence')
      const tradeNo = Date.now().toString() + randomCode(7, '0')
      const dateTime = getTime('date_time')
      orderInfo = {
        article_id: aid,
        product_id: pid,
        title: pInfo.title,
        des: pInfo.des || '',
        cover_url: pInfo.img_urls.split(',')[0] || '',
        uid: user.id,  // 购买者的id
        business_uid: pInfo.uid,  // 发布者（报价员）的id
        sale_uid: sale_uid || null,  //销售的uid,
        f_sale_uid: f_sale_uid || null,
        phone: phone,
        name: name,
        address: address,
        province: province,
        city: city,
        area: area,
        addr: addr,
        cost: pInfo.group_cost || null,
        sale_cost: pInfo.group_sale_cost || null,
        f_sale_cost: pInfo.group_f_sale_cost || null,
        quantity: buyNum,
        price: pInfo.group_price,
        total_price: totalPay,
        trade_no: tradeNo,
        created_at: dateTime,
        updated_at: dateTime,
        is_group: 1,  // 为团购
        transaction_id: tradeNo,
        trade_type: PAY_WAY[5],
        trade_status: 10,  //待发货
      }
      const sql3 = await mysql.set(trade.t, orderInfo, 'sentence')
      const sql5 = await mysql.update(users_account.t, {uid: user.id}, {balance: ['incr', -totalPay]}, 'sentence')
      const sql4 = await mysql.set(users_account_record.t, {
        users_account_id: userAccount.id,
        uid: user.id,
        content: `团购【${orderInfo.title}】，共计${orderInfo.quantity}件。`,
        change_balance: -totalPay,
        type: 1,
        obj: JSON.stringify({
          trade_id: orderInfo.id,
          title: orderInfo.title,
          des: orderInfo.des,
          uid: orderInfo.uid,
          price: orderInfo.price,
          cover_url: orderInfo.cover_url,
          article_id: orderInfo.article_id,
          product_id: orderInfo.product_id,
        }),
      }, 'sentence')
      await run(sql2)
      await run(sql3)
      await run(sql5)
      await run(sql4)

      result = {
        status: 2,
        message: '下单成功'
      }
      await commit()
      productCacheQuantity(aid, -buyNum, true)
    }catch(err: any){
      await rollback()
      result = {
        status: 0,
        message: '订单生成失败'
      }
      throw new Error(err)
    }
  })


  // 下单成功
  if(result.status === 2){
    
    const productInfo = (await mysql.get(product.t, orderInfo.product_id)).data
  
    // 生成一个快递单，在有商家寄件地址的时候（正常购买流程，才有的叫快递）
    if(productInfo.mobile){
      const expressData = await addOneExpress({
        add_source: 0,
        order_id: orderInfo.trade_no,
        openid: user.openid,
        delivery_id: EXPRESS_SF.ID,
        biz_id: EXPRESS_SF.BIZ_ID,
        sender: {
          name: productInfo.name,
          mobile: productInfo.mobile,
          company: productInfo.company || '天天购享家',
          province: productInfo.province,
          city: productInfo.city,
          area: productInfo.area,
          address: productInfo.addr
        },
        receiver: {
          name: orderInfo.name,
          mobile: orderInfo.phone,
          province: orderInfo.province,
          city: orderInfo.city,
          area: orderInfo.area,
          address: orderInfo.addr
        },
        cargo: {
          count: orderInfo.quantity,
          weight: productInfo.weight,
          space_x: productInfo.space_x,
          space_y: productInfo.space_y,
          space_z: productInfo.space_z,
          detail_list: [
            {
              name: orderInfo.title,
              count: orderInfo.quantity,
            }
          ]
        },
        shop: {
          wxa_path: "/pages/article/ArticleDetail?aid=" + orderInfo.article_id,
          img_url: process.env.STATIC_URL + orderInfo.cover_url,
          goods_name: orderInfo.title,
          goods_count: orderInfo.quantity
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
        await mysql.update(trade.t, orderInfo.id, {
          express_no: expressData.waybill_id,
          trade_status: 15,
        })
      }
    }
  
  
    const quoterInfo = (await mysql.get(users.t, orderInfo.business_uid)).data
    const nowTime = getTime('date_time')
    // 记录报价员的分成（成本）
    let quoter_money = new Decimal(orderInfo.cost).mul(new Decimal(100)).mul(new Decimal(orderInfo.quantity)).toNumber()
    if(isRole('quoter', quoterInfo.role) && orderInfo.price > 0){
      await mysql.set(share_money.t, {
        out_order_no: 'P' + orderInfo.trade_no,
        transaction_id: orderInfo.trade_no,
        account: quoterInfo.openid,
        amount: quoter_money,
        create_at:  nowTime,
        description: orderInfo.title + '的成本提取(报价员)',
        finish_at: nowTime,
        type: 'QUOTER_OPENID',
        is_group: 1,  // 为团购
      })
    }
  }

  ctx.body = {
    ...result,
    wxData: wxData
  }
})




// 送礼，下单的余额支付
payRouter.post('/buy/gift/balance', authUse, async (ctx, next) => {
  const {user} = ctx
  const {
    pid, 
    aid, 
    fuid,
    buyNum=1,
    phoneStr,
    gift_theme_id,
  } = ctx.request.body

  let result: any = {
    status: 0,
    message: ''
  }
  let wxData: any = {}, sale_uid = fuid, f_sale_uid

  if(!pid || !aid){
    result = {
      status: 0,
      message: '未找到相关商品'
    }
    return ctx.body = result
  }
  if(!phoneStr){
    result = {
      status: 0,
      message: '领取手机号不能为空'
    }
    return ctx.body = result
  }
  if(phoneStr.split(',').length < buyNum){
    result = {
      status: 0,
      message: '领取手机号不能少于购买的件数'
    }
    return ctx.body = result
  }


  const tempArt = (await mysql.get(article.t, aid)).data
  
  if(tempArt.product_id !== pid){
    result = {
      status: 0,
      message: '文章信息和商品不相符'
    }
    return ctx.body = result
  }


  // 查寻商品是否足够，并下单
  let {run, begin, rollback, commit, locks} = await mysql.transaction()
  let trade_id, orderInfo


  await begin(async () => {
    try{
      // 需要加锁的时候，就直接在返回的sql语句后面加上相应的锁，注意要将await括起来
      let sql1 = (await mysql.get(product.t, pid, {}, 'sentence')) + locks.exclusive_locks
      const sql0 = await mysql.get(users_account.t, {uid: user.id}, {}, 'sentence')
      
      
      let pInfo = (await run(sql1)).data
      let totalPay = new Decimal(pInfo.price).mul(new Decimal(buyNum)).toNumber()
      let userAccount = (await run(sql0)).data
      if(userAccount.balance < totalPay || userAccount.balance <= 0){
        result = {
          status: 0,
          message: '余额不足'
        }
        return await rollback()
      }
      if(pInfo.quantity <= 0){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已被抢光啦'
        }
        return await rollback()
      }
      if(pInfo.quantity < buyNum){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】的数量不足了'
        }
        return await rollback()
      }
      if(pInfo.status !== 20){
        result = {
          status: 0,
          message: '很抱歉，【' + pInfo.title + '】已下架了'
        }
        return await rollback()
      }
      
      let sql2 = await mysql.update(product.t, pid, {quantity: ['incr', -buyNum]}, 'sentence')
      const tradeNo = Date.now().toString() + randomCode(7, '0')
      const dateTime = getTime('date_time')
      orderInfo = {
        article_id: aid,
        product_id: pid,
        title: pInfo.title,
        des: pInfo.des || '',
        cover_url: pInfo.img_urls.split(',')[0] || '',
        uid: user.id,  // 购买者的id
        business_uid: pInfo.uid,  // 发布者（报价员）的id
        sale_uid: sale_uid || null,  //销售的uid,
        f_sale_uid: f_sale_uid || null,
        picked_phone: phoneStr,
        gift_theme_id: gift_theme_id,
        cost: pInfo.cost || null,
        sale_cost: pInfo.sale_cost || null,
        f_sale_cost: pInfo.f_sale_cost || null,
        quantity: buyNum,
        remain_quantity: buyNum,
        price: pInfo.price,
        total_price: totalPay,
        trade_no: tradeNo,
        created_at: dateTime,
        updated_at: dateTime,
        transaction_id: tradeNo,
        trade_type: PAY_WAY[5],
        trade_status: 20,  //已完成
      }
      
      const sql3 = await mysql.set(gift_trade.t, orderInfo, 'sentence')
      const sql5 = await mysql.update(users_account.t, {uid: user.id}, {balance: ['incr', -totalPay]}, 'sentence')
      const sql4 = await mysql.set(users_account_record.t, {
        users_account_id: userAccount.id,
        uid: user.id,
        content: `购买礼物【${orderInfo.title}】，共计${orderInfo.quantity}件。`,
        change_balance: -totalPay,
        type: 2,
        obj: JSON.stringify({
          gift_trade_id: orderInfo.id,
          title: orderInfo.title,
          des: orderInfo.des,
          uid: orderInfo.uid,
          price: orderInfo.price,
          cover_url: orderInfo.cover_url,
          article_id: orderInfo.article_id,
          product_id: orderInfo.product_id,
        }),
      }, 'sentence')
      await run(sql2)
      let res3 = await run(sql3)
      trade_id = res3.data.insertId
      await run(sql5)
      await run(sql4)
 
      result = {
        status: 2,
        message: '下单成功',
        gtid: trade_id,
      }
      await commit()
      productCacheQuantity(aid, -buyNum)
    }catch(err: any){
      await rollback()
      result = {
        status: 0,
        message: '订单生成失败'
      }
      throw new Error(err)
    }
  })

  // 下单成功
  if(result.status === 2){    
    const quoterInfo = (await mysql.get(users.t, orderInfo.business_uid)).data
    const nowTime = getTime('date_time')
    // 记录报价员的分成（成本）
    let quoter_money = new Decimal(orderInfo.cost).mul(new Decimal(100)).mul(new Decimal(orderInfo.quantity)).toNumber()
    if(isRole('quoter', quoterInfo.role) && orderInfo.price > 0){
      await mysql.set(share_money.t, {
        out_order_no: 'P' + orderInfo.trade_no,
        transaction_id: orderInfo.trade_no,
        account: quoterInfo.openid,
        amount: quoter_money,
        create_at:  nowTime,
        description: orderInfo.title + '的成本提取(报价员)',
        finish_at: nowTime,
        type: 'QUOTER_OPENID',
      })
    }
  }
  ctx.body = {
    ...result,
    wxData: wxData
  }
})








// 购物车里的统一结算
// payRouter.post('/buy/shop_cart', authUse, async function(ctx, next) {
//   const {user, body} = req
//   const {name, phone, address} = body

  
//   // 获取用户选择的购物车
//   const userShop = (await mysql.find(shop_cart.t, {
//     p1: [shop_cart.uid, '=', user.id],
//     p2: [shop_cart.is_select, '=', 1],
//     r: 'p1 && p2',
//   })).data.objects

//   let result: IFruitsResult = {
//     status: 0,
//     message: ''
//   }



//   if(userShop.length === 0){
//     result = {
//       status: 0,
//       message: '你未选择任何商品'
//     }
//     return res.json(result)
//   }
//   // 每次最多结束5个
//   if(userShop.length > 10){
//     result = {
//       status: 0,
//       message: '每次最多同时结算 10 个'
//     }
//     return res.json(result)
//   }




//   // 购物车销售，默认取第一个
//   let wxData: any = {}, sale_uid = userShop[0].fuid, f_sale_uid


//   // 如果用户有销售，那就覆盖转发的销售
//   let tempRela = (await mysql.get(sale_user_rela.t, {uid: user.id})).data
//   if(tempRela.sale_uid) sale_uid = tempRela.sale_uid


//   if(sale_uid){
//     let saleUser = (await mysql.get(users.t, sale_uid)).data
//     if(!isRole('salespeople', saleUser.role)){
//       // 用户不是销售
//       sale_uid = 0
//     }
//   }
//   // 将用户购物车的销售id更新, 并生成产品id数组，备用，即对应购买数量
//   let pids: number[] = [], 
//       buyPidNum: any = {}, 
//       updatePidNum: any[] = [], 
//       aidsObj: any = []

//   for(let i = 0; i < userShop.length; i++){
//     userShop[i].sale_uid = sale_uid
//     pids.push(userShop[i].pid)
//     buyPidNum[userShop[i].pid] = userShop[i].count
//     updatePidNum.push({
//       id: userShop[i].pid,
//       quantity: ['incr', -userShop[i].count]
//     })
//     aidsObj[userShop[i].pid] = userShop[i].aid
//   }


//   // 查看当前销售员，是否已有总销售
//   let tempFSData = (await mysql.find(sale_rela.t, {
//     p0: [sale_rela.sale_uid, '=', sale_uid],
//     p1: [sale_rela.status, '=', 2],
//     r: 'p0 && p1'
//   })).data.objects
//   let fSaleData = tempFSData.length > 0 ? tempFSData[0] : {}
//   let fSaleUserInfo = (await mysql.get(users.t, fSaleData.f_sale_uid)).data
//   if(isRole('salesleader', fSaleUserInfo.role)){
//     // 是总销售
//     f_sale_uid = fSaleData.f_sale_uid
//   }


//   // 查寻商品是否足够，并下单
//   let {run, begin, rollback, commit, locks} = await mysql.transaction()
//   let trade_id

//   await begin(async () => {
//     try{
//       // 查寻用户要结算的几个产品，并加锁
//       const products_sql = (await mysql.find(product.t, {
//         p0: [product.id, 'in', pids],
//         r: 'p0'
//       }, 'sentence')) + locks.exclusive_locks

//       const pInfos = (await run(products_sql)).data.objects

//       // 检测这些商品有没有下架，以及数量够不够
//       for(let m = 0; m < pInfos.length; m++){
//         if(pInfos[m].status !== 20){
//           result = {
//             status: 0,
//             message: `抱歉，【${pInfos[m].title}】已下架`
//           }
//           return await rollback()
//         }
//         if(pInfos[m].quantity < buyPidNum[pInfos[m].id]){
//           result = {
//             status: 0,
//             message: `【${pInfos[m].title}】已被抢光了`
//           }
//           return await rollback()
//         }
//       }

//       // 没问题，那就将商品的数量减去
//       const updateQuantity = await mysql.updatemany(product.t, 'id', updatePidNum, 'sentence')
      
//       const dateTime = getTime('date_time')
//       const tradeNo = Date.now().toString() + randomCode(7, '0')
//       // 生成所有订单，订单号为同一个，表示是一起结算的。  
//       let orDatas: any = []
//       for(let n = 0; n < pInfos.length; n++){
//         let onePinfo = pInfos[n]
//         orDatas.push({
//           article_id: aidsObj[onePinfo.id],
//           product_id: onePinfo.id,
//           title: onePinfo.title,
//           des: onePinfo.des || '',
//           cover_url: onePinfo.img_urls.split(',')[0] || '',
//           uid: user.id,  // 购买者的id
//           business_uid: onePinfo.uid,  // 发布者（报价员）的id
//           sale_uid: sale_uid || null,  //销售的uid,
//           f_sale_uid: f_sale_uid || null,
//           phone: phone,
//           name: name,
//           address: address,
//           trade_status: 5, // 待支付
//           cost: onePinfo.cost || null,
//           sale_cost: onePinfo.sale_cost || null,
//           f_sale_cost: onePinfo.f_sale_cost || null,
//           quantity: buyPidNum[onePinfo.id],
//           price: onePinfo.price,
//           total_price: new Decimal(onePinfo.price).mul(new Decimal(buyPidNum[onePinfo.id])).toNumber(),
//           trade_no: tradeNo,
//           created_at: dateTime,
//           updated_at: dateTime
//         })
//       }
//       let setTradesSql = await mysql.setmany(trade.t, orDatas, 'sentence')

//       // TODO

//       let sql3 = await mysql.set(trade.t, orData, 'sentence')
//       await run(updateQuantity)
//       let res3 = await run(sql3) 

//       trade_id = res3.data.insertId
//       let preData = await payment.jsapi({
//         description: pInfo.title,
//         out_trade_no: tradeNo,
//         attach: '',
//         amount:{
//           total: new Decimal(pInfo.price).mul(new Decimal(100)).mul(new Decimal(buyNum)).toNumber()  //金额，单位为分
//         },
//         payer:{
//           openid: user.openid
//         },
//         settle_info: {
//           profit_sharing: sale_uid ? true : false // 该订单是否支持分账
//         }
//       })
//       wxData = {
//         signType: 'RSA',
//         paySign: '',
//         package: `prepay_id=${JSON.parse(preData.data).prepay_id}`,
//         nonceStr: randomCode(32, '0aA'),
//         timeStamp: (((getTime('stamp') as number) / 1000) >>> 0).toString()
//       }
//       wxData.paySign = payment.rsaSign(`${WEAPP.APP_ID}\n${wxData.timeStamp}\n${wxData.nonceStr}\n${wxData.package}\n`, PRIVATE_KEY)
//       // 保存订单参数
//       const sql4 = await mysql.set(wait_paid.t, {
//         sign_type: wxData.signType,
//         pay_sign: wxData.paySign,
//         package: wxData.package,
//         nonce_str: wxData.nonceStr,
//         time_stamp: wxData.timeStamp,
//         trade_id: trade_id,
//         created_at: dateTime,
//         uid: user.id //购买者
//       }, 'sentence')
//       await run(sql4)
//       result = {
//         status: 2,
//         message: '订单生成成功'
//       }
//       await commit()
//     }catch(err: any){
//       await rollback()
//       result = {
//         status: 0,
//         message: '订单生成失败'
//       }
//       throw new Error(err)
//     }
//   })


//   // 定义一个未来的时间，自动删除未支付的订单,和微信支付信息
//   let date = new Date(Date.now() + PREPAY_TIME * 1000)
//   // 定义一个任务
//   let job = schedule.scheduleJob(date, async () => {
//     // 删除订单
//     let tempTra = (await mysql.get(trade.t, trade_id)).data
//     if(tempTra.trade_status === 5){
//       let {run, begin, rollback, commit} = await mysql.transaction()
//       await begin(async () => {
//         try{
//           let sql1 = await mysql.update(trade.t, trade_id, {status: 0}, 'sentence')
//           await run(sql1)
//           let sql2 = await mysql.update(product.t, tempTra.product_id, {quantity: ['incr', tempTra.quantity]}, 'sentence')
//           await run(sql2)
//           let sql3 = await mysql.update(wait_paid.t, {trade_id: trade_id}, {status: 0}, 'sentence')
//           await run(sql3)
//           await commit()
//         }catch(err: any){
//           await rollback()
//           throw new Error(err)
//         }
//       })
//     }
//   })

//   res.json({
//     ...result,
//     wxData: wxData
//   })
// })


// 获取代付款的支付信息
payRouter.get('/buy/article/wait_pay/:trade_id', authUse, async (ctx, next) => {
  const {user, params} = ctx
  const {trade_id} = params
  let temp = (await mysql.find(wait_paid.t, {
    p0: [wait_paid.trade_id, '=', trade_id],
    p1: [wait_paid.status, '=', 2],
    r: 'p0 && p1'
  })).data.objects
  if(temp.length === 0){
    return ctx.body = {status: 0, message: '微信支付信息未找到'}
  }
  if(temp[0].uid !== user.id){
    return ctx.body = {status: 0, message: '不是你的订单，支付错误'}
  }
  ctx.body = {
    status: 2,
    wxData: {
      signType: temp[0].sign_type,
      paySign: temp[0].pay_sign,
      package: temp[0].package,
      nonceStr: temp[0].nonce_str,
      timeStamp: temp[0].time_stamp
    }
  }
})



export default payRouter