import {mysql} from 'access-db'

import {article, sale_rela, sale_user_rela, share_money, users} from '../../constants/table'
import { authRole, authUse } from '../../middlewares/auth'
import { getTime, isRole } from '../../utils/utils'
import { SALES_PEOPLE } from '../../constants/constants'


const saleRouter = require('koa-router')()

saleRouter.prefix('/zhihehe/sale')


// 总销售，获取销售员
saleRouter.get('/leader/saler_list', authUse, authRole, async function(ctx, next) {
  const {user} = ctx
  
  const list = (await mysql.find(sale_rela.t, {
    j0: [sale_rela.sale_uid, 'inner', users.id],
    p0: [sale_rela.f_sale_uid, '=', user.id],
    p1: [sale_rela.status, '>', 0],
    r: 'p0 && p1',
    orderBy: [sale_rela.status],
    select: [
      users.avatar_url,
      users.nickname,
      users.id + ' as uid',
      sale_rela.id,
      sale_rela.created_at,
      sale_rela.status
    ]
  })).data.objects

  ctx.body = list
})



// 普通用户，加入销售团队
saleRouter.post('/join', authUse, async function(ctx, next) {
  const {user} = ctx
  const {f_sale_uid} = ctx.request.body

  const fsaleuser = (await mysql.get(users.t, f_sale_uid)).data

  if(!isRole('salesleader', fsaleuser.role)){
    return ctx.body = {
      status: 0,
      message: '加入失败，未找到该总销售'
    }
  }
  if(isRole('salespeople', user.role)){
    return ctx.body = {
      status: 0,
      message: '加入失败，你当前已是销售'
    }
  }
  if(isRole('salesleader', user.role)){
    return ctx.body = {
      status: 0,
      message: '加入失败，你当前已是总销售'
    }
  }

  let userSaleRela = (await mysql.count(sale_rela.t, {
    p1: [sale_rela.sale_uid, '=', user.id],
    p2: [sale_rela.status, '=', 1],
    r: 'p1 && p2'
  })).data
  if(userSaleRela > 0){
    return ctx.body = {
      status: 0,
      message: '你的申请正在审核中，请耐心等待'
    }
  }

  await mysql.set(sale_rela.t, {
    f_sale_uid: f_sale_uid,
    sale_uid: user.id,
    status: 1,
    created_at: getTime('date_time'),
  })

  ctx.body = {
    status: 2,
    message: '申请成功，请耐心等待审核',
  }
})

// 总销售，进行销售员的审核
saleRouter.post('/join/check', authUse, authRole, async (ctx, next) => {
  const {user} = ctx
  const {type, uid} = ctx.request.body
  // type 0为删除，2为通过
  const normalUser = (await mysql.get(users.t, uid)).data
  if(!isRole('salesleader', user.role)){
    return ctx.body = {
      status: 0,
      message: '操作失败，你没有操作权限'
    }
  }else{
    if(user.id === uid){
      return ctx.body = {
        status: 0,
        message: '操作失败，不能更改自己的销售状态'
      }
    }
  }


  let newRole = ''
  const {begin, rollback, run, commit} = await mysql.transaction()
  await begin(async () => {
    try{
      const sql1 = await mysql.update(sale_rela.t, {sale_uid: uid},{
        status: 2,
      }, 'sentence')

      const sql3 = await mysql.del(sale_rela.t, {sale_uid: uid}, 'sentence')
      
      if(type === 2){
        newRole = normalUser.role ? normalUser.role + ',' + SALES_PEOPLE : SALES_PEOPLE
        await run(sql1)
      }else{
        let arr = normalUser.role ? normalUser.role.split(',') : []
        arr.splice(arr.indexOf(SALES_PEOPLE), 1)
        newRole = arr.toString()
        await run(sql3)
      }

      // //更新销售员的用户绑定，自己
      // // 查寻当前用户自己是不是自己的用户，即销售》用户
      const sql6 = await mysql.find(sale_user_rela.t, {
        p0: [sale_user_rela.uid, '=', uid],
        r: 'p0'
      }, 'sentence')
      let temp6 = (await run(sql6)).data.objects

      const sql66 = await mysql.set(sale_user_rela.t, {
        sale_uid: uid,
        uid: uid,
        created_at: getTime('date_time')
      }, 'sentence')
      

      const sql7 = await mysql.find(sale_user_rela.t, {
        p0: [sale_user_rela.sale_uid, '=', uid],
        r: 'p0'
      }, 'sentence')

      if(temp6.length === 0){
        // 没有，则要加
        await run(sql66)
      }else{
        // 有则更新为当前用户的
        const sql666 = await mysql.update(sale_user_rela.t, temp6[0].id, {
          sale_uid: uid,
          uid: uid,
          created_at: getTime('date_time')
        }, 'sentence')
        await run(sql666)
      }

      const sql2 = await mysql.update(users.t, normalUser.id as number, {
        role: newRole
      }, 'sentence')
      await run(sql2)
      await commit()
    }catch(err: any){
      await rollback()
      throw new Error(err)
    }
  })

  ctx.body = {
    status: 2,
    message: '操作成功',
  }
})


// 用户刷新审核状态
saleRouter.get('/join/status', authUse, async (ctx, next) => {
  const {user} = ctx
  ctx.body = {
    newRole: user.role
  }
})


// 销售员，获取他的用户列表
saleRouter.get('/saler/user_list', authUse, authRole, async function(ctx, next) {
  const {user} = ctx
  
  const list = (await mysql.find(sale_user_rela.t, {
    j0: [sale_user_rela.uid, 'inner', users.id],
    p0: [sale_user_rela.sale_uid, '=', user.id],
    r: 'p0',
    select: [
      users.avatar_url,
      users.nickname,
      sale_user_rela.id,
      sale_user_rela.created_at,
    ]
  })).data.objects

  ctx.body = list
})


// 销售员，和总销售的分成记录。
saleRouter.get('/sale_money/:page', authUse, authRole, async (ctx, next) => {
  const {user, params} = ctx
  const {page='1'} = params
  const LIMIT = 12

  // 已到账的合计
  const havedata = (await mysql.find(share_money.t, {
    j0: [share_money.amount, 'sum'],
    p0: [share_money.account, '=', user.openid],
    p1: [share_money.status, '=', 2],
    p2: [share_money.share_status, '=', 2],
    r: 'p0 && p1 && p2',
    select: [
      share_money.account,
      'j0 as have_amount'
    ],
    groupBy: [share_money.account]
  })).data.objects

  // 总共的分成记录
  const amountdata = (await mysql.find(share_money.t, {
    j0: [share_money.amount, 'sum'],
    p0: [share_money.account, '=', user.openid],
    p1: [share_money.status, '=', 2],
    r: 'p0 && p1',
    select: [
      share_money.account,
      'j0 as all_amount'
    ],
    groupBy: [share_money.account]
  })).data.objects

  const list = (await mysql.find(share_money.t, {
    p0: [share_money.account, '=', user.openid],
    p1: [share_money.status, '=', 2],
    r: 'p0 && p1',
    page: parseInt(page),
    limit: LIMIT,
    orderBy: ['-' + share_money.create_at],
    select: [
      share_money.amount,
      share_money.create_at,
      share_money.description,
      share_money.out_order_no,
      share_money.share_status,
      share_money.id,
      share_money.type,
    ],
  })).data.objects
 
  ctx.body = {
    list: list,
    have_amount: havedata.length > 0 ? havedata[0].have_amount : 0,
    all_amount: amountdata.length > 0 ? amountdata[0].all_amount : 0,
    have: list.length < LIMIT ? false : true
  }
})


// 用户绑定到销售员
// saleRouter.post('/bind_user', authUse, async (ctx, next) => {
//   const {user, body} = req
//   const {fuid} = body
//   console.log('aaaa', fuid)
//   // 检测当前用户，有没有已经绑定销售
//   const bindInfo = (await mysql.find(sale_user_rela.t, {
//     p0: [sale_user_rela.uid, '=', user.id],
//     r: 'p0'
//   })).data.objects
//   if(bindInfo.length > 0){
//     // 有绑定，则不操作
//     return res.json({status: 0})
//   }
//   //没有绑定，则，绑定成当前用户的
//   await mysql.set(sale_user_rela.t, {
//     sale_uid: parseInt(fuid),
//     uid: user.id,
//     created_at: getTime('date_time'),
//   })
//   res.json({status: 2})
// })

export default saleRouter
