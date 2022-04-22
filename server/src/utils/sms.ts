
import {redis} from 'access-db'
import {randomCode} from './utils'
import { nccPath } from '../utils/file'
import saveLogs from 'save-logs'
import path from 'path'

const Core = require('@alicloud/pop-core')

// 阿里云控制台 - 短信服务 - 国内消息
const SignName = "天天购享家"
const TemplateCode = "SMS_227261963"
const GiftNoticeCode = 'SMS_228845935'

var client = new Core({
    accessKeyId: process.env.ALI_ACCESSKEY_ID,
    accessKeySecret: process.env.ALI_ACCESSKEY_SECRET,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
})



// 发送礼物未领取通知
export const sendSmsGiftNotice = async (name, product, phone) => {
  // 生成验证码
  try{
    const result = await client.request('SendSms', {
      RegionId: "cn-hangzhou",
      PhoneNumbers: phone,
      SignName,
      TemplateCode: GiftNoticeCode,
      TemplateParam: `{name: "${name}", product: "${product}"}`
    }, {
      method: 'POST'
    })
    if (result.Message && result.Message == "OK" && result.Code && result.Code == "OK") {
      saveLogs('sendSmsGiftNotice', {
        name,
        product,
        phone
      }, path.join(__dirname, nccPath('../../logs/records/', './logs/records/')))
    }
    return result
  }catch (err: any) {
    throw new Error(err)
  }
}


// 发送验证码
export const sendSms = async (phone) => {
    // 生成验证码
  let code = randomCode(6, '0')
  if(code[0] === '0'){
    code = '1' + randomCode(5, '0')
  }

  try{
    const result = await client.request('SendSms', {
      RegionId: "cn-hangzhou",
      PhoneNumbers: phone,
      SignName,
      TemplateCode,
      TemplateParam: "{code:" + code + "}"
    }, {
      method: 'POST'
    })
    if (result.Message && result.Message == "OK" && result.Code && result.Code == "OK") {
      await redis.del('sms_code', phone)
      await redis.set('sms_code', {
        id: phone,
        code: code
      }, 5 * 60 * 1000)
    }
    return result
  }catch (err: any) {
    throw new Error(err)
  }
}

// 校验用户提交的验证码
export const smsVerify = async (phone, codeUser) => {
  let data = (await redis.get('sms_code', phone)).data
  if(data.code === codeUser){
    return true
  }
  return false
}