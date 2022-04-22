import {mysql} from 'access-db'
import throwError from "../utils/throwError"
import { fastdb } from "access-db"
import {trade, product, users} from '../constants/table'


const indexRouter = require('koa-router')()


indexRouter.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

indexRouter.get('/error', async (ctx, next) => {

  fastdb.set('test', {'name': 'wzj'})

  throwError('ERR', '错误测试', 503)

})

indexRouter.get('/test', async (ctx, next) => {
  let sql = await mysql.find(trade.t, {
    j0: [trade.business_uid, 'inner', users.id],
    j1: [trade.uid, 'inner', users.id],
    j2: [trade.product_id, 'inner', product.id],
    p0: [trade.status, '=', 2],
    r: 'p0',
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
  }, 'sentence')


  ctx.body = sql
})

indexRouter.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})


export default indexRouter