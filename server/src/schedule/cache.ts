import {productCache} from '../utils/cache'

const schedule = require('node-schedule')

// const TEST_CRON = '*/2 * * * *'  // 测试用，每2分钟
const TEST_CRON = '25 11 * * *'  // 测试用，每2分钟

const CACHE_TIME_CRON = '46 3 * * *'

// 单纯变更待支付的礼物订单为已取消，还原商品数量
export const onProductCache = () => {
  schedule.scheduleJob(CACHE_TIME_CRON, async () => {
    await productCache()
  })
}
