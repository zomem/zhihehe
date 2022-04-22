
import {mysql} from 'access-db'
import {sys_role, users} from '../constants/table'
import {SUPER_SYSTEM_UID} from '../constants/constants'
import throwError from '../utils/throwError'


const jwt = require('jsonwebtoken')

// 验证登录
export const authUse = async (ctx, next) => {
  if(!ctx.request.headers.authorization){
    throwError('NOT_LOGIN', '用户未登录', 401)
  }
  const raw = ctx.request.headers.authorization.split(' ').pop()
  if(raw === 'Bearer'){
    throwError('NOT_LOGIN', '用户未登录', 401)
  }
  let id
  try{
    id = (jwt.verify(raw, process.env.JWT_TOKEN_SECRET)).id
  }catch(err: any){
    throwError('JWT_ERROR', err.name + ': ' + err.message, 401)
  }
  const tempUser = (await mysql.get(users.t, id)).data
  if(!tempUser.id){
    throwError('NOT_LOGIN', '用户未登录', 401)
  }
  ctx.user = tempUser
  await next()
}



// // 用户所属的角色，是否有当前接口的调用权限, 必须先调用中间件：authUse     
export const authRole = async (ctx, next) => {
  const {user, originalUrl} = ctx
  if(!user.role) throwError('NO_AUTH_ROLE', '当前用户没有权限执行此操作', 403)
  let tempRole = user.role.split(','), isPass = false
  let tempR = (await mysql.find(sys_role.t, {
    p0: [sys_role.identifier, 'in', tempRole],
    p1: [sys_role.status, '=', 2],
    r: 'p0 && p1'
  })).data.objects
  let user_paths: string[] = []
  if(tempR.length > 0){
    for(let n = 0; n < tempR.length; n++){
      if(tempR[n].api_paths){
        user_paths = user_paths.concat(tempR[n].api_paths.split(','))
      }
    }
    for(let i = 0; i < user_paths.length; i++){
      if(originalUrl.includes(user_paths[i])){
        isPass = true
        break
      }
    }
  }
  if(!isPass) throwError('NO_AUTH_ROLE_PASS', '当前用户没有权限执行此操作', 403)
  await next()
}


// // 当前用户是否有管理后台权限，且调用权限  必须先调用中间件：authUse
export const authMana = async (ctx, next) => {
  const {user} = ctx
  if(!user.authority) throwError('NO_AUTH_MANA', '当前用户没有权限执行此操作', 403)
  await next()
}

// 是否有管理后台，超级管理员权限
export const authSuperMana = async (ctx, next) => {
  const {user} = ctx
  if(!user.authority) throwError('NO_SUPER_AUTH_MANA', '当前用户没有权限执行此操作', 403)
  if(user.id !== SUPER_SYSTEM_UID) throwError('NO_SUPER_AUTH_MANA_PASS', '需要超级管理员权限，才能执行此操作', 403)
  await next()
}


export const isSuperAdmin = async (ctx, next) => {
  const {user} = ctx
  if(user.id === SUPER_SYSTEM_UID){
    ctx.user.isSuperAdmin = true
  }else{
    ctx.user.isSuperAdmin = false
  }
  await next()
}