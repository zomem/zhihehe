import {redis, mysql} from 'access-db'
import {article, product, users, sys_product_cat, redis_product} from '../constants/table'



// 首页商品的所有缓存，所有
export const productCache = async () => {
  //选删除所有的，再进行缓存
  let redisList = (await redis.find(redis_product, {})).data.objects

  // console.log('redisList', redisList.length)
  
  if(redisList.length > 0){
    let rids: any = redisList.map((item) => item.id)
    await redis.delmany(redis_product, rids)
  }

  let list = (await mysql.find(article.t, {
    j0: [article.uid, 'inner', users.id],
    j1: [article.product_id, 'inner', product.id],
    j2: [product.cat_id, 'left', sys_product_cat.id],
    p0: [article.status, '=', 20],
    p1: [article.status, '=', 6],
    r: 'p0 || p1',
    orderBy: ['-' + article.created_at],
    select: [
      article.id,
      users.id + ' as uid',
      users.nickname,
      users.avatar_url,
      article.created_at,
      article.img_urls,
      article.status,
      product.des + ' as des',
      product.title + ' as product_title',
      product.can_gift,
      product.can_group,
      product.cat_id,
      
      product.price,
      product.quantity,
      product.sale_cost,
      product.f_sale_cost,

      product.group_price,
      product.group_quantity,
      product.group_sale_cost,
      product.group_f_sale_cost,
      product.group_end,

      sys_product_cat.title + ' as cat_title'
    ]
  })).data.objects
  await redis.setmany(redis_product, list)
}

// 单个产品缓存
export const productCacheOne = async (aid, is_onoff, s=6) => {
  if(is_onoff){
    // 上下架商品的操作，只更新 status
    await redis.update(redis_product, aid, {status: s})
  }else{
    // 审核通过，则重新添加
    let list = (await mysql.find(article.t, {
      j0: [article.uid, 'inner', users.id],
      j1: [article.product_id, 'inner', product.id],
      j2: [product.cat_id, 'left', sys_product_cat.id],
      p0: [article.status, '=', 20],
      p1: [article.id, '=', aid],
      r: 'p0 && p1',
      limit: 1,
      orderBy: ['-' + article.created_at],
      select: [
        article.id,
        users.id + ' as uid',
        users.nickname,
        users.avatar_url,
        article.created_at,
        article.img_urls,
        article.status,
        product.des + ' as des',
        product.title + ' as product_title',
        product.can_gift,
        product.can_group,
        product.cat_id,

        product.price,
        product.quantity,
        product.sale_cost,
        product.f_sale_cost,

        product.group_price,
        product.group_quantity,
        product.group_sale_cost,
        product.group_f_sale_cost,
        product.group_end,

        sys_product_cat.title + ' as cat_title'
      ]
    })).data.objects
    await redis.del(redis_product, aid)
    await redis.set(redis_product, list[0])
  }
}

// 用户下单后，产品的数量缓存
export const productCacheQuantity = async (aid, num, isGroup=false) => {
  if(isGroup){
    await redis.update(redis_product, aid, {
      group_quantity: ['incr', num]
    })
  }else{
    await redis.update(redis_product, aid, {
      quantity: ['incr', num]
    })
  }
}