import {mysql, promiselimit, redis} from 'access-db'

import {authUse, authSuperMana, authMana} from '../../middlewares/auth'
import {
  article,
  article_draft,
  product,
  product_draft,
  sale_rela,
  sale_user_rela,
  share_money,
  sys_paths,
  trade,
  users,
  gift_trade,
  gift_picked,
  gift_theme,
  feedback,
} from '../../constants/table'
import {toImgListUrls, toImgListUrl, getTime, toImgUrls, dateTime} from '../../utils/utils'
import { QUOTER, SALES_PEOPLE, SALES_LEADER } from '../../constants/constants'
import {productCacheOne} from '../../utils/cache'


const manageRouter = require('koa-router')()

manageRouter.prefix('/management/manage')


/* 获取用户可操作的菜单 */
manageRouter.get('/menu/list', authUse, async function(ctx, next) {
  const {user} = ctx
  
  let tempA = user.authority.split(',')
  let tempSubList = (await mysql.find(sys_paths.t, {
    p1: [sys_paths.sub_path, 'in', tempA],
    p2: [sys_paths.type, '=', 2],
    r: 'p1 && p2'
  })).data.objects

  let tempPath: string[] = []
  for(let i in tempSubList){
    tempPath.push(tempSubList[i].path)
  }

  let tempList = (await mysql.find(sys_paths.t, {
    p1: [sys_paths.path, 'in', tempPath],
    p2: [sys_paths.type, '=', 1],
    r: 'p1 && p2',
    orderBy: [sys_paths.sort_num]
  })).data.objects

  let list: any = []
  for(let i = 0; i < tempList.length; i++){
    list[i] = tempList[i]
    list[i]['sub_list'] = []
    for(let j = 0; j < tempSubList.length; j++){
      if(tempList[i].path === tempSubList[j].path){
        list[i]['sub_list'].push(tempSubList[j])
      }
    }
  }
  ctx.body = list
})



// 搜索用户，
manageRouter.get('/searchUser/:keyword', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx
  const {keyword} = ctx.params

  if(!keyword) {
    return ctx.body = []
  }

  let search = (await mysql.find(users.t, {
    p0: [users.email, 'like', `%${keyword}%`],
    p1: [users.nickname, 'like', `%${keyword}%`],
    r: 'p0 || p1',
    select: [
      users.id, 
      users.nickname, 
      users.email, 
      users.phone, 
      users.avatar_url,
      users.authority,
      users.role
    ]
  })).data.objects
  ctx.body = search
  
})


// 普通用户列表
manageRouter.post('/users/list', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {page=1, limit=20} = ctx.request.body

  let total, list, result
  total = (await mysql.count(users.t, {})).data

  list = (await mysql.find(users.t, {
    p0: [users.id, '>', 0],
    r: 'p0',
    page: page,
    limit: limit,
    orderBy: ['-' + users.created_at],
    select: [
      users.id,
      users.created_at,
      users.gender,
      users.city,
      users.openid,
      users.phone,
      users.email,
      users.nickname,
      users.avatar_url
    ]
  })).data.objects

  result = {
    list: list,
    total: total
  }
  ctx.body = result
})




// 文章审核,列表
manageRouter.post('/article/list', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {page=1, limit=20, type=10} = ctx.request.body

  let total, list
  
  if(type === 20 || type === 6){
    total = (await mysql.count(article.t, {
      p0: [article.status, '=', type],
      r: 'p0',
    })).data
    list = (await mysql.find(article.t, {
      j0: [article.product_id, 'inner', product.id],
      p0: [article.status, '=', type],
      r: 'p0',
      page: page,
      limit: limit,
      orderBy: ['-' + article.created_at],
      select: [
        article.id,
        article.title+ ' as article_title',
        article.img_urls + ' as article_img_urls',
        article.html + ' as article_html',
        article.des + ' as article_des',
        article.status,
        article.created_at,
  
        product.id + ' as pid',
        product.title + ' as product_title',
        product.goods_url + ' as product_goods_url',
        product.price + ' as product_price',
        product.cost + ' as product_cost',
        product.sale_cost + ' as product_sale_cost',
        product.f_sale_cost + ' as product_f_sale_cost',
        product.img_urls + ' as product_img_urls',
        product.quantity + ' as product_quantity',
        product.des + ' as product_des',
        product.name + ' as product_name',
        product.mobile + ' as product_mobile',
        product.province + ' as product_province',
        product.addr + ' as product_addr',
        product.city + ' as product_city',
        product.area + ' as product_area',
        product.weight + ' as product_weight',
        product.space_x + ' as product_space_x',
        product.space_y + ' as product_space_y',
        product.space_z + ' as product_space_z',
        product.cat_id + ' as product_cat_id',
        product.can_gift + ' as product_can_gift',

        product.can_group + ' as product_can_group',
        product.group_end + ' as product_group_end',
        product.group_price + ' as product_group_price',
        product.group_quantity + ' as product_group_quantity',
        product.group_cost + ' as product_group_cost',
        product.group_sale_cost + ' as product_group_sale_cost',
        product.group_f_sale_cost + ' as product_group_f_sale_cost',
        // product_draft.reason
      ]
    })).data.objects
  }else{
    total = (await mysql.count(article_draft.t, {
      p0: [article_draft.status, '=', type],
      r: 'p0',
    })).data
  
    list = (await mysql.find(article_draft.t, {
      j0: [article_draft.product_draft_id, 'inner', product_draft.id],
      p0: [article_draft.status, '=', type],
      r: 'p0',
      page: page,
      limit: limit,
      orderBy: ['-' + article_draft.created_at],
      select: [
        article_draft.id,
        article_draft.article_title,
        article_draft.article_img_urls,
        article_draft.article_html,
        article_draft.article_des,
        article_draft.reason,
        article_draft.status,
        article_draft.created_at,
  
        product_draft.id + ' as pdid',
        product_draft.product_title,
        product_draft.product_goods_url,
        product_draft.product_price,
        product_draft.product_cost,
        product_draft.product_sale_cost,
        product_draft.product_f_sale_cost,
        product_draft.product_img_urls,
        product_draft.product_quantity,
        product_draft.product_des,
        product_draft.product_name,
        product_draft.product_mobile,
        product_draft.product_province,
        product_draft.product_addr,
        product_draft.product_city,
        product_draft.product_area,
        product_draft.product_weight,
        product_draft.product_space_x,
        product_draft.product_space_y,
        product_draft.product_space_z,
        product_draft.product_cat_id,
        product_draft.product_can_gift,
        product_draft.product_can_group,
        product_draft.product_group_end,
        product_draft.product_group_price,
        product_draft.product_group_quantity,
        product_draft.product_group_cost,
        product_draft.product_group_sale_cost,
        product_draft.product_group_f_sale_cost,
        // product_draft.reason
      ]
    })).data.objects
  }
  ctx.body = {
    list: toImgListUrls(toImgListUrls(list, 'article_img_urls'), 'product_img_urls'),
    total: total
  }
  
})


// 文章审核通过，保存文章到正式表，删除现有草稿文章
manageRouter.put('/article/examine', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {adid, pdid, type, reason} = ctx.request.body
  // type为2 ，表示通过审核，为0表示审核不过
  
  const [r1, r2] = await promiselimit([
    mysql.get(article_draft.t, adid),
    mysql.get(product_draft.t, pdid)
  ])
  const articleDraft = r1.data
  const productDraft = r2.data
  const dt = getTime('date_time')

  const {begin, run, rollback, commit} = await mysql.transaction()
  let result: any = {
    status: 0,
    message: ''
  }

  // 审核通过
  if(type === 2){
    await begin(async () => {
      try{
        let sql1, sql2, dsql1, dsql2
        if(productDraft.online_product_id){
          sql1 = await mysql.update(product.t, productDraft.online_product_id, {
            title: productDraft.product_title,
            goods_url: productDraft.product_goods_url,
            uid: productDraft.uid,
            img_urls: productDraft.product_img_urls,
            des: productDraft.product_des,
            price: productDraft.product_price,
            cost: productDraft.product_cost,
            sale_cost: productDraft.product_sale_cost,
            f_sale_cost: productDraft.product_f_sale_cost,
            quantity: productDraft.product_quantity,
            name: productDraft.product_name,
            mobile: productDraft.product_mobile,
            province: productDraft.product_province,
            city: productDraft.product_city,
            area: productDraft.product_area,
            addr: productDraft.product_addr,
            weight: productDraft.product_weight,
            space_x: productDraft.product_space_x,
            space_y: productDraft.product_space_y,
            space_z: productDraft.product_space_z,
            cat_id: productDraft.product_cat_id,
            can_gift: productDraft.product_can_gift,

            can_group: productDraft.product_can_group,
            group_price: productDraft.product_group_price,
            group_end: dateTime(productDraft.product_group_end, 'dateTime'),
            group_quantity: productDraft.product_group_quantity,
            group_cost: productDraft.product_group_cost,
            group_sale_cost: productDraft.product_group_sale_cost,
            group_f_sale_cost: productDraft.product_group_f_sale_cost,

            created_at: dt,
            updated_at: dt,
            status: 20,
          }, 'sentence')
        }else{
          sql1 = await mysql.set(product.t, {
            title: productDraft.product_title,
            goods_url: productDraft.product_goods_url,
            uid: productDraft.uid,
            img_urls: productDraft.product_img_urls,
            des: productDraft.product_des,
            price: productDraft.product_price,
            cost: productDraft.product_cost,
            sale_cost: productDraft.product_sale_cost,
            f_sale_cost: productDraft.product_f_sale_cost,
            quantity: productDraft.product_quantity,
            name: productDraft.product_name,
            mobile: productDraft.product_mobile,
            province: productDraft.product_province,
            city: productDraft.product_city,
            area: productDraft.product_area,
            addr: productDraft.product_addr,
            weight: productDraft.product_weight,
            space_x: productDraft.product_space_x,
            space_y: productDraft.product_space_y,
            space_z: productDraft.product_space_z,
            cat_id: productDraft.product_cat_id,
            can_gift: productDraft.product_can_gift,

            can_group: productDraft.product_can_group,
            group_price: productDraft.product_group_price,
            group_end: dateTime(productDraft.product_group_end, 'dateTime'),
            group_quantity: productDraft.product_group_quantity,
            group_cost: productDraft.product_group_cost,
            group_sale_cost: productDraft.product_group_sale_cost,
            group_f_sale_cost: productDraft.product_group_f_sale_cost,

            created_at: dt,
            updated_at: dt,
            status: 20,
          }, 'sentence')
        }
  
        dsql1 = (await mysql.del(product_draft.t, productDraft.id, 'sentence'))
        
        let tempP = (await run(sql1)).data
        let pid = productDraft.online_product_id ? productDraft.online_product_id : tempP.insertId //保存产品，pid
        let temp_aid 

        if(articleDraft.online_article_id){
          sql2 = await mysql.update(article.t, articleDraft.online_article_id, {
            title: articleDraft.article_title,
            des: articleDraft.article_des,
            html: articleDraft.article_html,
            img_urls: articleDraft.article_img_urls,
            uid: articleDraft.uid,
            status: 20,
            product_id: pid,
            created_at: dt,
            updated_at: dt,
          }, 'sentence')
          await run(sql2)
          temp_aid = articleDraft.online_article_id
        }else{
          sql2 = await mysql.set(article.t, {
            title: articleDraft.article_title,
            des: articleDraft.article_des,
            html: articleDraft.article_html,
            img_urls: articleDraft.article_img_urls,
            uid: articleDraft.uid,
            status: 20,
            product_id: pid,
            created_at: dt,
            updated_at: dt,
          }, 'sentence')
          temp_aid = (await run(sql2)).data.insertId
        }
  
        dsql2 = await mysql.del(article_draft.t, articleDraft.id, 'sentence')
        
        await run(dsql1)
        await run(dsql2)
        await commit()
        productCacheOne(temp_aid, false)
        result = {
          status: 2,
          message: '操作成功'
        }
      }catch(err){
        await rollback()
        result = {
          status: 0,
          message: '更新失败'
        }
      }
    })
  }

  // 审核不过
  if(type === 0){
    await begin(async () => {
      try{
        let sql1, sql2
        sql1 = await mysql.update(product_draft.t, pdid, {
          reason: reason || '审核未通过',
          updated_at: dt,
          status: 5,
        }, 'sentence')

        sql2 = await mysql.update(article_draft.t, adid, {
          reason: reason || '审核未通过',  
          updated_at: dt,
          status: 5,
        }, 'sentence')
        
        await run(sql1)
        await run(sql2)
        await commit()
        result = {
          status: 2,
          message: '操作成功'
        }
      }catch(err){
        await rollback()
        result = {
          status: 0,
          message: '更新失败'
        }
      }
    })
  }
  ctx.body = result
})



// 礼物订单管理
manageRouter.post('/gift_trade/list', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {page=1, limit=20, type=5, isExcel=0} = ctx.request.body


  let total, list, result
  total = (await mysql.count(gift_trade.t, {
    p0: [gift_trade.status, '=', 2],
    p1: [gift_trade.trade_status, '=', type],
    r: 'p0 && p1',
  })).data

  list = (await mysql.find(gift_trade.t, {
    j0: [gift_trade.business_uid, 'inner', users.id],
    j1: [gift_trade.uid, 'inner', users.id],
    p0: [gift_trade.status, '=', 2],
    p1: [gift_trade.trade_status, '=', type],
    r: 'p0 && p1',
    page: isExcel ? '' : page,
    limit: isExcel ? '' : limit,
    orderBy: ['-' + gift_trade.created_at],
    select: [
      gift_trade.id,
      gift_trade.price,
      gift_trade.quantity,
      gift_trade.remain_quantity,
      gift_trade.gift_theme_id,
      gift_trade.title,
      gift_trade.total_price,
      gift_trade.trade_no,
      gift_trade.trade_status,
      gift_trade.cover_url,
      gift_trade.business_uid,
      gift_trade.uid,
      'j1' + users.nickname + ' as user_nickname',
      'j1' + users.avatar_url + ' as user_avatar',
      gift_trade.picked_phone,
      gift_trade.created_at,
      gift_trade.updated_at,
      'j0' + users.nickname + ' as business_nickname',
      'j0' + users.avatar_url + ' as business_avatar'
    ]
  })).data.objects

  if(isExcel){
    let temp:any = []
    for(let o of list){
      temp.push({
        ...o,
        created_at: dateTime(o.created_at, 'dateTime'),
        trade_status: o.trade_status === 20 ? '已完成' : 
                      o.trade_status === 15 ? '待收货' :
                      o.trade_status === 10 ? '待发货' :
                      o.trade_status === 5 ? '待支付' :
                      o.trade_status === 3 ? '已取消' : '未知'
      })
    }
    result = {
      columns: [
        {dataIndex: 'trade_no', title: '订单号'},
        {dataIndex: 'trade_status', title: '订单状态'},
        {dataIndex: 'title', title: '商品名'},
        {dataIndex: 'price', title: '商品单价(CNY)'},
        {dataIndex: 'quantity', title: '购买数量'},
        {dataIndex: 'remain_quantity', title: '剩余数量'},
        {dataIndex: 'picked_phone', title: '收礼者电话'},
        {dataIndex: 'total_price', title: '合计价格(CNY)'},
        {dataIndex: 'business_nickname', title: '报价员昵称'},
        {dataIndex: 'created_at', title: '下单时间'},
      ],
      rows: temp,
      total: total
    }
  }else{
    result = {
      list: toImgUrls(list, 'cover_url'),
      total: total
    }
  }
  ctx.body = result
})

// 通过礼物订单ID，获取礼物的领取记录
manageRouter.post('/gift_picked/list', authUse, authMana, async (ctx, next) => {
  const {user} = ctx
  const {gtid} = ctx.request.body

  let total, list, result
  total = (await mysql.count(gift_picked.t, {
    p0: [gift_picked.status, '=', 2],
    p2: [gift_picked.gift_trade_id, '=', gtid],
    r: 'p0 && p2',
  })).data

  list = (await mysql.find(gift_picked.t, {
    j1: [gift_picked.uid, 'inner', users.id],
    p0: [gift_picked.status, '=', 2],
    p1: [gift_picked.gift_trade_id, '=', gtid],
    r: 'p0 && p1',
    orderBy: ['-' + gift_picked.created_at],
    select: [
      gift_picked.id,
      gift_picked.price,
      gift_picked.quantity,
      gift_picked.name,
      gift_picked.phone,
      gift_picked.address,
      gift_picked.title,
      gift_picked.total_price,
      gift_picked.picked_no,
      gift_picked.gift_trade_status,
      gift_picked.express_no,
      gift_picked.cover_url,
      gift_picked.uid,
      users.nickname + ' as user_nickname',
      users.avatar_url + ' as user_avatar',
      gift_picked.verify_phone,
      gift_picked.created_at,
      gift_picked.updated_at,
    ]
  })).data.objects

  result = {
    list: toImgUrls(list, 'cover_url'),
    total: total
  }
  ctx.body = result
})

// 获取领取礼物的列表
manageRouter.post('/gift/gift_picked_list', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {page=1, limit=20, type=10, isExcel=0} = ctx.request.body


  let total, list, result
  total = (await mysql.count(gift_picked.t, {
    p0: [gift_picked.status, '=', 2],
    p1: [gift_picked.gift_trade_status, '=', type],
    r: 'p0 && p1',
  })).data

  list = (await mysql.find(gift_picked.t, {
    j0: [gift_picked.business_uid, 'inner', users.id],
    j1: [gift_picked.uid, 'inner', users.id],
    p0: [gift_picked.status, '=', 2],
    p1: [gift_picked.gift_trade_status, '=', type],
    r: 'p0 && p1',
    page: isExcel ? '' : page,
    limit: isExcel ? '' : limit,
    orderBy: ['-' + gift_picked.created_at],
    select: [
      gift_picked.id,
      gift_picked.price,
      gift_picked.quantity,
      gift_picked.name,
      gift_picked.phone,
      gift_picked.address,
      gift_picked.title,
      gift_picked.total_price,
      gift_picked.picked_no,
      gift_picked.gift_trade_status,
      gift_picked.express_no,
      gift_picked.cover_url,
      gift_picked.uid,
      'j1' + users.nickname + ' as user_nickname',
      'j1' + users.avatar_url + ' as user_avatar',
      gift_picked.verify_phone,
      gift_picked.created_at,
      gift_picked.updated_at,
      'j0' + users.nickname + ' as business_nickname',
      'j0' + users.avatar_url + ' as business_avatar'
    ]
  })).data.objects

  if(isExcel){
    let temp:any = []
    for(let o of list){
      temp.push({
        ...o,
        created_at: dateTime(o.created_at, 'dateTime'),
        gift_trade_status: o.gift_trade_status === 20 ? '已完成' : 
                      o.gift_trade_status === 15 ? '待收货' :
                      o.gift_trade_status === 10 ? '待发货' :
                      o.gift_trade_status === 8 ? '待填写' :
                      o.gift_trade_status === 5 ? '待支付' :
                      o.gift_trade_status === 3 ? '已取消' : '未知'
      })
    }
    result = {
      columns: [
        {dataIndex: 'picked_no', title: '领取单号'},
        {dataIndex: 'gift_trade_status', title: '领取状态'},
        {dataIndex: 'title', title: '商品名'},
        {dataIndex: 'price', title: '商品单价(CNY)'},
        {dataIndex: 'quantity', title: '领取数量'},
        {dataIndex: 'name', title: '收件人'},
        {dataIndex: 'phone', title: '收件电话'},
        {dataIndex: 'address', title: '收件地址'},
        {dataIndex: 'express_no', title: '运单号'},
        {dataIndex: 'verify_phone', title: '验证的手机'},
        {dataIndex: 'total_price', title: '合计价格(CNY)'},
        {dataIndex: 'business_nickname', title: '报价员昵称'},
        {dataIndex: 'created_at', title: '领取时间'},
      ],
      rows: temp,
      total: total
    }
  }else{
    result = {
      list: toImgUrls(list, 'cover_url'),
      total: total
    }
  }
  ctx.body = result
})

// 礼物发货，即：待发货》已完成
manageRouter.put('/gift/picked_send_out', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {gpid='', express_no=''} = ctx.request.body

  let result: any = {
    status: 0,
    message: ''
  }
  const dt = getTime('date_time')

  await mysql.update(gift_picked.t, gpid, {
    express_no: express_no,
    updated_at: dt,
    gift_trade_status: 20,  // 本应该为15，但目前没这个状态，
  })

  result = {
    status: 2, 
    message: '操作成功'
  }
  ctx.body = result
})

// 订单管理
manageRouter.post('/trade/list', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {page=1, limit=20, type=5, isExcel=0} = ctx.request.body


  let total, list, result
  total = (await mysql.count(trade.t, {
    p0: [trade.status, '=', 2],
    p1: [trade.trade_status, '=', type],
    r: 'p0 && p1',
  })).data

  list = (await mysql.find(trade.t, {
    j0: [trade.business_uid, 'inner', users.id],
    j1: [trade.uid, 'inner', users.id],
    j2: [trade.product_id, 'inner', product.id],
    p0: [trade.status, '=', 2],
    p1: [trade.trade_status, '=', type],
    r: 'p0 && p1',
    page: isExcel ? '' : page,
    limit: isExcel ? '' : limit,
    orderBy: ['-' + trade.created_at],
    select: [
      trade.id,
      trade.name,
      trade.phone,
      trade.address,
      trade.price,
      trade.quantity,
      trade.title,
      trade.total_price,
      trade.trade_no,
      trade.trade_status,
      trade.cover_url,
      trade.business_uid,
      trade.uid,
      'j1' + users.nickname + ' as user_nickname',
      'j1' + users.avatar_url + ' as user_avatar',
      trade.express_no,
      trade.is_group,
      trade.created_at,
      trade.updated_at,
      'j0' + users.nickname + ' as business_nickname',
      'j0' + users.avatar_url + ' as business_avatar',
      product.goods_url + ' as goods_url',
    ]
  })).data.objects

  if(isExcel){
    let temp:any = []
    for(let o of list){
      temp.push({
        ...o,
        created_at: dateTime(o.created_at, 'dateTime'),
        trade_status: o.trade_status === 20 ? '已完成' : 
                      o.trade_status === 15 ? '待收货' :
                      o.trade_status === 10 ? '待发货' :
                      o.trade_status === 5 ? '待支付' :
                      o.trade_status === 3 ? '已取消' : '未知',
        is_group: o.is_group === 1 ? '是' : '否',
      })
    }
    result = {
      columns: [
        {dataIndex: 'trade_no', title: '订单号'},
        {dataIndex: 'trade_status', title: '订单状态'},
        {dataIndex: 'name', title: '收件人'},
        {dataIndex: 'phone', title: '联系电话'},
        {dataIndex: 'address', title: '收货地址'},
        {dataIndex: 'title', title: '商品名'},
        {dataIndex: 'price', title: '商品单价(CNY)'},
        {dataIndex: 'quantity', title: '购买数量'},
        {dataIndex: 'total_price', title: '合计价格(CNY)'},
        {dataIndex: 'business_nickname', title: '报价员昵称'},
        {dataIndex: 'is_group', title: '是否团购'},
        {dataIndex: 'created_at', title: '下单时间'},
      ],
      rows: temp,
      total: total
    }
  }else{
    result = {
      list: toImgUrls(list, 'cover_url'),
      total: total
    }
  }
  ctx.body = result
})


// 发货, 更新
manageRouter.put('/trade/send_out', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {tid='', express_no=''} = ctx.request.body

  let result: any = {
    status: 0,
    message: ''
  }
  const dt = getTime('date_time')

  await mysql.update(trade.t, tid, {
    express_no: express_no,
    updated_at: dt,
    trade_status: 15,  // ，
  })

  result = {
    status: 2, 
    message: '操作成功'
  }
  ctx.body = result
  
})



// 订单列表
manageRouter.post('/share/list', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {page=1, limit=20, type=1, isExcel=0} = ctx.request.body


  let total, list, result
  total = (await mysql.count(share_money.t, {
    p0: [share_money.status, '=', 2],
    p1: [share_money.share_status, '=', type],
    r: 'p0 && p1',
  })).data

  list = (await mysql.find(share_money.t, {
    j0: [share_money.account, 'left', users.openid],
    p0: [share_money.status, '=', 2],
    p1: [share_money.share_status, '=', type],
    r: 'p0 && p1',
    page: page,
    limit: limit,
    orderBy: ['-' + share_money.create_at],
    select: [
      share_money.id,
      share_money.out_order_no,
      share_money.transaction_id,
      share_money.account,
      share_money.amount,
      share_money.create_at,
      share_money.description,
      share_money.type,
      share_money.share_status,
      share_money.is_group,
      users.nickname + ' as share_nickname',
      users.avatar_url + ' as share_avatar'
    ]
  })).data.objects

  result = {
    list: list,
    total: total
  }
  ctx.body = result
})




// 获取报价员列表
manageRouter.post('/quoter/list', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {page=1, limit=20} = ctx.request.body

  let total, list, result
  total = (await mysql.count(users.t, {
    p0: [users.role, 'like', `%${QUOTER}%`],
    r: 'p0',
  })).data

  list = (await mysql.find(users.t, {
    p0: [users.role, 'like', `%${QUOTER}%`],
    r: 'p0',
    page: page,
    limit: limit,
    orderBy: ['-' + users.created_at],
    select: [
      users.id,
      users.created_at,
      users.gender,
      users.city,
      users.openid,
      users.phone,
      users.email,
      users.nickname,
      users.avatar_url
    ]
  })).data.objects

  result = {
    list: list,
    total: total
  }
  ctx.body = result
})

// 获取销售员列表
manageRouter.post('/sale/list', authUse, authMana, async function(ctx, next) {
  const {user, body} = ctx
  const {page=1, limit=20} = body

  let total, list, result
  total = (await mysql.count(users.t, {
    p0: [users.role, 'like', `%${SALES_PEOPLE}%`],
    r: 'p0',
  })).data

  list = (await mysql.find(users.t, {
    p0: [users.role, 'like', `%${SALES_PEOPLE}%`],
    r: 'p0',
    page: page,
    limit: limit,
    orderBy: ['-' + users.created_at],
    select: [
      users.id,
      users.created_at,
      users.gender,
      users.city,
      users.openid,
      users.phone,
      users.email,
      users.nickname,
      users.avatar_url
    ]
  })).data.objects

  result = {
    list: list,
    total: total
  }
  ctx.body = result
})

// 查寻销售员下面，一共有多少个用户
manageRouter.get('/sale/users/:suid', authUse, authMana, async function(ctx, next) {
  const {user, params} = ctx
  const {suid='0'} = params

  let total, list, result
  total = (await mysql.count(sale_user_rela.t, {
    p0: [sale_user_rela.sale_uid, '=', suid],
    r: 'p0',
  })).data

  list = (await mysql.find(sale_user_rela.t, {
    j0: [sale_user_rela.uid, 'inner', users.id],
    p0: [sale_user_rela.sale_uid, '=', suid],
    r: 'p0',
    select: [
      'sale_user_rela.*',
      users.gender,
      users.city,
      users.phone,
      users.email,
      users.nickname,
      users.avatar_url
    ]
  })).data.objects

  result = {
    list: list,
    total: total
  }
  ctx.body = result
})



// 获取总销售员列表
manageRouter.post('/fsale/list', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {page=1, limit=20} = ctx.request.body

  let total, list, result
  total = (await mysql.count(users.t, {
    p0: [users.role, 'like', `%${SALES_LEADER}%`],
    r: 'p0',
  })).data

  list = (await mysql.find(users.t, {
    p0: [users.role, 'like', `%${SALES_LEADER}%`],
    r: 'p0',
    page: page,
    limit: limit,
    orderBy: ['-' + users.created_at],
    select: [
      users.id,
      users.created_at,
      users.gender,
      users.city,
      users.openid,
      users.phone,
      users.email,
      users.nickname,
      users.avatar_url
    ]
  })).data.objects

  result = {
    list: list,
    total: total
  }
  ctx.body = result
})
// 查寻销售员下面，一共有多少个用户
manageRouter.get('/fsale/saler/:fuid', authUse, authMana, async function(ctx, next) {
  const {user, params} = ctx
  const {fuid='0'} = params

  let total, list, result
  total = (await mysql.count(sale_rela.t, {
    p0: [sale_rela.f_sale_uid, '=', fuid],
    p1: [sale_rela.status, '=', 2],
    r: 'p0 && p1',
  })).data

  list = (await mysql.find(sale_rela.t, {
    j0: [sale_rela.sale_uid, 'inner', users.id],
    p0: [sale_rela.f_sale_uid, '=', fuid],
    p1: [sale_rela.status, '=', 2],
    r: 'p0 && p1',
    select: [
      'sale_rela.*',
      users.gender,
      users.city,
      users.phone,
      users.email,
      users.nickname,
      users.avatar_url
    ]
  })).data.objects

  result = {
    list: list,
    total: total
  }
  ctx.body = result
})



// 送礼的贺卡列表
manageRouter.get('/gift_theme/gift_theme_list', authUse, authMana, async (ctx, next) => {
  let list = (await mysql.find(gift_theme.t, {
    p0: [gift_theme.status, '>', 0],
    r: 'p0'
  })).data.objects
  for(let i = 0; i < list.length; i++){
    list[i].bg_image_url = process.env.STATIC_URL + list[i].bg_image
    list[i].share_image_url = process.env.STATIC_URL + list[i].share_image
  }
  ctx.body = list
})

// 新增贺卡
manageRouter.post('/gift_theme/gift_theme_add', authUse, authMana, async (ctx, next) => {
  const {title, bg_image, share_image, message} = ctx.request.body
  await mysql.set(gift_theme.t, {
    title: title,
    bg_image: bg_image, 
    share_image: share_image,
    message: message,
    status: 2,
  })
  ctx.body = {
    status: 2,
    message: '新增成功'
  }
})

// 更新贺卡
manageRouter.put('/gift_theme/gift_theme_update', authUse, authMana, async (ctx, next) => {
  const {title, bg_image, share_image, message, id} = ctx.request.body
  await mysql.update(gift_theme.t, id, {
    title: title,
    bg_image: bg_image, 
    share_image: share_image,
    message: message,
    status: 2,
  })
  ctx.body = {
    status: 2,
    message: '更新成功'
  }
})

// 下线贺卡,上线
manageRouter.put('/gift_theme/gift_theme_change', authUse, authMana, async (ctx, next) => {
  const {id} = ctx.request.body
  let info = (await mysql.get(gift_theme.t, id)).data
  await mysql.update(gift_theme.t, id, {
    status: info.status === 2 ? 1 : 2,
  })
  ctx.body = {
    status: 2,
    message: '操作成功'
  }
})


// 查寻feedback列表
manageRouter.post('/feedback/list', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  const {page=1, limit=20} = ctx.request.body

  let total, list, result
  total = (await mysql.count(feedback.t, {
    p0: [feedback.id, '>', 0],
    r: 'p0',
  })).data

  list = (await mysql.find(feedback.t, {
    p0: [feedback.id, '>', 0],
    r: 'p0',
    page: page,
    limit: limit,
    orderBy: ['-' + users.created_at],
  })).data.objects

  result = {
    list: list,
    total: total
  }
  ctx.body = result
})

export default manageRouter


