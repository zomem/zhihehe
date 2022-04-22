import {mysql} from 'access-db'

import {authUse, authMana, isSuperAdmin} from '../../middlewares/auth'
import {users, article, product, product_draft, sys_constants, sys_product_cat, article_draft, comment} from '../../constants/table'
import {toImgListUrls, toImgListUrl, getTime, salePrice, dateTime, isRole} from '../../utils/utils'
import {productCacheOne} from '../../utils/cache'



const manaProductRouter = require('koa-router')()

manaProductRouter.prefix('/management/product')




const DEFAULT_PERCENT = 1.2
// 获取售价百分比
manaProductRouter.get('/price/percent', authUse, authMana, async (ctx, next) => {
  let percent:number = DEFAULT_PERCENT
  let per = (await mysql.find(sys_constants.t, {
    p0: [sys_constants.status, '=', 2],
    p2: [sys_constants.key, '=', 'PRICE_PERCENT'],
    r: 'p0 && p2'
  })).data.objects
  if(per.length > 0) percent = parseFloat(per[0].value)
  ctx.body = {percent}
})



// 新增商品，先会将商品存在草稿表，，未发布，都保存为草稿
manaProductRouter.post('/add', authUse, authMana, isSuperAdmin, async function (ctx, next) {
  const {user} = ctx
  const {body} = ctx.request
  const {
    goods_url,
    title, 
    img_paths, 
    quantity, 
    cost,
    f_sale_cost, 
    sale_cost, 
    dpid, 
    des,
    name,
    mobile,
    province,
    city,
    area,
    addr,
    weight,
    space_x,
    space_y,
    space_z,
    cat_id,
    can_gift,
    can_group=0,
    group_end,
  } = body

  let group_quantity = body.group_quantity || 0
  let group_cost = body.group_cost || 0
  let group_sale_cost = body.group_sale_cost || 0
  let group_f_sale_cost = body.group_f_sale_cost || 0

  const datetime = getTime('date_time')

  if(!isRole('quoter', user.role)){
    return ctx.body = {
      status: 0,
      message: '你没有报价员权限'
    }
  }

  let per = (await mysql.find(sys_constants.t, {
    p0: [sys_constants.status, '=', 2],
    p2: [sys_constants.key, '=', 'PRICE_PERCENT'],
    r: 'p0 && p2'
  })).data.objects
  let percent: number = per.length > 0 ? parseFloat(per[0].value) : DEFAULT_PERCENT
  let salep = salePrice(parseFloat(cost), parseFloat(f_sale_cost), parseFloat(sale_cost), percent)
  let g_salep = salePrice(parseFloat(group_cost), parseFloat(group_f_sale_cost), parseFloat(group_sale_cost), percent)

  if(parseFloat(cost) <= 0){
    return ctx.body = {
      status: 0,
      message: '成本不能为0'
    }
  }
  if((parseFloat(f_sale_cost) + parseFloat(sale_cost)) / salep >= 0.29){
    return ctx.body = {
      status: 0,
      message: '新增失败，销售总分成，不得超过售价的29%'
    }
  }

  if(can_group === 1 && g_salep > 0){
    if(parseFloat(group_cost) <= 0){
      return ctx.body = {
        status: 0,
        message: '团购成本不能为0'
      }
    }
    if((parseFloat(group_f_sale_cost) + parseFloat(group_sale_cost)) / g_salep >= 0.29){
      return ctx.body = {
        status: 0,
        message: '新增失败，团购的销售总分成，不得超过售价的29%'
      }
    }
  }

  let tempId = 0
  if(dpid){
    // 更新
    let oldUid = (await mysql.get(product_draft.t, dpid)).data.uid
    await mysql.update(product_draft.t, dpid, {
      product_title: title,
      product_goods_url: goods_url,
      product_price: salep,
      product_cost: cost,
      product_sale_cost: sale_cost,
      product_f_sale_cost: f_sale_cost,
      product_quantity: quantity,
      product_img_urls: img_paths,
      product_des: des,

      product_name: name,
      product_mobile: mobile,
      product_province: province,
      product_city: city,
      product_area: area,
      product_addr: addr,
      product_weight: parseFloat(weight),
      product_space_x: parseInt(space_x),
      product_space_y: parseInt(space_y),
      product_space_z: parseInt(space_z),
      product_cat_id: cat_id,
      product_can_gift: can_gift,

      product_group_price: g_salep,
      product_can_group: can_group,
      product_group_end: group_end || null,
      product_group_quantity: group_quantity,
      product_group_cost: group_cost,
      product_group_sale_cost: group_sale_cost,
      product_group_f_sale_cost: group_f_sale_cost,

      status: 10,
      uid: oldUid || user.id,
      created_at: datetime,
      updated_at: datetime
    })
    tempId = dpid
  }else{
    tempId = (await mysql.set(product_draft.t, {
      product_title: title,
      product_goods_url: goods_url,
      product_price: salep,
      product_cost: cost,
      product_sale_cost: sale_cost,
      product_f_sale_cost: f_sale_cost,
      product_quantity: quantity,
      product_img_urls: img_paths,
      product_des: des,

      product_name: name,
      product_mobile: mobile,
      product_province: province,
      product_city: city,
      product_area: area,
      product_addr: addr,
      product_weight: parseFloat(weight),
      product_space_x: parseInt(space_x),
      product_space_y: parseInt(space_y),
      product_space_z: parseInt(space_z),
      product_cat_id: cat_id,
      product_can_gift: can_gift,

      product_group_price: g_salep,
      product_can_group: can_group,
      product_group_end: group_end || null,
      product_group_quantity: group_quantity,
      product_group_cost: group_cost,
      product_group_sale_cost: group_sale_cost,
      product_group_f_sale_cost: group_f_sale_cost,
      
      status: 10,
      uid: user.id,
      created_at: datetime,
      updated_at: datetime
    })).data.insertId as number
  }
  ctx.body = {
    status: 2,
    message: '操作成功',
    id: tempId
  }
})

// 新增文章
manaProductRouter.post('/article/add', authUse, authMana, async function(ctx, next){
  const {user} = ctx

  const {html, img_paths, product_draft_id, daid} = ctx.request.body

  const datetime = getTime('date_time')

  if(!isRole('quoter', user.role)){
    return ctx.body = {
      status: 0,
      message: '你没有报价员权限'
    }
  }


  let result = {
    status: 0,
    message: ''
  }
  if(daid){
    let oldUid = (await mysql.get(article_draft.t, daid)).data.uid
    await mysql.update(article_draft.t, daid, {
      product_draft_id: product_draft_id,
      article_title: '',
      article_html: html,
      article_img_urls: img_paths,
      article_des: '',
      status: 10,
      uid: oldUid || user.id,
      created_at: datetime,
      updated_at: datetime
    })
    result = {
      status: 2,
      message: '更新成功，待审核'
    }
  }else{
    await mysql.set(article_draft.t, {
      product_draft_id: product_draft_id,
      article_title: '',
      article_html: html,
      article_img_urls: img_paths,
      article_des: '',
      status: 10,
      uid: user.id,
      created_at: datetime,
      updated_at: datetime
    })
    result = {
      status: 2,
      message: '新增成功，待审核'
    }
  }
  ctx.body = result
})



// 获取商品的分类列表
manaProductRouter.get('/product_cat/list', authUse, authMana, async (ctx, next) => {
  let list = (await mysql.find(sys_product_cat.t, {
    p0: [sys_product_cat.status, '=', 2],
    r: 'p0',
    orderBy: [sys_product_cat.rank_num]
  })).data.objects
  ctx.body = list
})




// 超级管理员里的我的文章，是所有文章
// 获取当前用户，发布的文章商品列表
manaProductRouter.post('/busi_list', authUse, authMana, isSuperAdmin, async (ctx, next) => {
  const {user} = ctx
  const {page=1, type=20, limit=20} = ctx.request.body

  let result: any = {
    list: [],
    total: 0,
  }

  if(type === 20 || type === 6){ // 线上的
    result.total = (await mysql.count(article.t, {
      p0: [article.status, '=', type],
      p2: [article.uid, '=', user.id],
      r: user.isSuperAdmin ? 'p0' : 'p0 && p2',
    })).data
    let tempList = (await mysql.find(article.t, {
      j1: [article.product_id, 'inner', product.id],
      p0: [article.status, '=', type],
      p2: [article.uid, '=', user.id],
      r: user.isSuperAdmin ? 'p0' : 'p0 && p2',
      page: parseInt(page),
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
      ]
    })).data.objects
    console.log('temmmmmppplistttt', tempList.length)
    result.list = toImgListUrls(toImgListUrls(tempList, 'article_img_urls'), 'product_img_urls')
  }
  if(type === 10 || type === 5){ //审核未通过，草稿表
    result.total = (await mysql.count(article_draft.t, {
      p0: [article_draft.status, '=', type],
      p2: [article_draft.uid, '=', user.id],
      r: user.isSuperAdmin ? 'p0' : 'p0 && p2',
    })).data
    let tempList = (await mysql.find(article_draft.t, {
      j1: [article_draft.product_draft_id, 'inner', product_draft.id],
      p0: [article_draft.status, '=', type],
      p2: [article_draft.uid, '=', user.id],
      r: user.isSuperAdmin ? 'p0' : 'p0 && p2',
      page: parseInt(page),
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
      ]
    })).data.objects
    result.list = toImgListUrls(toImgListUrls(tempList, 'article_img_urls'), 'product_img_urls')
  }
  ctx.body = result
})



// 编辑文章+商品时，获取编辑信息
manaProductRouter.post('/edit_init', authUse, authMana, async (ctx, next) => {
  const {user} = ctx
  const {taid, atype} = ctx.request.body
  if(!atype) {
    return ctx.body = {status: 0, message: '请求参数错误'}
  }
  let resData: any = {}
  const datetime = getTime('date_time')
  if(atype === 'online'){
    // 更改线上的商品
    let onlineData = (await mysql.find(article.t, {
      j0: [article.product_id, 'inner', product.id],
      p0: [article.id, '=', taid],
      r: 'p0',
      select: [
        article.id + ' as aid',
        article.img_urls + ' as article_img_urls',
        article.html + ' as a_html',
        article.uid + ' as uid',
        product.id + ' as pid',
        product.cost,
        product.f_sale_cost,
        product.img_urls + ' as product_img_urls',
        product.des,
        product.price,
        product.quantity,
        product.sale_cost,
        product.title,
        product.goods_url,
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
        product.cat_id,
        product.can_gift,
        product.can_group,
        product.group_end,
        product.group_price,
        product.group_quantity,
        product.group_cost,
        product.group_sale_cost,
        product.group_f_sale_cost,
      ]
    })).data.objects[0]

    let tempDraft = (await mysql.find(article_draft.t, {
      j0: [article_draft.product_draft_id, 'inner', product_draft.id],
      p0: [article_draft.online_article_id, '=', taid],
      r: 'p0',
      select: [
        article_draft.online_article_id + ' as aid',
        article_draft.id + ' as daid',
        article_draft.article_title + ' as a_title',
        article_draft.article_img_urls,
        article_draft.article_html + ' as a_html',
        article_draft.uid + ' as uid',
        product_draft.id + ' as dpid',
        product_draft.product_des + ' as des',
        product_draft.product_cost + ' as cost',
        product_draft.product_f_sale_cost + ' as f_sale_cost',
        product_draft.product_img_urls,
        product_draft.product_quantity + ' as quantity',
        product_draft.product_sale_cost + ' as sale_cost',
        product_draft.product_title + ' as title',
        product_draft.product_goods_url + ' as goods_url',
        product_draft.product_price + ' as price',
        product_draft.online_product_id + ' as pid',
        product_draft.product_name + ' as name',
        product_draft.product_mobile + ' as mobile',
        product_draft.product_company + ' as company',
        product_draft.product_province + ' as province',
        product_draft.product_city + ' as city',
        product_draft.product_area + ' as area',
        product_draft.product_addr + ' as addr',
        product_draft.product_weight + ' as weight',
        product_draft.product_space_x + ' as space_x',
        product_draft.product_space_y + ' as space_y',
        product_draft.product_space_z + ' as space_z',
        product_draft.product_cat_id + ' as cat_id',
        product_draft.product_can_gift + ' as can_gift',
        product_draft.product_can_group + ' as can_group',
        product_draft.product_group_end + ' as group_end',
        product_draft.product_group_price + ' as group_price',
        product_draft.product_group_quantity + ' as group_quantity',
        product_draft.product_group_cost + ' as group_cost',
        product_draft.product_group_sale_cost + ' as group_sale_cost',
        product_draft.product_group_f_sale_cost + ' as group_f_sale_cost',
      ]
    })).data.objects
    if(tempDraft.length === 0){
      // 没有草稿，，新增一个
      let tempp = (await mysql.set(product_draft.t, {
        online_product_id: onlineData.pid,  // 新增的，就用0，好查寻
        product_title: onlineData.title,
        product_goods_url: onlineData.goods_url,
        product_price: onlineData.price,
        product_cost: onlineData.cost,
        product_sale_cost: onlineData.sale_cost,
        product_f_sale_cost: onlineData.f_sale_cost,
        product_quantity: onlineData.quantity,
        product_img_urls: onlineData.product_img_urls,
        product_des: onlineData.des,
        product_name: onlineData.name,
        product_mobile: onlineData.mobile,
        product_company: onlineData.company,
        product_province: onlineData.province,
        product_city: onlineData.city,
        product_area: onlineData.area,
        product_addr: onlineData.addr,
        product_weight: onlineData.weight,
        product_space_x: onlineData.space_x,
        product_space_y: onlineData.space_y,
        product_space_z: onlineData.space_z,
        product_cat_id: onlineData.cat_id,
        product_can_gift: onlineData.can_gift,
        product_can_group: onlineData.can_group,
        product_group_end: dateTime(onlineData.group_end, 'dateTime'),
        product_group_price: onlineData.group_price,
        product_group_quantity: onlineData.group_quantity,
        product_group_cost: onlineData.group_cost,
        product_group_sale_cost: onlineData.group_sale_cost,
        product_group_f_sale_cost: onlineData.group_f_sale_cost,
        status: 8,
        uid: onlineData.uid,
        created_at: datetime,
        updated_at: datetime
      })).data
      let temp = (await mysql.set(article_draft.t, {
        online_article_id: onlineData.aid,
        product_draft_id: tempp.insertId,
        article_title: onlineData.a_title,
        article_html: onlineData.a_html,
        article_img_urls: onlineData.article_img_urls,
        article_des: '',
        status: 8,
        uid: onlineData.uid,
        created_at: datetime,
        updated_at: datetime
      })).data
      resData = {
        daid: temp.insertId,
        dpid: tempp.insertId,
        ...onlineData,
      }
    }else{
      // 有，直接返回
      resData = {
        ...tempDraft[0]
      }
    }
  }
  if(atype === 'draft'){
    // 更改非线上的内容，草稿、审核、驳回等
    let tempDraft = (await mysql.find(article_draft.t, {
      j0: [article_draft.product_draft_id, 'inner', product_draft.id],
      p0: [article_draft.id, '=', taid],
      r: 'p0',
      select: [
        article_draft.online_article_id + ' as aid',
        article_draft.id + ' as daid',
        article_draft.article_title + ' as a_title',
        article_draft.article_img_urls,
        article_draft.article_html + ' as a_html',
        article_draft.uid + ' as uid',
        product_draft.id + ' as dpid',
        product_draft.product_des + ' as des',
        product_draft.product_cost + ' as cost',
        product_draft.product_f_sale_cost + ' as f_sale_cost',
        product_draft.product_img_urls,
        product_draft.product_quantity + ' as quantity',
        product_draft.product_sale_cost + ' as sale_cost',
        product_draft.product_title + ' as title',
        product_draft.product_goods_url + ' as goods_url',
        product_draft.product_price + ' as price',
        product_draft.product_name + ' as name',
        product_draft.product_mobile + ' as mobile',
        product_draft.product_company + ' as company',
        product_draft.product_province + ' as province',
        product_draft.product_city + ' as city',
        product_draft.product_area + ' as area',
        product_draft.product_addr + ' as addr',
        product_draft.product_weight + ' as weight',
        product_draft.product_space_x + ' as space_x',
        product_draft.product_space_y + ' as space_y',
        product_draft.product_space_z + ' as space_z',
        product_draft.product_cat_id + ' as cat_id',
        product_draft.product_can_gift + ' as can_gift',
        product_draft.product_can_group + ' as can_group',
        product_draft.product_group_end + ' as group_end',
        product_draft.product_group_price + ' as group_price',
        product_draft.product_group_quantity + ' as group_quantity',
        product_draft.product_group_cost + ' as group_cost',
        product_draft.product_group_sale_cost + ' as group_sale_cost',
        product_draft.product_group_f_sale_cost + ' as group_f_sale_cost',
      ]
    })).data.objects
    
    resData = {
      ...tempDraft[0]
    }
  }

  let t1 = {...resData}
  ctx.body = {
    ...resData,
    img_paths: resData.product_img_urls.split(','),
    img_urls: toImgListUrl(t1, 'product_img_urls').product_img_urls,
    a_img_paths: resData.article_img_urls.split(','),
    a_img_urls: toImgListUrl(t1, 'article_img_urls').article_img_urls,
  }
})



// 文章上架，下架
manaProductRouter.put('/change/sale', authUse, authMana, async (ctx, next) => {
  const {user} = ctx
  const {aid} = ctx.request.body
  let data = (await mysql.get(article.t, aid)).data
  let pid = data.product_id
  let change_status = data.status === 6 ? 20 : data.status === 20 ? 6 : 0
  if(!change_status){
    return ctx.body = {status: 0}
  }
  const {begin, commit, run, rollback} = await mysql.transaction()

  await begin(async () => {
    try{
      let sql1 = await mysql.update(article.t, aid, {status: change_status}, 'sentence')
      let sql2 = await mysql.update(product.t, pid, {status: change_status}, 'sentence')
      await run(sql1)
      await run(sql2)
      await commit()
      productCacheOne(aid, true, change_status)
    }catch(err: any){
      await rollback()
      throw new Error(err)
    }
  })
  ctx.body = {
    status: 2,
  }
})



// 商品评论列表
manaProductRouter.post('/comment/list', authUse, authMana, async (ctx, next) => {
  const {user} = ctx
  const {page=1, limit=20, type=2} = ctx.request.body

  let result: any = {
    list: [],
    total: 0,
  }
  result.total = (await mysql.count(comment.t, {
    p0: [comment.status, '=', type],
    r: 'p0'
  })).data
  let list = (await mysql.find(comment.t, {
    j0: [comment.product_id, 'inner', product.id],
    p0: [comment.status, '=', type],
    r: 'p0',
    limit: limit,
    page: page,
    orderBy: ['-' + comment.created_at],
    select: [
      comment.id,
      comment.content,
      comment.created_at,
      comment.img_urls,
      comment.status,
      comment.star,
      comment.avatar_url,
      comment.nickname,
      product.title,
      product.img_urls + ' as product_imgs',
    ]
  })).data.objects

  result.list = toImgListUrls(toImgListUrls(list, 'img_urls'), 'product_imgs')
  ctx.body = result
})


manaProductRouter.put('/comment/check', authUse, authMana, async (ctx, next) => {
  const {user} = ctx
  const {id, type} = ctx.request.body
  await mysql.update(comment.t, id, {
    status: type
  })
  ctx.body = {status: 2, message: '操作成功'}
})


export default manaProductRouter


