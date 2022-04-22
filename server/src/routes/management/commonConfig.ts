import {mysql} from 'access-db'

import {sys_banner, users, account_recharge} from '../../constants/table'
import {authUse, authMana} from '../../middlewares/auth'
import throwError from '../../utils/throwError'
import {randomCode} from '../../utils/utils'


const commonConfigRouter = require('koa-router')()

commonConfigRouter.prefix('/management/commonConfig')

// 新增banner
commonConfigRouter.post('/banner/add', authUse, authMana, async function(ctx, next) {
  const {user} = ctx
  
  const {img_urls, path_urls, name, page, color} = ctx.request.body

  const temp = (await mysql.set(sys_banner.t, {
    img_urls,
    path_urls,
    name,
    page,
    color,
  })).data
  ctx.body = {
    status: 2,
    message: '新增成功',
    id: temp.insertId,
  }
})


// 用户没有opid，生成一个
commonConfigRouter.get('/add/openid', authUse, authMana, async (ctx, next) => {
  const {user} = ctx
  if(!user.openid){
    if(user.email){
      await mysql.update(users.t, user.id, {openid: randomCode(25, '0aA') + '-email'})
    }
  }
  ctx.body = {}
})







// 充值价格
// 获取充分金额列表
commonConfigRouter.get('/recharge/list', authUse, authMana, async (ctx, next) => {
  const {user} = ctx
  let list = (await mysql.find(account_recharge.t, {
    p0: [account_recharge.status, '=', 2],
    r: 'p0',
    orderBy: ['-' + account_recharge.price]
  })).data.objects
  ctx.body = list
})
// 新增
commonConfigRouter.post('/recharge/add', authUse, authMana, async (ctx, next) => {
  const {body} = ctx.request
  const {price, pay_price} = body
  if(pay_price > price){
    return ctx.body = {
      status: 1,
      message: '实付金额不能大于充值金额！'
    }
  }
  if(price * 0.7 > pay_price){
    return ctx.body = {
      status: 1,
      message: '最多只支持7折！'
    }
  }

  await mysql.set(account_recharge.t, {
    price: price,
    pay_price: pay_price,
    status: 2,
  })
  ctx.body = {
    status: 2,
    message: '新增成功'
  }
})

// 删除
commonConfigRouter.put('/recharge/del', authUse, authMana, async (ctx, next) => {
  const {user} = ctx
  const {id} = ctx.request.body
  await mysql.update(account_recharge.t, id, {
    status: 0
  })
  ctx.body = {
    status: 2,
    message: '删除成功'
  }
})



export default commonConfigRouter


