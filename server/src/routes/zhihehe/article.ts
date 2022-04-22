import {mysql, redis} from 'access-db'

import {authRole, authUse} from '../../middlewares/auth'
import {users, article, product, article_draft, product_draft, sys_product_cat, redis_product, trade, comment} from '../../constants/table'
import {toImgListUrls, toImgListUrl, getTime, dateTime, isRole} from '../../utils/utils'
import {productCacheOne} from '../../utils/cache'



const articleRouter = require('koa-router')()

articleRouter.prefix('/zhihehe/article')


/* 获取文章列表 */
articleRouter.get('/list/:page/:catId', async function(ctx, next) {
  const {page='1', catId} = ctx.params
  const LIMIT = 15
  let temp: any = []
  let result: any = {
    have: true,
    list: []
  }


  temp = (await redis.find(redis_product, {
    p0: ['status', '=', 20],
    p1: ['cat_id', '=', catId],
    r: +catId ? 'p0 && p1' : 'p0',
    limit: LIMIT,
    page: parseInt(page),
  })).data.objects

  temp = temp.map((item) => ({
    ...item,
    cat_title: item.cat_title === "null" ? null : item.cat_title,
    can_gift: +item.can_gift,
    can_group: +item.can_group,
    status: +item.status,
    uid: +item.uid,
    
    price: +item.price,
    quantity: +item.quantity,
    sale_cost: null,
    f_sale_cost: null,

    group_price: +item.group_price,
    group_quantity: +item.group_quantity,
    group_sale_cost: null,
    group_f_sale_cost: null,
    group_end: item.group_end === 'null' ? null : item.group_end,
  }))

  if(temp.length === 0){
    temp = (await mysql.find(article.t, {
      j0: [article.uid, 'inner', users.id],
      j1: [article.product_id, 'inner', product.id],
      j2: [product.cat_id, 'left', sys_product_cat.id],
      p0: [article.status, '=', 20],
      p1: [product.cat_id, '=', catId],
      r: +catId ? 'p0 && p1' : 'p0',
      limit: LIMIT,
      page: parseInt(page),
      orderBy: ['-' + article.created_at],
      select: [
        article.id,
        users.id + ' as uid',
        users.nickname,
        users.avatar_url,
        article.created_at,
        article.img_urls,
        product.des + ' as des',
        product.title + ' as product_title',

        product.can_gift,
        product.can_group,
        product.price,
        product.quantity,

        product.group_price,
        product.group_quantity,
        product.group_end,
        sys_product_cat.title + ' as cat_title'
      ]
    })).data.objects
  }
  // 查寻已

  if(temp.length < LIMIT) result.have = false


  result.list = toImgListUrls(temp, 'img_urls', {set_default: 'IMG_ERR'})
  ctx.body = result
})

/* 销售、总销售，获取文章列表 */
articleRouter.get('/list/saler/:page/:catId', authUse, async function(ctx, next) {
  const {user, params} = ctx
  const {page='1', catId} = params

  let temp: any = []

  const LIMIT = 15

  let result: any = {
    have: true,
    list: []
  }


  temp = (await redis.find(redis_product, {
    p0: ['status', '=', 20],
    p1: ['cat_id', '=', catId],
    r: +catId ? 'p0 && p1' : 'p0',
    limit: LIMIT,
    page: parseInt(page),
  })).data.objects

  let isLeader = isRole('salesleader', user.role)
  let isSaler = isRole('salespeople', user.role)
  temp = temp.map((item) => ({
    ...item,
    cat_title: item.cat_title === "null" ? null : item.cat_title,
    can_gift: +item.can_gift,
    can_group: +item.can_group,
    status: +item.status,
    uid: +item.uid,

    price: +item.price,
    quantity: +item.quantity,
    sale_cost: (isLeader || isSaler) ? +item.sale_cost : null,
    f_sale_cost: isLeader ? +item.f_sale_cost : null,

    group_price: +item.group_price,
    group_quantity: +item.group_quantity,
    group_sale_cost: (isLeader || isSaler) ? +item.group_sale_cost : null,
    group_f_sale_cost: isLeader ? +item.group_f_sale_cost : null,
    group_end: item.group_end === 'null' ? null : item.group_end,
  }))



  if(temp.length === 0){
    let selectData: any[] = [
      article.id,
      users.id + ' as uid',
      users.nickname,
      users.avatar_url,
      article.created_at,
      article.img_urls,
      product.des + ' as des',
      product.title + ' as product_title',
      product.can_gift,
      product.can_group,
      product.price,
      product.quantity,

      product.group_price,
      product.group_quantity,
      product.group_end,
      sys_product_cat.title + ' as cat_title'
    ]
    
    if(isRole('salesleader', user.role)){
      selectData.push(product.sale_cost)
      selectData.push(product.f_sale_cost)
    }else if(isRole('salespeople', user.role)){
      selectData.push(product.sale_cost)
    }
    temp = (await mysql.find(article.t, {
      j0: [article.uid, 'inner', users.id],
      j1: [article.product_id, 'inner', product.id],
      j2: [product.cat_id, 'left', sys_product_cat.id],
      p0: [article.status, '=', 20],
      p1: [product.cat_id, '=', catId],
      r: +catId ? 'p0 && p1' : 'p0',
      limit: LIMIT,
      page: parseInt(page),
      orderBy: ['-' + article.created_at],
      select: selectData
    })).data.objects
  }

  if(temp.length < LIMIT) result.have = false

  result.list = toImgListUrls(temp, 'img_urls', {set_default: 'IMG_ERR'})
  ctx.body = result
})


// 获取文章详情，包括商品详情
articleRouter.get('/detail/:id', async function(ctx, next) {
  const {id} = ctx.params
  let temp = (await mysql.find(article.t, {
    j0: [article.uid, 'inner', users.id],
    j1: [article.product_id, 'inner', product.id],
    p0: [article.id, '=', id],
    r: 'p0',
    limit: 1,
    select: [
      article.id,
      users.id + ' as uid',
      users.nickname,
      users.avatar_url,
      article.created_at,
      article.updated_at,
      article.img_urls,
      article.product_id,
      article.html,
      article.status,
      product.title,
      product.price,
      product.des,
      product.quantity,
      product.status + ' as product_status',
      product.img_urls + ' as product_imgs',
      product.can_gift,
      product.can_group,
      product.group_price,
      product.group_quantity,
      product.group_end,
    ]
  })).data.objects[0]

  let tempGAvatar: any = [], tempGCount: any = []
  if(temp.can_group === 1){
    let tempGCount = (await mysql.count(trade.t, {
      p0: [trade.status, '=', 2],
      p1: [trade.trade_status, '>=', 5],
      p2: [trade.is_group, '=', 1],
      p3: [trade.product_id, '=', temp.product_id],
      r: 'p0 && p1 && p2 && p3'
    })).data
    let tempGAvatar = (await mysql.find(trade.t, {
      j0: [trade.uid, 'inner', users.id],
      p0: [trade.status, '=', 2],
      p1: [trade.trade_status, '>=', 5],
      p2: [trade.is_group, '=', 1],
      p3: [trade.product_id, '=', temp.product_id],
      r: 'p0 && p1 && p2 && p3',
      page: 1,
      limit: 10,
      select: [users.avatar_url, trade.created_at],
      orderBy: ['-' + trade.created_at]
    })).data.objects.map((item) => item.avatar_url)
    temp.group_count = tempGCount
    temp.group_avatar = tempGAvatar
  }

  // 获取商品的平均得分
  let starList = (await mysql.find(comment.t, {
    p1: [comment.product_id, '=', temp.product_id],
    p2: [comment.status, '=', 2],
    r: 'p1 && p2'
  })).data.objects
  let allscore: number = 0
  for(let j = 0; j < starList.length; j++){
    allscore += starList[j].star * 2
  }
  temp.score = allscore / starList.length
  temp.score_people = starList.length
  ctx.body = toImgListUrl(toImgListUrl(temp, 'product_imgs'), 'img_urls')
})

// 如果是登录用户，再获取分成
articleRouter.get('/detail/cost/:id', authUse, async function(ctx, next) {
  const {user, params} = ctx
  const {id} = params
  let selectData: any[] = [product.id]
  if(isRole('salesleader', user.role)){
    selectData.push(product.sale_cost)
    selectData.push(product.f_sale_cost)
    selectData.push(product.group_sale_cost)
    selectData.push(product.group_f_sale_cost)
  }else if(isRole('salespeople', user.role)){
    selectData.push(product.sale_cost)
    selectData.push(product.group_sale_cost)
  }
  let temp = (await mysql.find(article.t, {
    j1: [article.product_id, 'inner', product.id],
    p0: [article.id, '=', id],
    r: 'p0',
    limit: 1,
    select: selectData
  })).data.objects[0]
  ctx.body = temp
})


// 文章上架，下架
articleRouter.put('/change/sale', authUse, authRole, async (ctx, next) => {
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

// 新增文章
articleRouter.post('/add', authUse, authRole, async function(ctx, next){
  const {user} = ctx

  const {html, img_paths, product_draft_id, daid} = ctx.request.body

  const datetime = getTime('date_time')
  
  let result = {
    status: 0,
    message: ''
  }
  if(daid){
    await mysql.update(article_draft.t, daid, {
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

// 编辑文章+商品时，获取编辑信息
articleRouter.post('/edit_init', authUse, authRole, async (ctx, next) => {
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




// 查寻当前有没有草稿文章
articleRouter.get('/draft_init', authUse, async function(ctx, next) {
  const {user} = ctx
  let temp = (await mysql.find(article_draft.t, {
    p1: [article_draft.status, '=', 8],
    p2: [article_draft.uid, '=', user.id],
    r: 'p1 && p2'
  })).data.objects
  let result: any = {}
  if(temp.length > 0){
    result = {
      article_img_paths: temp[0].article_img_urls ? temp[0].article_img_urls.split(',') : [],
      ...toImgListUrl(temp[0], 'article_img_urls')
    }
  }
  ctx.body = result
})


// 获取当前用户，发布的文章商品列表
articleRouter.get('/busi_list/:page/:type', authUse, authRole, async (ctx, next) => {
  const {user, params} = ctx
  const LIMIT = 15
  const {page='1', type='20'} = params
  
  let resutl: any = {
    list: [],
    have: false,
  }

  if(type === '20' || type === '6'){ // 线上的
    let tempList = (await mysql.find(article.t, {
      j1: [article.product_id, 'inner', product.id],
      p0: [article.status, '=', type],
      p2: [article.uid, '=', user.id],
      r: 'p0 && p2',
      page: parseInt(page),
      limit: LIMIT,
      orderBy: ['-' + article.created_at],
      select: [
        article.id,
        article.created_at,
        article.img_urls,
        article.des,
        product.price,
        product.des,
        product.title + ' as product_title'
      ]
    })).data.objects
    resutl.list = toImgListUrls(tempList, 'img_urls')
    resutl.have = tempList.length < LIMIT ? false : true
  }
  if(type === '10' || type === '5'){ //审核未通过，草稿表
    let tempList = (await mysql.find(article_draft.t, {
      j1: [article_draft.product_draft_id, 'inner', product_draft.id],
      p0: [article_draft.status, '=', type],
      p2: [article_draft.uid, '=', user.id],
      r: 'p0 && p2',
      page: parseInt(page),
      limit: LIMIT,
      orderBy: ['-' + article_draft.created_at],
      select: [
        article_draft.id,
        article_draft.created_at + ' as created_at',
        article_draft.article_img_urls + ' as img_urls',
        article_draft.reason,
        product_draft.product_des + ' as des',
        product_draft.product_price + ' as price',
        product_draft.product_title + ' as product_title'
      ]
    })).data.objects
    resutl.list = toImgListUrls(tempList, 'img_urls')
    resutl.have = tempList.length < LIMIT ? false : true
  }

  ctx.body = resutl
})


export default articleRouter


