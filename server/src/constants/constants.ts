
import {readFileSync} from 'fs'
const path = require('path')

// 小程序的appid和appsecret
export const WEAPP = {
  APP_ID: process.env.WECHAT_MINI_APP_ID,
  APP_SECRET: process.env.WECHAT_MINI_APP_SECRET
}

export const SUPER_SYSTEM_UID = parseInt(process.env.SUPER_SYSTEM_USER_ID || '')

// 允许跨域的域名
export const ALLOW_ORIGIN = {
  'no_origin': true,
  'http://localhost:3000': true,
  'https://zomem.com': true,
}


export const ERROR_TYPE = {
  400: 'Bad Request',           // 表示请求报文存在语法错误或参数错误，服务器不理解
  401: 'Unauthorized',          // 表示发送的请求需要有HTTP认证信息或者是认证失败了
  403: 'Forbidden',             // 表示对请求资源的访问被服务器拒绝了
  404: 'Not Found',             // 表示服务器找不到你请求的资源

  500: 'Internal Server Error', // 表示服务器执行请求的时候出错了
  503: 'Service Unavailable',   // 表示服务器超负载或正停机维护，无法处理请求
  
  603: 'No Access',             // 当前用户没有权限进行该操作
  622: 'Some Test',
  650: 'Mysql Transaction Error',   // 当前用户没有权限进行该操作

  900: 'Not known'
}


// 默认图片地址
export const DEFAULT_IMG = {
  AVATAR: process.env.STATIC_URL + '/default/davatar.png',
  IMG_ERR: process.env.STATIC_URL + '/default/dimgerr.png'
}


// 小程序自动叫快递的配置信息
export const EXPRESS_SF = {
  ID: 'SF',
  NAME: '顺丰速运',
  BIZ_ID: 'SF_CASH',
  SERVICE_TYPE: 0,
  SERVICE_NAME: '标准快递',
}

export const PAY_WAY = {
  1: 'WX_PAY',
  5: 'BALANCE'
}


// 订单状态
export const TRADE_STATUS = {
  1: '已退款',
  3: '已取消',
  5: '待付款',
  10: '待发货',
  12: '待揽收',
  15: '待收货',
  20: '已完成'
}

export const GIFT_TRADE_STATUS = {
  1: '未领取的已退款',
  3: '已取消',
  5: '未付款',
  8: '待确认发货',
  10: '待发货',
  12: '待揽收',
  15: '待收货',
  20: '已完成'
}

// 角色信息，这个对应数据库里添加的编咓
// RoleName 为类型值，globle.d.ts
export const ROLE_OBJ = {
  '1000': {zh: '销售', en: 'salespeople'},
  '1006': {zh: '总销售', en: 'salesleader'},
  '1200': {zh: '报价员', en: 'quoter'}
}

//角色编号
export const SALES_LEADER = '1006'
export const SALES_PEOPLE = '1000'
export const QUOTER = '1200'



// wxpay v3
export const PRIVATE_KEY = readFileSync(path.join(__dirname, './cert/wxpay.pem')).toString()


// wxpay v2
export const PRIVATE_KEY_V2 = readFileSync(path.join(__dirname, './cert/wxpay.p12'))