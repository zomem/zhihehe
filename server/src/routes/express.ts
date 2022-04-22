import {mysql} from 'access-db'
import axios from 'axios'

import {feedback, trade, users} from '../constants/table'
import { getTime } from '../utils/utils'
import {WEAPP, EXPRESS_SF} from '../constants/constants'
import {authRole, authUse} from '../middlewares/auth'

const expressRouter = require('koa-router')()

expressRouter.prefix('/express')


// 获取支持的快递公司列表
expressRouter.get('/delivery/list', authUse, async function(ctx, next) {
  const {user} = ctx
  let accessToken = (await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP.APP_ID}&secret=${WEAPP.APP_SECRET}`)).data.access_token
  
  let deliveryList = (await axios.get(`https://api.weixin.qq.com/cgi-bin/express/business/delivery/getall?access_token=${accessToken}`)).data
  
  ctx.body = deliveryList
})


// 生成运单
// expressRouter.post('/delivery/add', authUse, async (req, res, next) => {
//   const {user} = req
//   let accessToken = (await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP.APP_ID}&secret=${WEAPP.APP_SECRET}`)).data.access_token
//   let addorder = (await axios.post(`https://api.weixin.qq.com/cgi-bin/express/business/order/add?access_token=${accessToken}`, {
//     add_source: 0,
//     order_id: '16315067151947678584',
//     openid: user.openid,
//     delivery_id: EXPRESS_SF.ID,
//     biz_id: EXPRESS_SF.BIZ_ID,
//     sender: {
//       name: "张三",
//       mobile: "18723089515",
//       company: "捷贵科技",
//       province: "重庆市",
//       city: "重庆市",
//       area: "渝北区",
//       address: "金龙路256号加州花园小区A8-24-3"
//     },
//     receiver: {
//       name: "李四",
//       mobile: "18725796114",
//       province: "重庆市",
//       city: "重庆市",
//       area: "渝北区",
//       address: "金龙路256号加州花园小区A8"
//     },
//     cargo: {
//       count: 1,
//       weight: 3.5,
//       space_x: 35,
//       space_y: 45,
//       space_z: 25,
//       detail_list: [
//         {
//           name: "猕猴桃",
//           count: 1
//         }
//       ]
//     },
//     shop: {
//       wxa_path: "/pages/article/BuyProduct",
//       img_url: "https://file.jetgui.com/shuiguo/article/6U5HlvzcmzDhTesO9DE1rqHJ0.jpg",
//       goods_name: "猕猴桃",
//       goods_count: 1
//     },
//     insured: {
//       use_insured: 0,
//       insured_value: 0
//     },
//     service: {
//       service_type: EXPRESS_SF.SERVICE_TYPE,
//       service_name: "标准快递"
//     },
//     expect_time: 1634613704,
//   })).data
//   res.json(addorder)
// })


// 获取运单详情
expressRouter.get('/delivery/detail', authUse, async (ctx, next) => {
  const {user} = ctx
  let accessToken = (await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP.APP_ID}&secret=${WEAPP.APP_SECRET}`)).data.access_token
  let info = (await axios.post(`https://api.weixin.qq.com/cgi-bin/express/business/order/get?access_token=${accessToken}`, {
    order_id: '16315067151947678584',
    openid: user.openid,
    delivery_id: EXPRESS_SF.ID,
    waybill_id: 'SF6026263200924',
  })).data
  ctx.body = info
})

// 查寻运单轨迹
expressRouter.get('/delivery/path/:trade_no', authUse, async (ctx, next) => {
  const {user, params} = ctx
  const {trade_no} = params

  const tradeInfo = (await mysql.get(trade.t, {trade_no: trade_no})).data

  if(!tradeInfo.id){
    return ctx.body = {status: 0, message: '未查到相关订单信息'}
  }
  let accessToken = (await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP.APP_ID}&secret=${WEAPP.APP_SECRET}`)).data.access_token
  let info = (await axios.post(`https://api.weixin.qq.com/cgi-bin/express/business/path/get?access_token=${accessToken}`, {
    order_id: tradeInfo.trade_no,
    openid: user.openid,
    delivery_id: EXPRESS_SF.ID,
    waybill_id: tradeInfo.express_no,
  })).data
  ctx.body = info
})

 
// 取消运单   SF6026263886887   SF6026263871699

expressRouter.post('/delivery/cancel', authUse, async (ctx, next) => {
  const {user} = ctx
  let accessToken = (await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WEAPP.APP_ID}&secret=${WEAPP.APP_SECRET}`)).data.access_token
  let cancelorder = (await axios.post(`https://api.weixin.qq.com/cgi-bin/express/business/order/cancel?access_token=${accessToken}`, {
    order_id: '16315067151947678584',
    openid: user.openid,
    delivery_id: EXPRESS_SF.ID,
    waybill_id: 'SF6026263886887',
  })).data
  ctx.body = cancelorder
})

export default expressRouter

