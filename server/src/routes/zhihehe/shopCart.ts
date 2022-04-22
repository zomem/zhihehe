import {mysql} from 'access-db'

import {product, shop_cart} from '../../constants/table'
import { authUse } from '../../middlewares/auth'
import { toImgListUrl, toImgListUrls } from '../../utils/utils' 
import throwError from '../../utils/throwError'



const shopCartRouter = require('koa-router')()

shopCartRouter.prefix('/zhihehe/shopCart')

// 加入到购物车
shopCartRouter.post('/add', authUse, async function(ctx, next) {
  const {user} = ctx
  const {pid, fuid, aid} = ctx.request.body
  let num = (await mysql.count(shop_cart.t, {
    p0: [shop_cart.uid, '=', user.id],
    p1: [shop_cart.pid, '=', pid],
    p2: [shop_cart.aid, '=', aid],
    r: 'p0 && p1 && p2'
  })).data
  if(num > 0){
    // 已经加入过了
    return ctx.body = {
      status: 0,
      message: '已经添加到购物车了'
    }
  }
  let allnum = (await mysql.count(shop_cart.t, {
    p0: [shop_cart.uid, '=', user.id],
    r: 'p0'
  })).data
  if(allnum >= 50){
    // 购物车上限
    return ctx.body = {
      status: 0,
      message: '购物车已满，请先删除或结算'
    }
  }

  await mysql.set(shop_cart.t, {
    uid: user.id,
    pid: pid,
    fuid: fuid,
    aid: aid,
  })
  
  ctx.body = {
    status: 2,
    message: '添加成功'
  }
})



// 获取购物车列表
shopCartRouter.get('/list/:type', authUse, async (ctx, next) => {
  const {user, params} = ctx
  const {type='0'} = params
  let list = (await mysql.find(shop_cart.t, {
    j0: [shop_cart.pid, 'inner', product.id],
    p0: [shop_cart.uid, '=', user.id],
    p1: [shop_cart.is_select, '=', 1],
    r: type === '1' ? 'p0 && p1' : 'p0',
    select: [
      shop_cart.id,
      shop_cart.count,
      shop_cart.pid,
      shop_cart.aid,
      shop_cart.is_select,
      product.price,
      product.img_urls,
      product.title,
      product.des,
    ]
  })).data.objects

  ctx.body = toImgListUrls(list, 'img_urls')
})


// 用户选择与取消选择
shopCartRouter.put('/change', authUse, async (ctx, next) => {
  const {user} = ctx
  const {pid, count, is_select, aid} = ctx.request.body
  let info = (await mysql.find(shop_cart.t, {
    j0: [shop_cart.pid, 'inner', product.id],
    p0: [shop_cart.pid, '=', pid],
    p1: [shop_cart.uid, '=', user.id],
    p2: [shop_cart.aid, '=', aid],
    r: 'p0 && p1 && p2',
    select: [
      shop_cart.id,
      shop_cart.count,
      shop_cart.pid,
      shop_cart.aid,
      shop_cart.is_select,
      product.price,
      product.img_urls,
      product.title,
      product.des,
    ]
  })).data.objects[0]
  
  if(!info){
    throwError(0, '没在购物车里找到该商品', 400)
  }
  info.is_select = is_select
  info.count = count || 1
  await mysql.update(shop_cart.t, info.id as string, {
    is_select: info.is_select,
    count: info.count
  })
  ctx.body = toImgListUrl(info, 'img_urls')
})

// 全选，取消全选
shopCartRouter.put('/changeall', authUse, async (ctx, next) => {
  const {user} = ctx
  const {pid, is_select_all} = ctx.request.body
  let temp = (await mysql.find(shop_cart.t, {
    j0: [shop_cart.pid, 'inner', product.id],
    p1: [shop_cart.uid, '=', user.id],
    r: 'p1',
    select: [
      shop_cart.uid,
      shop_cart.is_select,
    ]
  })).data.objects

  if(temp.length === 0){
    return ctx.body = [] 
  }

  let tempList = temp.map(item => {
    item.is_select = is_select_all
    return item
  })
  
  await mysql.updatemany(shop_cart.t, 'uid', tempList)

  let list = (await mysql.find(shop_cart.t, {
    j0: [shop_cart.pid, 'inner', product.id],
    p1: [shop_cart.uid, '=', user.id],
    r: 'p1',
    select: [
      shop_cart.id,
      shop_cart.count,
      shop_cart.pid,
      shop_cart.aid,
      shop_cart.is_select,
      product.price,
      product.img_urls,
      product.title,
      product.des,
    ]
  })).data.objects

  ctx.body = toImgListUrls(list, 'img_urls')
})



// 删除
shopCartRouter.put('/del', authUse, async (ctx, next) => {
  const {user} = ctx
  const {} = ctx.request.body

  const userSelects = (await mysql.find(shop_cart.t, {
    p0: [shop_cart.uid, '=', user.id],
    p1: [shop_cart.is_select, '=', 1],
    r: 'p0 && p1',
    select: [shop_cart.id]
  })).data.objects

  await mysql.delmany(shop_cart.t, userSelects)

  ctx.body = {status: 2, message: '删除成功'}

})


export default shopCartRouter
