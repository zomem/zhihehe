import { nccPath } from '../utils/file'
import path from 'path'
import saveLogs from 'save-logs'
import {getTime} from '../utils/utils'


const catchError = async (ctx, next) => {
  try{
    await next()
  }catch(err: any){
    const {response, request, originalUrl} = ctx
    const nowTime = getTime('date_time')
    saveLogs(originalUrl.split('/')[1], {
      time: nowTime,
      statusCode: err.statusCode || response.status || 900,
      url: originalUrl,
      method: request.method,
      code: err.errorCode,
      info: err,
      platform: request.header['sec-ch-ua-platform'],
      userAgent: request.header['user-agent'],
      host: request.header.host,
      params: ctx.params,
      body: ctx.request.body,
      end: "#####################################",
    }, path.join(__dirname, nccPath('../../logs/', './logs/')))
    ctx.status = err.statusCode || response.status || 900
    return ctx.body = {
      code: err.errorCode || 'ERROR_CODE',
      url: originalUrl,
      message: `${err.message}`,
    }
  }
}


export default catchError