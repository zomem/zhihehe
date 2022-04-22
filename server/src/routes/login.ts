

import {mysql} from 'access-db'

import axios from 'axios'

import {users} from '../constants/table'
import {WEAPP} from '../constants/constants'
import {getTime} from '../utils/utils'
import {genToken, silentJwt} from '../utils/jwt'


const bcrypt = require('bcryptjs')
const loginRouter = require('koa-router')()
const WXBizDataCrypt = require('../utils/WXBizDataCrypt')


loginRouter.prefix('/login')

// 仅获取sessionkey
loginRouter.post('/wechat_session_key', async function(ctx, next) {
  let {code} = ctx.request.body
  let sessionRes = await axios({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    params: {
      appid: WEAPP.APP_ID,
      secret: WEAPP.APP_SECRET,
      js_code: code,
      grant_type: 'authorization_code',
    }
  })
  ctx.body = {
    session_key: sessionRes.data.session_key,
    openid: sessionRes.data.openid
  }
})


// 小程序静默登录
loginRouter.get('/silent/:code/:token', async function(ctx, next) {
  let {code, token} = ctx.params
  let sessionRes = await axios({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    params: {
      appid: WEAPP.APP_ID,
      secret: WEAPP.APP_SECRET,
      js_code: code,
      grant_type: 'authorization_code',
    }
  })
  let result:any = {
    id: '',
    nickname: '',
    avatar_url: '',
    gender: '',
    phone: '',
    openid: '',
    session_key: '',
    token: ''
  }
  let tempUser = (await mysql.get(users.t, {
    openid: sessionRes.data.openid
  })).data
  let uid = silentJwt(token)
  if(tempUser.id && uid){
    result = {
      ...tempUser,
      token: genToken(tempUser.id)   //重新获取新token，不需要的话，可以就用原来的
    }
  }
  ctx.body = result
})



// 小程序授权登录
loginRouter.post('/wechat', async function(ctx, next) {
  let {code, userInfo} = ctx.request.body
  if(!userInfo){ 
    userInfo = {
      nickName: null,
      gender: 0,
      language: null,
      city: null,
      province: null,
      country: null,
      avatarUrl: null,
    }
  }
  let sessionRes = await axios({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    params: {
      appid: WEAPP.APP_ID,
      secret: WEAPP.APP_SECRET,
      js_code: code,
      grant_type: 'authorization_code',
    }
  })
  // 如果小程序绑定了微信开放平台，则也会返回unionid
  let userRes = await mysql.find(users.t, {
    p0: ['openid', '=', sessionRes.data.openid],
    r: 'p0'
  })
  let nowTime = getTime('date_time')
  let resUser: any = {}
  if(userRes.data.objects.length === 0){
    //没有，新增用户
    let setRes = await mysql.set(users.t, {
      nickname: userInfo.nickName,
      gender: userInfo.gender,
      language: userInfo.language,
      city: userInfo.city,
      province: userInfo.province,
      country: userInfo.country,
      avatar_url: userInfo.avatarUrl,
      openid: sessionRes.data.openid,
      created_at: nowTime,
      updated_at: nowTime,
    })
    if(setRes.data.insertId){
      let getRes = await mysql.get(users.t, setRes.data.insertId)
      resUser = {
        ...getRes.data,
        session_key: sessionRes.data.session_key,
        token: genToken(setRes.data.insertId)
      }
    }
  }else{
    //有用户，更新基本信息
    if(userInfo.avatarUrl){
      let updateRes = await mysql.update(users.t, userRes.data.objects[0].id, {
        nickname: userInfo.nickName,
        gender: userInfo.gender,
        language: userInfo.language,
        city: userInfo.city,
        province: userInfo.province,
        country: userInfo.country,
        avatar_url: userInfo.avatarUrl,
        updated_at: nowTime,
      })
    }
    let getRes = await mysql.get(users.t, userRes.data.objects[0].id)
    resUser = {
      ...getRes.data,
      session_key: sessionRes.data.session_key,
      token: genToken(userRes.data.objects[0].id)
    }
  }
  delete resUser.password
  ctx.body = resUser
})


// 小程序获取手机号
loginRouter.post('/wechat_phone', async function(ctx, next) {
  let {openid, sessionKey, iv, encryptedData} = ctx.request.body
  var pc = new WXBizDataCrypt(WEAPP.APP_ID, sessionKey)
  var data = pc.decryptData(encryptedData , iv)

  let userList: any = (await mysql.find(users.t, {
    p0: ['openid', '=', openid],
    r: 'p0'
  })).data.objects
  let nowTime = getTime('date_time')
  let resUser: any = {}
  if(userList.length === 0){
    //没有，新增用户
    let id = (await mysql.set(users.t, {
      phone: data.phoneNumber,
      created_at: nowTime,
      updated_at: nowTime,
      openid: openid,
    })).data.insertId
    if(id){
      resUser = (await mysql.get(users.t, id)).data
    }
  }else{
    //有用户，更新基本信息
    if(userList[0].phone != data.phoneNumber){
      await mysql.update(users.t, userList[0].id, {
        phone: data.phoneNumber,
        updated_at: nowTime,
      })
    }
    resUser = (await mysql.get(users.t, userList[0].id)).data
  }
  delete resUser.password
  ctx.body = resUser
})



// web 静默登录
loginRouter.get('/web_silent/:token', async function (ctx, next) {
  //不刷新token
  let {token} = ctx.params
  let uid = silentJwt(token)
  if(!uid){
    return ctx.body = {}
  }
  let tempUser = (await mysql.get(users.t, uid)).data
  delete tempUser.password
  ctx.body = {
    ...tempUser,
    token: token,
  }
})


// 邮箱登录
loginRouter.post('/email', async function (ctx, next) {
  const {email, password} = ctx.request.body
  let result: {
    status: number
    userInfo: any,
    message: string
  } = {
    status: 0,
    userInfo: {},
    message: ''
  }
  let tempUser = (await mysql.get(users.t, {'email': email})).data
  if(!tempUser.password){
    result = {
      status: 0,
      userInfo: {},
      message: '用户不存在'
    }
  }else{
    if(bcrypt.compareSync(password, tempUser.password)){
      //密码正常，登录成功
      delete tempUser.password
      result = {
        status: 2,
        userInfo: {
          ...tempUser,
          token: genToken(tempUser.id)
        },
        message: '登录成功'
      }
    }else{
      result = {
        status: 0,
        userInfo: {},
        message: '密码错误'
      }
    }
  }
  ctx.body = result
})

export default loginRouter