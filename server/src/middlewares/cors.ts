import {ALLOW_ORIGIN} from '../constants/constants'


const cors = async (ctx, next) => {
  const origin = ctx.get('Origin') || 'no_origin'
  if(ALLOW_ORIGIN[origin]){
    ctx.set('Access-Control-Allow-Origin', origin)
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    if (ctx.method == 'OPTIONS') {
      ctx.body = 200
    } else {
      await next()
    }
  }else{
    ctx.status = 403
    ctx.body = {code: -1, message: '非法请求'}
    return
  }
}

export default cors