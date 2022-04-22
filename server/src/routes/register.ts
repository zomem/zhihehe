import {mysql, redis} from 'access-db'

import {users} from '../constants/table'
import sendEmail from '../utils/sendEmail'
import {randomCode, getTime} from '../utils/utils'

const bcrypt = require('bcryptjs')

const registerRouter = require('koa-router')()

registerRouter.prefix('/register')


// 用户邮箱注册发送验证码
registerRouter.post('/email/code', async function(ctx, next){
  const {email, type=1} = ctx.request.body
  const code = randomCode(6, '0A')

  let isHave = (await mysql.count(users.t, {
    p0: [users.email, '=', email],
    r: 'p0'
  })).data
  if(isHave >= 1 && type === 1){
    return ctx.body = {
      status: 1,
      message: '邮箱 ' + email + ' 已注册'
    }
  }
  
  await redis.del('register', email)
  await sendEmail({
    from: `"access-db 验证码" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'access-db 验证码',
    html: `你的 access-db 验证码为： <h1>${code}</h1> 10分钟内有效`
  })
  await redis.set('register', {
    id: email,
    email_code: code
  }, 60 * 10 * 1000)
  ctx.body = {
    status: 2,
    message: '验证码已发送至 ' + email
  }
})

// 用户邮箱注册
registerRouter.post('/email', async function(ctx, next) {
  const {email, password, code, type=1} = ctx.request.body

  let result: {
    status: number
    message: string
  } = {
    status: 0,
    message: ''
  }
  let nowTime = getTime('date_time')
  let codeData = (await redis.get('register', email)).data
  if(codeData.email_code){
    //有未过期的验证码，则注册
    if(codeData.email_code !== code){
      result = {
        status: 0,
        message: '验证码不正确'
      }
      return ctx.body = result
    }
    let hashPassword = bcrypt.hashSync(password, 10)

    if(type === 1){
      let temp = (await mysql.set(users.t, {
        email: email,
        password: hashPassword,
        created_at: nowTime,
        updated_at: nowTime,
      })).data
      if(temp.insertId){
        result={
          status: 2,
          message: '注册成功'
        }
      }else{
        result={
          status: 0,
          message: '注册失败'
        }
      }
    }else{
      let temp = (await mysql.update(users.t, {email: email}, {
        password: hashPassword,
        updated_at: nowTime,
      })).data
      if(temp){
        result={
          status: 2,
          message: '密码更改成功'
        }
      }else{
        result={
          status: 0,
          message: '密码更改失败'
        }
      }
    }

  }else{
    result = {
      status: 0,
      message: '验证码已过期'
    }
  }
  ctx.body = result
})


export default registerRouter


