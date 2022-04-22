import {mysql} from 'access-db'
import {users_history_avatar} from '../constants/table'
import {getTime, randomCode} from '../utils/utils'
import {saveFile, nccPath} from '../utils/file'
import {authMana, authRole, authUse} from '../middlewares/auth'
// import {imageResize} from '../utils/imageProcess'

const multer = require('@koa/multer')
const path = require('path')


const uploadRouter = require('koa-router')()

uploadRouter.prefix('/upload')

const upload = multer({dest: path.join(__dirname, nccPath('../uploads/', './uploads/'))})

//保存历史头像
uploadRouter.post('/avatars', authUse, upload.single('file'), async function(ctx, next) {
  const {user, file} = ctx
  let baseUrl = saveFile(file, '/avatars', user.id)
  let objs = (await mysql.find(users_history_avatar.t, {
    p1: ['uid', '=', user.id],
    r: 'p1'
  })).data.objects

  let nowTime = getTime('date_time')
  if(objs.length === 0){
    await mysql.set(users_history_avatar.t, {
      uid: user.id,
      img_url: baseUrl,
      created_at: nowTime,
      updated_at: nowTime
    })
  }else{
    await mysql.update(users_history_avatar.t, objs[0].id, {
      updated_at: nowTime
    })
  }
  ctx.body = {url: process.env.STATIC_URL + baseUrl}
})


// 上传banner[后台]
// uploadRouter.post('/banner', authUse, authMana, upload.single('file'), async function(ctx, next) {
//   const {file} = ctx
//   let basename = randomCode(15, '0aA')
//   let inputUrl = saveFile(file, '/banner')
//   let data = await imageResize({
//     inputImage: inputUrl,
//     outputName: basename,
//     compressionLevel: 6,
//     deleteOld: true
//   })
//   ctx.body = {
//     path: data.path,
//     url: process.env.STATIC_URL + data.path
//   }
// })


//图片上传示例 web端
/** 如果需要验证用户，加上authUse 就行。 前端也要记得header带上token */
uploadRouter.post('/images', upload.single('file'), async function(ctx, next) {
  const {file} = ctx
  let baseUrl = saveFile(file, '/images')
  ctx.body = {url: process.env.STATIC_URL + baseUrl, path: baseUrl}
})



// 用户评价上传的图片
uploadRouter.post('/comment', authUse, upload.single('file'), async function(ctx, next) {
  const {file} = ctx
  let basename = randomCode(25, '0aA')
  let inputUrl = saveFile(file, '/comment', basename)
  ctx.body = {
    path: inputUrl,
    url: process.env.STATIC_URL + inputUrl
  }
})

// 上传的文章图片
uploadRouter.post('/article', authUse, authRole, upload.single('file'), async function(ctx, next) {
  const {file} = ctx
  let basename = randomCode(25, '0aA')
  let inputUrl = saveFile(file, '/article', basename)
  ctx.body = {
    path: inputUrl,
    url: process.env.STATIC_URL + inputUrl
  }
})

// 上传的商品图片
uploadRouter.post('/product', authUse, authRole, upload.single('file'), async function(ctx, next) {
  const {file} = ctx
  let basename = randomCode(25, '0aA')
  let inputUrl = saveFile(file, '/product', basename)
  // let inputUrl = saveFile(file, '/product')
  // let data = await imageResize({
  //   inputImage: inputUrl,
  //   outputName: basename,
  //   compressionLevel: 0,
  //   deleteOld: true
  // })
  ctx.body = {
    path: inputUrl,
    url: process.env.STATIC_URL + inputUrl
  }
})


// 上传贺卡图片[后台]
uploadRouter.post('/gift', authUse, authMana, upload.single('file'), async function(ctx, next) {
  const {file} = ctx
  let basename = randomCode(25, '0aA')
  let inputUrl = saveFile(file, '/gift', basename)
  ctx.body = {
    path: inputUrl,
    url: process.env.STATIC_URL + inputUrl
  }
})
// 上传的文章图片[后台]
uploadRouter.post('/mana/article', authUse, authMana, upload.single('file'), async function(ctx, next) {
  const {file} = ctx
  let basename = randomCode(25, '0aA')
  let inputUrl = saveFile(file, '/article', basename)
  ctx.body = {
    path: inputUrl,
    url: process.env.STATIC_URL + inputUrl
  }
})
// 上传的商品图片[后台]
uploadRouter.post('/mana/product', authUse, authMana, upload.single('file'), async function(ctx, next) {
  const {file} = ctx
  let basename = randomCode(25, '0aA')
  let inputUrl = saveFile(file, '/product', basename)
  ctx.body = {
    path: inputUrl,
    url: process.env.STATIC_URL + inputUrl
  }
})


export default uploadRouter