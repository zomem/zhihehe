import {mysql} from 'access-db'

import {authUse} from '../../middlewares/auth'
import {users_account, users_account_record, account_recharge} from '../../constants/table'
import {TRADE_STATUS} from '../../constants/constants'
import {getTime, toImgUrls} from '../../utils/utils'


const accountRouter = require('koa-router')()

accountRouter.prefix('/zhihehe/account')


// 查寻用户余额
accountRouter.get('/balance', authUse, async function (ctx, next) {
  const {user} = ctx 
  let info = (await mysql.get(users_account.t, {uid: user.id})).data

  if(!info.id){
    await mysql.set(users_account.t, {
      uid: user.id,
      balance: 0,
    })
    info = (await mysql.get(users_account.t, {uid: user.id})).data
  }
  ctx.body = info
})


// 查寻用户的记录
accountRouter.get('/balance/list/:page', authUse, async function (ctx, next) {
  const {user, params} = ctx
  const {page} = params
  const LIMIT = 15

  let list = (await mysql.find(users_account_record.t, {
    p0: [users_account_record.uid, '=', user.id],
    r: 'p0',
    orderBy: ['-' + users_account_record.created_at],
    limit: LIMIT,
    page: +page,
  })).data.objects
  ctx.body = {
    list: list,
    have: list.length < LIMIT ? false : true
  }
})


// 获取充分金额列表
accountRouter.get('/recharge/list', authUse, async (ctx, next) => {
  const {user} = ctx
  let list = (await mysql.find(account_recharge.t, {
    p0: [account_recharge.status, '=', 2],
    r: 'p0',
    orderBy: [account_recharge.price]
  })).data.objects
  ctx.body = list
})



export default accountRouter


