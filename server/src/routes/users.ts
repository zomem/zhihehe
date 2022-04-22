import {mysql} from 'access-db'

import {authUse} from '../middlewares/auth'
import {users} from '../constants/table'
import throwError from '../utils/throwError'


const usersRouter = require('koa-router')()

usersRouter.prefix('/users')

/* for test */
usersRouter.get('/uid/:id', authUse, async function(ctx, next) {
  const {id} = ctx.params
  let userData = (await mysql.get(users.t, id)).data
  if(!userData.id){
    return ctx.body = {
      code: 0,
      message: '没有找到相关用户',
    }
  }
  ctx.body = userData
})


export default usersRouter
