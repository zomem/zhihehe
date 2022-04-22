import {mysql} from 'access-db'
import {Decimal} from 'decimal.js'
import path from 'path'
import {gift_picked, gift_trade, product, trade, wait_paid, users_account, users_account_record, share_money, users} from '../constants/table'
import {isArray, getTime} from '../utils/utils'
import { nccPath } from '../utils/file'

import saveLogs from 'save-logs'

const schedule = require('node-schedule')

const TEST_CRON = '*/2 * * * *'  // 测试用，每2分钟
const TWO_MIN = 2 * 60  // 测试用，2分钟

const TRADE_TIME_CRON = '15 2 * * *'
const WAITPAY_TIME_CRON = '20 2 * * *'
const TRADE_TIME_CRON2 = '25 2 * * *'
const WAITPAY_TIME_CRON2 = '30 2 * * *'
const CONFIRM_TIME_CRON = '35 2 * * *'
const BACK_TIME_CRON = '30 3 * * *'

const ONE_DAY = 24 * 3600 * 1000
const SEVEN_DAY = 7 * 24 * 3600 * 1000
const THREE_DAY = 3 * 24 * 3600 * 1000




// 单纯变更待支付的礼物订单为已取消，还原商品数量
export const cancelGiftTradeWait = () => {
  schedule.scheduleJob(TRADE_TIME_CRON, async () => {
    const passTime = getTime('date_time', new Date().getTime() - ONE_DAY)
    
    let tradeList = (await mysql.find(gift_trade.t, {
      p0: [gift_trade.trade_status, '=', 5],
      p2: [gift_trade.created_at, '<', passTime],
      r: 'p0 && p2'
    })).data.objects
    let productIds: any = [], upProductData: any = [], updateTradeData: any = [], tradeIDs: any=[]
    for(let i = 0; i < tradeList.length; i++){
      let isHave = false
      updateTradeData.push({
        id: tradeList[i].id,
        trade_status: 3,  // 已取消
      })
      tradeIDs.push(tradeList[i].id)
      for(let j = 0; j < upProductData.length; j++){
        if(upProductData[j].id === tradeList[i].product_id){
          isHave = true
          upProductData[j].quantity = ['incr', upProductData[j].quantity[1] + tradeList[i].quantity]
          break
        }
      }
      if(!isHave){
        upProductData.push({
          id: tradeList[i].product_id,
          quantity: ['incr', tradeList[i].quantity]
        })
      }
      productIds.push(tradeList[i].product_id)
    }
    
    const {begin, run, commit, rollback} = await mysql.transaction()

    await begin(async () => {
      try{

        const sql_trade = await mysql.updatemany(gift_trade.t, 'id', updateTradeData, 'sentence')
        await run(sql_trade)

        const sql_product = await mysql.updatemany(product.t, 'id', upProductData, 'sentence')
        await run(sql_product)

        await commit()

        saveLogs('cancelGiftTradeWait', {
          title: '定时任务，变更超过一天的待支付礼物为已取消',
          tradeIDs: tradeIDs,
          allNum: tradeIDs.length,
        }, path.join(__dirname, nccPath('../../logs/records/', './logs/records/')))
      }catch(err: any){
        await rollback()
        throw new Error(err)
      }
    })
  })
}


// 单纯变更待支付订单为已取消，还原商品数量
export const cancelTradeWait = () => {
  schedule.scheduleJob(TRADE_TIME_CRON, async () => {
    const passTime = getTime('date_time', new Date().getTime() - ONE_DAY)
    
    let tradeList = (await mysql.find(trade.t, {
      p0: [trade.trade_status, '=', 5],
      p1: [trade.is_group, '=', 0],
      p2: [trade.created_at, '<', passTime],
      r: 'p0 && p1 && p2'
    })).data.objects
    let productIds: any = [], upProductData: any = [], updateTradeData: any = [], tradeIDs: any=[]
    for(let i = 0; i < tradeList.length; i++){
      let isHave = false
      updateTradeData.push({
        id: tradeList[i].id,
        trade_status: 3,  // 已取消
      })
      tradeIDs.push(tradeList[i].id)
      for(let j = 0; j < upProductData.length; j++){
        if(upProductData[j].id === tradeList[i].product_id){
          isHave = true
          upProductData[j].quantity = ['incr', upProductData[j].quantity[1] + tradeList[i].quantity]
          break
        }
      }
      if(!isHave){
        upProductData.push({
          id: tradeList[i].product_id,
          quantity: ['incr', tradeList[i].quantity]
        })
      }
      productIds.push(tradeList[i].product_id)
    }
    
    const {begin, run, commit, rollback} = await mysql.transaction()

    await begin(async () => {
      try{

        const sql_trade = await mysql.updatemany(trade.t, 'id', updateTradeData, 'sentence')
        await run(sql_trade)

        const sql_product = await mysql.updatemany(product.t, 'id', upProductData, 'sentence')
        await run(sql_product)

        await commit()

        saveLogs('cancelTradeWait', {
          title: '定时任务，变更超过一天的待支付订单为已取消',
          tradeIDs: tradeIDs,
          allNum: tradeIDs.length,
        }, path.join(__dirname, nccPath('../../logs/records/', './logs/records/')))
      }catch(err: any){
        await rollback()
        throw new Error(err)
      }
    })
  })
}
// 单纯变更待支付团购订单为已取消，还原商品团购数量
export const cancelTradeWaitGroup = () => {
  schedule.scheduleJob(TRADE_TIME_CRON2, async () => {
    const passTime = getTime('date_time', new Date().getTime() - ONE_DAY)
    
    let tradeList = (await mysql.find(trade.t, {
      p0: [trade.trade_status, '=', 5],
      p1: [trade.is_group, '=', 1],
      p2: [trade.created_at, '<', passTime],
      r: 'p0 && p1 && p2'
    })).data.objects
    let productIds: any = [], upProductData: any = [], updateTradeData: any = [], tradeIDs: any=[]
    for(let i = 0; i < tradeList.length; i++){
      let isHave = false
      updateTradeData.push({
        id: tradeList[i].id,
        trade_status: 3,  // 已取消
      })
      tradeIDs.push(tradeList[i].id)
      for(let j = 0; j < upProductData.length; j++){
        if(upProductData[j].id === tradeList[i].product_id){
          isHave = true
          upProductData[j].group_quantity = ['incr', upProductData[j].group_quantity[1] + tradeList[i].quantity]
          break
        }
      }
      if(!isHave){
        upProductData.push({
          id: tradeList[i].product_id,
          group_quantity: ['incr', tradeList[i].quantity]
        })
      }
      productIds.push(tradeList[i].product_id)
    }
    
    const {begin, run, commit, rollback} = await mysql.transaction()

    await begin(async () => {
      try{

        const sql_trade = await mysql.updatemany(trade.t, 'id', updateTradeData, 'sentence')
        await run(sql_trade)

        const sql_product = await mysql.updatemany(product.t, 'id', upProductData, 'sentence')
        await run(sql_product)

        await commit()

        saveLogs('cancelTradeWait', {
          title: '定时任务，变更超过一天的待支付订单为已取消',
          tradeIDs: tradeIDs,
          allNum: tradeIDs.length,
        }, path.join(__dirname, nccPath('../../logs/records/', './logs/records/')))
      }catch(err: any){
        await rollback()
        throw new Error(err)
      }
    })
  })
}



// 定期将过期的待支付信息删除。status=0，同时变更订单为取消，还原商品数量
export const delWaitPay = () => {
  schedule.scheduleJob(WAITPAY_TIME_CRON, async () => {
    const passTime = getTime('date_time', new Date().getTime() - ONE_DAY)
    let temp = (await mysql.find(wait_paid.t, {
      p0: [wait_paid.status, '=', 2],
      p2: [wait_paid.created_at, '<', passTime],
      r: 'p0 && p2'
    })).data.objects
    let updata: any = [], waitPaidIDs: any = [], tradeIds: any = [], updateTradeData: any = []
    if(temp.length === 0) return
    for(let i = 0; i < temp.length; i++){
      updata.push({
        id: temp[i].id,
        status: 0,
      })
      updateTradeData.push({
        id: temp[i].trade_id,
        trade_status: 3,  // 已取消
      })
      waitPaidIDs.push(temp[i].id)
      tradeIds.push(temp[i].trade_id)
    }
    let tradeList = (await mysql.find(trade.t, {
      p0: [trade.id, 'in', tradeIds],
      p1: [trade.trade_status, '=', 5],
      p2: [trade.is_group, '=', 0],
      r: 'p0 && p1 && p2'
    })).data.objects
    let productIds: any = [], upProductData: any = []
    for(let i = 0; i < tradeList.length; i++){
      let isHave = false
      for(let j = 0; j < upProductData.length; j++){
        if(upProductData[j].id === tradeList[i].product_id){
          isHave = true
          upProductData[j].quantity = ['incr', upProductData[j].quantity[1] + tradeList[i].quantity]
          break
        }
      }
      if(!isHave){
        upProductData.push({
          id: tradeList[i].product_id,
          quantity: ['incr', tradeList[i].quantity]
        })
      }
      productIds.push(tradeList[i].product_id)
    }
    const {begin, run, commit, rollback} = await mysql.transaction()

    await begin(async () => {
      try{
        const sql_wait = await mysql.updatemany(wait_paid.t, 'id', updata, 'sentence')
        let upResData = (await run(sql_wait)).data

        const sql_trade = await mysql.updatemany(trade.t, 'id', updateTradeData, 'sentence')
        await run(sql_trade)

        const sql_product = await mysql.updatemany(product.t, 'id', upProductData, 'sentence')
        await run(sql_product)

        await commit()

        saveLogs('delWaitPay', {
          title: '定时任务，删除超过一天的待支付Data信息为删除，同时变更订单为已取消',
          tradeIDs: waitPaidIDs,
          allNum: waitPaidIDs.length,
          sucNum: upResData.affectedRows
        }, path.join(__dirname, nccPath('../../logs/records/', './logs/records/')))
      }catch(err: any){
        await rollback()
        throw new Error(err)
      }
    })
  })
}
// 定期将过期的待支付团购信息删除。status=0，同时变更团购订单为取消，还原团购商品数量
export const delWaitPayGroup = () => {
  schedule.scheduleJob(WAITPAY_TIME_CRON2, async () => {
    const passTime = getTime('date_time', new Date().getTime() - ONE_DAY)
    let temp = (await mysql.find(wait_paid.t, {
      p0: [wait_paid.status, '=', 2],
      p2: [wait_paid.created_at, '<', passTime],
      r: 'p0 && p2'
    })).data.objects
    let updata: any = [], waitPaidIDs: any = [], tradeIds: any = [], updateTradeData: any = []
    if(temp.length === 0) return
    for(let i = 0; i < temp.length; i++){
      updata.push({
        id: temp[i].id,
        status: 0,
      })
      updateTradeData.push({
        id: temp[i].trade_id,
        trade_status: 3,  // 已取消
      })
      waitPaidIDs.push(temp[i].id)
      tradeIds.push(temp[i].trade_id)
    }
    let tradeList = (await mysql.find(trade.t, {
      p0: [trade.id, 'in', tradeIds],
      p1: [trade.trade_status, '=', 5],
      p2: [trade.is_group, '=', 1],
      r: 'p0 && p1 && p2'
    })).data.objects
    let productIds: any = [], upProductData: any = []
    for(let i = 0; i < tradeList.length; i++){
      let isHave = false
      for(let j = 0; j < upProductData.length; j++){
        if(upProductData[j].id === tradeList[i].product_id){
          isHave = true
          upProductData[j].group_quantity = ['incr', upProductData[j].group_quantity[1] + tradeList[i].quantity]
          break
        }
      }
      if(!isHave){
        upProductData.push({
          id: tradeList[i].product_id,
          group_quantity: ['incr', tradeList[i].quantity]
        })
      }
      productIds.push(tradeList[i].product_id)
    }
    const {begin, run, commit, rollback} = await mysql.transaction()

    await begin(async () => {
      try{
        const sql_wait = await mysql.updatemany(wait_paid.t, 'id', updata, 'sentence')
        let upResData = (await run(sql_wait)).data

        const sql_trade = await mysql.updatemany(trade.t, 'id', updateTradeData, 'sentence')
        await run(sql_trade)

        const sql_product = await mysql.updatemany(product.t, 'id', upProductData, 'sentence')
        await run(sql_product)

        await commit()

        saveLogs('delWaitPay', {
          title: '定时任务，删除超过一天的待支付Data信息为删除，同时变更订单为已取消',
          tradeIDs: waitPaidIDs,
          allNum: waitPaidIDs.length,
          sucNum: upResData.affectedRows
        }, path.join(__dirname, nccPath('../../logs/records/', './logs/records/')))
      }catch(err: any){
        await rollback()
        throw new Error(err)
      }
    })
  })
}



// 自动确认,7天后的货，收货
export const confirmTrade = () => {
  schedule.scheduleJob(CONFIRM_TIME_CRON, async () => {
    const passTime = getTime('date_time', new Date().getTime() - SEVEN_DAY)
    let temp = (await mysql.find(trade.t, {
      p0: [trade.status, '=', 2],
      p1: [trade.trade_status, '=', 15],
      p2: [trade.created_at, '<', passTime],
      r: 'p0 && p1 && p2'
    })).data.objects
    let updata: any = [], tradeIDs: any = []
    if(temp.length === 0) return
    for(let i = 0; i < temp.length; i++){
      updata.push({
        id: temp[i].id,
        trade_status: 20,
      })
      tradeIDs.push(temp[i].id)
    }
    let upResData = (await mysql.updatemany(trade.t, 'id', updata)).data

    saveLogs('confirmTrade', {
      title: '定时任务，自动确认7天后的待收货订单',
      tradeIDs: tradeIDs,
      allNum: tradeIDs.length,
      sucNum: upResData.affectedRows
    }, path.join(__dirname, nccPath('../../logs/records/', './logs/records/')))
  })
}


// 领取的礼物自动确认,7天后的货，收货
export const confirmGiftPicked = () => {
  schedule.scheduleJob(CONFIRM_TIME_CRON, async () => {
    const passTime = getTime('date_time', new Date().getTime() - SEVEN_DAY)
    let temp = (await mysql.find(gift_picked.t, {
      p0: [gift_picked.status, '=', 2],
      p1: [gift_picked.gift_trade_status, '=', 15],
      p2: [gift_picked.created_at, '<', passTime],
      r: 'p0 && p1 && p2'
    })).data.objects
    let updata: any = [], tradeIDs: any = []
    if(temp.length === 0) return
    for(let i = 0; i < temp.length; i++){
      updata.push({
        id: temp[i].id,
        gift_trade_status: 20,
      })
      tradeIDs.push(temp[i].id)
    }
    let upResData = (await mysql.updatemany(gift_picked.t, 'id', updata)).data

    saveLogs('confirmGiftPicked', {
      title: '定时任务，自动确认7天后的礼物待收货订单',
      tradeIDs: tradeIDs,
      allNum: tradeIDs.length,
      sucNum: upResData.affectedRows
    }, path.join(__dirname, nccPath('../../logs/records/', './logs/records/')))
  })
}



/** 礼物一直没人领取，进行自动退款，余额 */
export const refundGift = () => {
  schedule.scheduleJob(BACK_TIME_CRON, async () => {
    const passTime = getTime('date_time', new Date().getTime() - THREE_DAY)
    let temp = (await mysql.find(gift_trade.t, {
      p0: [gift_trade.status, '=', 2],
      p1: [gift_trade.trade_status, '=', 20],
      p2: [gift_trade.created_at, '<', passTime],
      p3: [gift_trade.remain_quantity, '>', 0],
      r: 'p0 && p1 && p2 && p3'
    })).data.objects

    // 一笔一笔的给用户退款
    for(let i = 0; i < temp.length; i++){
      (function(i) {
        setTimeout(async () => {   
          const {commit, run, rollback, locks, begin} = await mysql.transaction()
          await begin(async () => {
            try{
              const sql1 = (await mysql.get(gift_trade.t, temp[i].id, {}, 'sentence')) + locks.exclusive_locks
              const giftTradeInfo = (await run(sql1)).data
              const sql2 = await mysql.get(users_account.t, {uid: giftTradeInfo.uid}, {}, 'sentence')
      
              let userAccount = (await run(sql2)).data
              if(!userAccount.id){
                await run(await mysql.set(users_account.t, {
                  uid: giftTradeInfo.uid,
                  balance: 0,
                }, 'sentence'))
                userAccount = (await run(sql2)).data
              }
              // 清空用户礼物订单里的 剩余未领取数量
              const sql3 = await mysql.update(gift_trade.t, giftTradeInfo.id, {
                trade_status: 1,
                remain_quantity: 0
              }, 'sentence')
      
              const change = new Decimal(giftTradeInfo.remain_quantity).mul(new Decimal(giftTradeInfo.price)).toNumber()
              const changefen = new Decimal(giftTradeInfo.remain_quantity).mul(new Decimal(giftTradeInfo.price)).mul(new Decimal(100)).toNumber()
      
              const sql4 = await mysql.set(users_account_record.t, {
                users_account_id: userAccount.id,
                uid: giftTradeInfo.uid,
                content: `礼物【${giftTradeInfo.title}】未领取的自动退款，共计${giftTradeInfo.remain_quantity}件。`,
                change_balance: change,
                type: 12,
                obj: JSON.stringify({
                  gift_trade_id: giftTradeInfo.id,
                  title: giftTradeInfo.title,
                  des: giftTradeInfo.des,
                  uid: giftTradeInfo.uid,
                  price: giftTradeInfo.price,
                  cover_url: giftTradeInfo.cover_url,
                  article_id: giftTradeInfo.article_id,
                  product_id: giftTradeInfo.product_id,
                }),
              }, 'sentence')
      
              const sql5 = await mysql.update(users_account.t, userAccount.id, {
                balance: ['incr', change]
              }, 'sentence')


              // 报价员openid
              const sql6 = await mysql.get(users.t, giftTradeInfo.business_uid, {}, 'sentence')
              const business = (await run(sql6)).data
              const nowTime = getTime('date_time')
              const sql7 = await mysql.set(share_money.t, {
                out_order_no: 'P' + giftTradeInfo.trade_no,
                transaction_id: giftTradeInfo.transaction_id,
                account: business.openid,
                amount: -changefen,
                create_at:  nowTime,
                description: giftTradeInfo.title + '的用户退货扣款，共计' + giftTradeInfo.remain_quantity + '件',
                finish_at: nowTime,
                type: 'QUOTER_OPENID',
              }, 'sentence')

              await run(sql3)
              await run(sql4)
              await run(sql5)
              await run(sql7)
              await commit()
              saveLogs('refundGift', {
                title: '定时任务，自动退货，3天未领取的',
                gift_trade_id: giftTradeInfo.id,
                des: giftTradeInfo.des,
                uid: giftTradeInfo.uid,
                price: giftTradeInfo.price,
                cover_url: giftTradeInfo.cover_url,
                article_id: giftTradeInfo.article_id,
                product_id: giftTradeInfo.product_id,
              }, path.join(__dirname, nccPath('../../logs/records/', './logs/records/')))
            }catch(err:any){
              await rollback()
              throw new Error(err)
            }
          })
        }, i * 5000)
      })(i)
    }
  })
}

