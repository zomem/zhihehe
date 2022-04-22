import {fastdb, mysql} from 'access-db'
import axios from 'axios'

import {feedback, users} from '../constants/table'
import { getTime } from '../utils/utils'
import {WEAPP} from '../constants/constants'
import {authRole, authUse} from '../middlewares/auth'

const commonRouter = require('koa-router')()

commonRouter.prefix('/common')

// 
commonRouter.post('/feedback', async function(ctx, next) {
  const {body} = ctx.request
  const {content} = body
  const dt = getTime('date_time')
  await mysql.set(feedback.t, {
    content: content,
    created_at: dt,
    updated_at: dt
  })
  ctx.body = {
    status: 2,
    message: '提交成功，感谢你的反馈'
  }
})


// 邀请销售，小程序码
commonRouter.get('/fsale_wxcode', authUse, authRole, async function(ctx, next) {
  const {user} = ctx
  let accessToken = (await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP.APP_ID}&secret=${WEAPP.APP_SECRET}`)).data.access_token
  let imgBuf = (await axios.post(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`, {
    scene: 'f_sale_uid=' + user.id,
    page: 'pages/mine/sale/InviteSale',
    // auto_color: false,
    // line_color: {"r":255,"g":255,"b":255},
    is_hyaline: true
  },{
    responseType: 'arraybuffer'
  })).data
  let imgBase64 = imgBuf.toString('base64')
  ctx.body = {
    imgBase64
  }
})


// 销售的码，目前是直接首页
commonRouter.get('/sale_wxcode', authUse, authRole, async function(ctx, next) {
  const {user} = ctx
  let accessToken = (await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP.APP_ID}&secret=${WEAPP.APP_SECRET}`)).data.access_token
  let imgBuf = (await axios.post(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`, {
    scene: 'fuid=' + user.id,
    page: 'pages/index/Index',
    // auto_color: false,
    // line_color: {"r":255,"g":255,"b":255},
    is_hyaline: true
  },{
    responseType: 'arraybuffer'
  })).data
  let imgBase64 = imgBuf.toString('base64')
  ctx.body = {
    imgBase64
  }
})
// 销售的商品详情码
commonRouter.post('/sale/product_wxcode', authUse, authRole, async function(ctx, next) {
  const {user} = ctx
  const {aid, fuid} = ctx.request.body
  let accessToken = (await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP.APP_ID}&secret=${WEAPP.APP_SECRET}`)).data.access_token
  let imgBuf = (await axios.post(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`, {
    scene: 'aid=' + aid + '&fuid=' + (fuid || user.id),
    page: 'pages/article/ArticleDetail',
    is_hyaline: true
  },{
    responseType: 'arraybuffer'
  })).data
  let imgBase64 = imgBuf.toString('base64')
  ctx.body = {
    imgBase64
  }
})


// 获取直播间列表
commonRouter.get('/live/room_list', async function(ctx, next) {
  let accessToken = (await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP.APP_ID}&secret=${WEAPP.APP_SECRET}`)).data.access_token
  let list = (await axios.post(`https://api.weixin.qq.com/wxa/business/getliveinfo?access_token=${accessToken}`, {
    start: 0,
    limit: 50
  })).data
  ctx.body = list
})





// 刷新用户信息
commonRouter.get('/refresh/user_info', authUse, async (ctx, next) => {
  const {user} = ctx
  let userInfo = (await mysql.get(users.t, user.id)).data
  delete userInfo.password
  ctx.body = userInfo
})

// 获取用户信息
commonRouter.get('/user/:uid', async (ctx, next) => {
  const {uid} = ctx.params
  let userInfo = (await mysql.get(users.t, uid, {select: [users.avatar_url, users.nickname]})).data
  ctx.body = userInfo
})


// 获取省份列表
commonRouter.get('/address/list/:type/:id', async (ctx, next) => {
  const {type='1', id=''} = ctx.params
  let list: any = []
  if(type === '1'){
    list = (fastdb.find('province', {
      limit: 50
    })).data.objects
  }
  if(type === '2'){
    let minid = parseInt(id)
    list = (fastdb.find('city', {
      p0: ['id', '>', minid],
      p1: ['id', '<', minid + 10000000000],
      r: 'p0 && p1',
      limit: 100
    })).data.objects
  }
  if(type === '3'){
    let minid = parseInt(id)
    list = (fastdb.find('area', {
      p0: ['id', '>', minid],
      p1: ['id', '<', minid + 100000000],
      r: 'p0 && p1',
      limit: 100
    })).data.objects
  }

  ctx.body = list
})


export default commonRouter

