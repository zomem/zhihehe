import {mysql} from 'access-db'

import {sys_paths, users, sys_role, sale_rela, sale_user_rela, sys_product_cat, product, product_draft, sys_constants} from '../../constants/table'
import {authUse, authSuperMana, authMana} from '../../middlewares/auth'
import throwError from '../../utils/throwError'
import { SALES_LEADER, SALES_PEOPLE } from '../../constants/constants'
import { getTime } from '../../utils/utils'

const systemRouter = require('koa-router')()

systemRouter.prefix('/management/system')

// 获取所有模块
systemRouter.get('/paths/all', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx

  let tempList = (await mysql.find(sys_paths.t, {orderBy: [sys_paths.sort_num]})).data.objects

  let tempData: any = []

  // 生成父数据
  for(let i = 0; i < tempList.length; i++){
    if(tempList[i].type === 1){
      tempData.push({
        title: tempList[i].name,
        key: tempList[i].path,
        children: []
      })
    }
  }
  // 找出对应子数据
  for(let m = 0; m < tempData.length; m++){
    for(let n = 0; n < tempList.length; n++){
      if(tempData[m].key === tempList[n].path && tempList[n].type === 2){
        tempData[m].children.push({
          title: tempList[n].sub_name,
          key: tempList[n].sub_path,
        })
      }
    }
  }
  ctx.body = tempData
})


/* 获取父模块 */
systemRouter.get('/paths/list', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx

  let tempList = (await mysql.find(sys_paths.t, {
    p0: [sys_paths.type, '=', 1],
    r: 'p0',
    orderBy: [sys_paths.sort_num]
  })).data.objects
  ctx.body = tempList
})

//子模块儿
systemRouter.get('/sub_paths/list/:path', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx
  const {path} = ctx.params

  let tempList = (await mysql.find(sys_paths.t, {
    p0: [sys_paths.path, '=', path],
    p1: [sys_paths.type, '=', 2],
    r: 'p0 && p1',
    orderBy: [sys_paths.sort_num]
  })).data.objects
  ctx.body = tempList
})



systemRouter.post('/paths/add', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx
  const {path, name, sub_name, sub_path, icon='SettingOutlined', sort_num=50} = ctx.request.body

  let fpath = (await mysql.find(sys_paths.t, {
    p0: [sys_paths.type, '=', 1],
    p1: [sys_paths.uni_key, '=', path + '_' + 1],
    r: 'p0 && p1'
  })).data.objects
  let spath = (await mysql.find(sys_paths.t, {
    p0: [sys_paths.type, '=', 2],
    p1: [sys_paths.uni_key, '=', sub_path + '_' + 2],
    r: 'p0 && p1'
  })).data.objects
  if(fpath.length > 0){
    // 更新名称
    await mysql.update(sys_paths.t, fpath[0].id, {name: name, icon_name: icon})
  }else{
    await mysql.set(sys_paths.t, {
      name: name, 
      path: path, 
      icon_name: icon,
      uni_key: path + '_' + 1,
      type: 1,
      sort_num: sort_num
    })
  }
  if(spath.length > 0){
    //更新名字
    await mysql.update(sys_paths.t, spath[0].id, {sub_name: sub_name})
  }else{
    await mysql.set(sys_paths.t, {
      sub_name: sub_name, 
      sub_path: sub_path, 
      path: path,
      uni_key: sub_path + '_' + 2,
      type: 2,
      sort_num: sort_num+1
    })
  }
  ctx.body = {
    status: 2,
    message: '操作成功'
  }
})


//删除
systemRouter.post('/paths/delete', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx
  const {id} = ctx.request.body

  let result = {
    status: 0,
    message: '失败'
  }

  let temp = (await mysql.get(sys_paths.t, id)).data
  if(temp.type === 2){
    await mysql.del(sys_paths.t, id)
    result = {
      status: 2,
      message: '删除成功'
    }
  }else{
    let count = (await mysql.count(sys_paths.t, {
      p0: [sys_paths.path, '=', temp.path],
      p1: [sys_paths.type, '=', 2],
      r: 'p0 && p1'
    })).data
    if(count > 0){
      result = {
        status: 0,
        message: '删除失败，请先删除子模块'
      }
    }else{
      await mysql.del(sys_paths.t, id)
      result = {
        status: 2,
        message: '删除成功'
      }
    }
  }
  ctx.body = result
})



// 更改用户权限
systemRouter.put('/update/user/authority', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx
  const {uid, authority} = ctx.request.body
  
  await mysql.update(users.t, uid, {
    authority: authority
  })
  ctx.body = {status: 2, message: '更新成功'}
})



// 新增用户角色
systemRouter.post('/role/add', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx
  const {name, identifier, api_paths} = ctx.request.body


  let result: any = {
    status: 0, 
    message: ''
  }
  if(identifier < 1000 || identifier > 9999){
    return throwError(0, 'identifier的取值在1000~9999之间', 400)
  }
  const roleNum = (await mysql.count(sys_role.t, {
    p0: [sys_role.identifier, '=', identifier],
    p1: [sys_role.name, '=', name],
    r: 'p0 || p1'
  })).data
  if(roleNum > 0){
    result = {
      status: 0, 
      message: '已存在相同角色名或角色编号'
    }
  }else{
    await mysql.set(sys_role.t, {
      identifier: identifier,
      api_paths: api_paths,
      name: name
    })
    result = {
      status: 2, 
      message: '新增成功'
    }
  }
  ctx.body = result
})

// 获取角色详情
systemRouter.get('/role/info/:id', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx
  const {id} = ctx.params

  let info = (await mysql.get(sys_role.t, id)).data
  ctx.body = info
})

// 更新角色详情
systemRouter.put('/role/update', authUse, authSuperMana, async function(ctx, next) {
  const {user, body} = ctx
  const {name, identifier, api_paths, id} = ctx.request.body

  if(identifier < 1000 || identifier > 9999){
    return throwError(0, 'identifier的取值在1000~9999之间', 400)
  }
  let result: any = {
    status: 0, 
    message: ''
  }
  await mysql.update(sys_role.t, id, {
    identifier: identifier,
    api_paths: api_paths,
    name: name
  })
  result = {
    status: 2, 
    message: '更新成功'
  }
  ctx.body = result
})


// 角色列表
systemRouter.get('/role/list', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx

  let list = (await mysql.find(sys_role.t, {
    p0: [sys_role.status, '=', 2],
    r: 'p0'
  })).data.objects

  for(let i = 0; i < list.length; i ++){
    let tempUsers = (await mysql.find(users.t, {
      p0: [users.role, 'like', `%${list[i].identifier}%`],
      r: 'p0'
    })).data.objects
    let temp: any = []
    for(let j = 0; j < tempUsers.length; j++){
      temp.push(tempUsers[j].nickname || tempUsers[j].email)
    }
    list[i].user_info = temp.toString()
  }
  ctx.body = list
})

// 删除角色
systemRouter.post('/role/del', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx
  const {id} = ctx.request.body

  let result: any = {
    status: 2,
    message: '删除成功'
  }
  let info = (await mysql.get(sys_role.t, id)).data
  let count = (await mysql.count(users.t, {
    p0: [users.role, 'like', `%${info.identifier}%`],
    r: 'p0'
  })).data
  if(count > 0){
    result = {
      status: 0,
      message: '不能删除，当前有用户属于该角色'
    }
  }else{
    await mysql.update(sys_role.t, id, {
      status: 0
    })
    result = {
      status: 2,
      message: '删除成功'
    }
  }
  ctx.body = result
})

// 更改用户角色
systemRouter.put('/update/user/role', authUse, authSuperMana, async function(ctx, next) {
  const {user} = ctx
  const {uid, role} = ctx.request.body

  const {begin, commit, rollback, run} = await mysql.transaction()
  let result: any = {
    status: 0,
    message: ''
  }
  await begin(async () => {
    try{
      //更新权限
      const sql1 = await mysql.update(users.t, uid, {role}, 'sentence')

      //查寻当前用户自己是不是自己的总销售 即总销售》销售
      const sql2 = await mysql.find(sale_rela.t, {
        p0: [sale_rela.f_sale_uid, '=', uid],
        p1: [sale_rela.sale_uid, '=', uid],
        p2: [sale_rela.status, '=', 2],
        r: 'p0 && p1 && p2'
      }, 'sentence')
      const sql22 = await mysql.find(sale_rela.t, {
        p0: [sale_rela.f_sale_uid, '=', uid],
        p2: [sale_rela.status, '>', 0],
        r: 'p0 && p2'
      }, 'sentence')
      const sql3 = await mysql.set(sale_rela.t, {
        f_sale_uid: uid,
        sale_uid: uid,
        status: 2,
        created_at: getTime('date_time')
      }, 'sentence')


      let temp2 = (await run(sql2)).data.objects
      let tempArr = role.split(',')

      // 更新总销售，和自己为自己的销售
      if(tempArr.indexOf(SALES_LEADER) > -1){
        // 用户权限将要更新为总销售，所以，要加入自己为自己总销售
        if(temp2.length === 0){
          const saleUid = (await run(await mysql.find(sale_rela.t, {
            p0: [sale_rela.sale_uid, '=', uid],
            p2: [sale_rela.status, '>', 0],
            r: 'p0 && p2'
          }, 'sentence'))).data.objects
          // 没有，且不属于其他用户，则要加
          if(saleUid.length === 0){
            await run(sql3)
          }else{
            result = {status: 0, message: '当前用户已加入其他总销售，暂不支持变更'}
            return await rollback()
          }
        }
      }else{ // 删除权限
        // 不为总销售，则去掉关系
      let temp22 = (await run(sql22)).data.objects
        if(temp2.length > 0){
          if(temp22.length <= 1){
            let sql4 = await mysql.del(sale_rela.t, temp2[0].id, 'sentence')
            await run(sql4)
          }else{
            result = {status: 0, message: '当前用户名下还有' + (temp22.length - 1) + '个销售，暂不支持删除'}
            return await rollback()
          }
        }
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

      if(tempArr.indexOf(SALES_PEOPLE) > -1){
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
      }else{
        // 不为销售，则去掉关系自己为自己的用户关系
        // 不为总销售，则去掉关系
        let temp7 = (await run(sql7)).data.objects
        if(temp6.length > 0){
          if(temp7.length <= 1){
            const sql8 = await mysql.del(sale_user_rela.t, temp6[0].id, 'sentence')
            await run(sql8)
          }else{
            result = {status: 0, message: '当前用户名下还有' + (temp7.length - 1) + '个用户，暂不支持删除'}
            return await rollback()
          }
        }
      }

      await run(sql1)
      await commit()
      result = {status: 2, message: '更新成功'}
    }catch(err: any){
      await rollback()
      throw new Error(err)
    }
  })
  ctx.body = result
})




//商品分类，列表
systemRouter.get('/product_cat/list', authUse, async (ctx, next) => {
  let list = (await mysql.find(sys_product_cat.t, {
    p0: [sys_product_cat.status, '=', 2],
    r: 'p0'
  })).data.objects
  ctx.body = list
})
// 新增商品分类
systemRouter.post('/product_cat/add', authUse, authSuperMana, async (ctx, next) => {
  const {title, rank_num} = ctx.request.body
  await mysql.set(sys_product_cat.t, {
    title: title,
    rank_num: rank_num
  })
  ctx.body = {
    status: 2,
    message: '新增成功'
  }
})
// 更新商品分类
systemRouter.put('/product_cat/update', authUse, authSuperMana, async (ctx, next) => {
  const {id, title, rank_num} = ctx.request.body
  await mysql.update(sys_product_cat.t, id, {
    title: title,
    rank_num: rank_num
  })
  ctx.body = {
    status: 2,
    message: '更新成功'
  }
})
// 删除商品分类
systemRouter.put('/product_cat/del', authUse, authSuperMana, async (ctx, next) => {
  const {id} = ctx.request.body
  // 查看该分类下，有没有商品，有的话，则不能删除
  const num = (await mysql.count(product.t, {
    p0: [product.cat_id, '=', id],
    r: 'p0'
  })).data
  const num2 = (await mysql.count(product_draft.t, {
    p0: [product_draft.product_cat_id, '=', id],
    r: 'p0'
  })).data
  if(num > 0 || num2 > 0){
    return ctx.body = {status: 0, message: '删除失败，因该分类已有商品使用，不可删除'}
  }
  await mysql.del(sys_product_cat.t, id)
  ctx.body = {
    status: 2,
    message: '删除成功'
  }
})


// 系统常量参数
systemRouter.get('/constants/list', authUse, authSuperMana, async (ctx, next) => {
  let constants = (await mysql.find(sys_constants.t, {
    p0: [sys_constants.status, '=', 2],
    r: 'p0'
  })).data.objects
  ctx.body = constants
})

// 更新常量参数的值
systemRouter.put('/constants/chagne', authUse, authSuperMana, async (ctx, next) => {
  const {id, value} = ctx.request.body

  const info = (await mysql.get(sys_constants.t, id)).data

  if(info.key === 'PRICE_PERCENT'){
    if(value < 1 || value > 2){
      return ctx.body = {
        status: 0,
        message: '定价百分比应该在 1.00 ~ 2.00 之间'
      }
    }
    await mysql.update(sys_constants.t, id, {
      value: value.toFixed(2)
    })
  }
  ctx.body = {
    status: 2,
    message: '操作成功'
  }
})


export default systemRouter


