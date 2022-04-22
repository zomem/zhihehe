import {mysql} from 'access-db'

import {authUse, authRole} from '../../middlewares/auth'
import {users, article, product, product_draft, sys_constants, sys_product_cat} from '../../constants/table'
import {toImgListUrls, toImgListUrl, getTime, salePrice} from '../../utils/utils'
 


const productRouter = require('koa-router')()

productRouter.prefix('/zhihehe/product')



const DEFAULT_PERCENT = 1.2
// 获取售价百分比
productRouter.get('/price/percent', authUse, authRole, async (ctx, next) => {
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
productRouter.post('/add', authUse, authRole, async function (ctx, next) {
  const {user} = ctx
  const {body} = ctx.request
  const {
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
    await mysql.update(product_draft.t, dpid, {
      product_title: title,
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
    })
    tempId = dpid
  }else{
    tempId = (await mysql.set(product_draft.t, {
      product_title: title,
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
    message: '商品新增成功',
    id: tempId
  }
})

// 获取商品详情
productRouter.get('/detail/:id', async (ctx, next) => {
  const {id} = ctx.params
  let info = (await mysql.get(product.t, id)).data
  delete info.cost
  delete info.sale_cost
  delete info.f_sale_cost
  delete info.group_cost
  delete info.group_sale_cost
  delete info.group_f_sale_cost
  ctx.body = toImgListUrl(info, 'img_urls')
})


// 获取商品的分类列表
productRouter.get('/product_cat/list', async (ctx, next) => {
  let list = (await mysql.find(sys_product_cat.t, {
    p0: [sys_product_cat.status, '=', 2],
    r: 'p0',
    orderBy: [sys_product_cat.rank_num]
  })).data.objects
  ctx.body = list
})

export default productRouter


