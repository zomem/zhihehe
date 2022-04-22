
import catchError from './middlewares/catchError'
import cors from './middlewares/cors'

import indexRouter from './routes/index'
import usersRouter from './routes/users'
import loginRouter from './routes/login'
import commonRouter from './routes/common'
import expressRouter from './routes/express'
import registerRouter from './routes/register'
import uploadRouter from './routes/upload'
import payRouter from './routes/pay'

import commonConfigRouter from './routes/management/commonConfig'
import manageRouter from './routes/management/manage'
import systemRouter from './routes/management/system'
import manaProductRouter from './routes/management/product'

import accountRouter from './routes/zhihehe/account'
import articleRouter from './routes/zhihehe/article'
import commentRouter from './routes/zhihehe/comment'
import giftRouter from './routes/zhihehe/gift'
import productRouter from './routes/zhihehe/product'
import saleRouter from './routes/zhihehe/sale'
import shopCartRouter from './routes/zhihehe/shopCart'
import tradeRouter from './routes/zhihehe/trade'

const Koa = require('koa')
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')



const app = new Koa()


// middlewares
app.use(catchError)
app.use(cors)
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(path.join(__dirname, './static')))

// routes
app.use(indexRouter.routes(), indexRouter.allowedMethods())
app.use(usersRouter.routes(), usersRouter.allowedMethods())
app.use(loginRouter.routes(), loginRouter.allowedMethods())
app.use(commonRouter.routes(), commonRouter.allowedMethods())
app.use(expressRouter.routes(), expressRouter.allowedMethods())
app.use(registerRouter.routes(), registerRouter.allowedMethods())
app.use(uploadRouter.routes(), uploadRouter.allowedMethods())
app.use(payRouter.routes(), payRouter.allowedMethods())

app.use(commonConfigRouter.routes(), commonConfigRouter.allowedMethods())
app.use(manageRouter.routes(), manageRouter.allowedMethods())
app.use(systemRouter.routes(), systemRouter.allowedMethods())
app.use(manaProductRouter.routes(), manaProductRouter.allowedMethods())

app.use(accountRouter.routes(), accountRouter.allowedMethods())
app.use(articleRouter.routes(), articleRouter.allowedMethods())
app.use(commentRouter.routes(), commentRouter.allowedMethods())
app.use(giftRouter.routes(), giftRouter.allowedMethods())
app.use(productRouter.routes(), productRouter.allowedMethods())
app.use(saleRouter.routes(), saleRouter.allowedMethods())
app.use(shopCartRouter.routes(), shopCartRouter.allowedMethods())
app.use(tradeRouter.routes(), tradeRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})



export default app