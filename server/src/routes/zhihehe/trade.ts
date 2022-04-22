import {mysql} from 'access-db'

import {authUse} from '../../middlewares/auth'
import {users, article, product, product_draft, trade, comment} from '../../constants/table'
import {TRADE_STATUS} from '../../constants/constants'
import {getTime, toImgUrls} from '../../utils/utils'

 

const tradeRouter = require('koa-router')()

tradeRouter.prefix('/zhihehe/trade')


// 用户订单列表
tradeRouter.get('/list/:page/:type', authUse, async function (ctx, next) {
  const {user, params} = ctx
  const LIMIT = 8
  const {page='1', type='10'} = params
  let tempList = (await mysql.find(trade.t, {
    p0: [trade.status, '=', 2],
    p2: [trade.uid, '=', user.id],

    p1: [trade.trade_status, '=', type],
    p3: [trade.trade_status, '>=', 1],
    r: type === '0' ? 'p0 && p2 && p3' : 'p0 && p1 && p2',
    page: parseInt(page),
    limit: LIMIT,
    orderBy: ['-' + trade.created_at]
  })).data.objects
  if(tempList.length === 0){
    return ctx.body = {
      list: [],
      have: false
    }
  }
  let list: any = [], pids: number[] = []
  for(let l of tempList){
    pids.push(l.product_id)
    list.push({
      ...l,
      trade_status_name: TRADE_STATUS[l.trade_status]
    })
  }

  // 为20 已完成时，还要检测用户有没有打分
  if(type === '20' || type === '0'){
    let commentList = (await mysql.find(comment.t, {
      p0: [comment.uid, '=', user.id],
      p1: [comment.product_id, 'in', pids],
      r: 'p0 && p1'
    })).data.objects
    for(let i = 0; i < list.length; i++){
      list[i].star = 0
      for(let j = 0; j < commentList.length; j++){
        if(list[i].product_id === commentList[j].product_id){
          list[i].star = commentList[j].star
          break
        }
      }
    }
  }

  ctx.body = {
    list: toImgUrls(list, 'cover_url'),
    have: list.length < LIMIT ? false : true
  }
})


// 用户确认收货
tradeRouter.put('/recived/confirm', authUse, async function (ctx, next) {
  const {user} = ctx
  const {trade_id} = ctx.request.body
  if((await mysql.get(trade.t, trade_id)).data.uid !== user.id){
    return ctx.body = {
      status: 0,
      message: '不能操作其他用户的订单状态'
    }
  }
  await mysql.update(trade.t, trade_id, {trade_status: 20})
  ctx.body = {status: 2, message: '操作成功'}
})

export default tradeRouter


