import {mysql} from 'access-db'

import {authUse} from '../../middlewares/auth'
import {comment} from '../../constants/table'
import {getTime, toImgListUrl, toImgListUrls, toImgUrls} from '../../utils/utils'



const commentRouter = require('koa-router')()

commentRouter.prefix('/zhihehe/comment')



// 添加一条评论
commentRouter.post('/add', authUse, async (ctx, next) => {
  const {user} = ctx
  const {body} = ctx.request
  if((await mysql.count(comment.t, {
    p0: [comment.uid, '=', user.id],
    p1: [comment.product_id, '=', body.pid],
    r: 'p0 && p1'
  })).data > 0){
    return ctx.body = {status: 0}
  }
  await mysql.set(comment.t, {
    uid: user.id,
    nickname: user.nickname,
    avatar_url: user.avatar_url,
    star: body.star,
    product_id: body.pid,
    img_urls: body.paths.toString(),
    content: body.content || '',
    status: 1,
  })
  ctx.body = {status: 2}
})


// 获取某个商品的评论
commentRouter.get('/list/:pid/:page', async (ctx, next) => {
  const {params} = ctx
  const {pid, page='1'} = params
  const LIMIT = 10
  let list = (await mysql.find(comment.t, {
    p1: [comment.product_id, '=', +pid],
    p2: [comment.status, '=', 2],
    r: 'p1 && p2',
    page: +page,
    limit: LIMIT,
    orderBy: ['-' + comment.created_at]
  })).data.objects
  ctx.body = {
    list: toImgListUrls(list, 'img_urls'),
    have: list.length < LIMIT ? false : true
  }
})
// 获取某个商品的，某个用户在审核中的评论
commentRouter.get('/user_com/:pid', authUse, async (ctx, next) => {
  const {user, params} = ctx
  let userCom = (await mysql.find(comment.t, {
    p1: [comment.product_id, '=', +params.pid],
    p0: [comment.uid, '=', user.id],
    p2: [comment.status, '=', 1],
    r: 'p1 && p2 && p0',
  })).data.objects[0] || {}
  if(!userCom.id){
    return ctx.body = {}
  }
  ctx.body = toImgListUrl(userCom, 'img_urls')
})


export default commentRouter


