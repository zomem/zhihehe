
import {Decimal} from 'decimal.js'
import {DEFAULT_IMG, ROLE_OBJ} from '../constants/constants'


//    =>   
export const dateTime = (datetime, type: 'dateTime' | 'date' | 'time') => {
  let date = new Date(datetime)
  let Y = date.getFullYear()
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

  switch (type) {
    case 'date':
      return `${Y}-${M}-${D}`
    case 'dateTime':
      return `${Y}-${M}-${D} ${h}:${m}:${s}`
  }
}


// 获取当前时间  2021-4-7 16:25:21 
export const getTime = (type: 'date' | 'date_time' | 'stamp', stamp?: number) => {
  let nowTime = stamp ? new Date(stamp) : new Date()

  let Y = nowTime.getFullYear()
  let M = nowTime.getMonth() + 1 < 10 ? '0' + (nowTime.getMonth() + 1) : (nowTime.getMonth() + 1)
  let D = nowTime.getDate() < 10 ? '0' + nowTime.getDate() : nowTime.getDate()
  let h = nowTime.getHours() < 10 ? '0' + nowTime.getHours() : nowTime.getHours()
  let m = nowTime.getMinutes() < 10 ? '0' + nowTime.getMinutes() : nowTime.getMinutes()
  let s = nowTime.getSeconds() < 10 ? '0' + nowTime.getSeconds() : nowTime.getSeconds()

  switch (type) {
    case 'date':
      return `${Y}-${M}-${D}`
    case 'date_time':
      return `${Y}-${M}-${D} ${h}:${m}:${s}`
    case 'stamp':
      return nowTime.getTime()
    default:
      return nowTime.getTime()
  }
}


// 随机字符串  l为长度，type为类型
export const randomCode = (len, type?: '0' | 'a' | 'A' | '0a' | '0A' | 'aA' | '0aA') => {
  let list: string[] = []
  const num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const word1 = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z'
  ]
  const word2 = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
  ]
  switch(type){
    case '0':
      list = num
      break
    case 'a':
      list = word1
      break
    case 'A':
      list = word2
      break
    case '0a':
      list = num.concat(word1)
      break
    case '0A':
      list = num.concat(word2)
      break
    case 'aA':
      list = word1.concat(word2)
      break
    case '0aA':
      list = num.concat(word1).concat(word2)
      break
    default:
      list = num
      break
  }

  
  let ecode = ''
  for(let i = 0; i < len; i++){
    let ran = (Math.random() * list.length) >>> 0
    ecode = ecode + list[ran]
  }
  return ecode
}






interface ImgQuery{
  is_mini?: boolean
  set_default?: 'AVATAR' | 'IMG_ERR'
}
// 将图片url转成图片数组, 默认,号分隔
export const toImgListUrls = (objs, key, query: ImgQuery = {}) => {
  const {is_mini=false, set_default} = query
  let temp: any = []
  for(let o of objs){
    let tempOb = o
    if(o[key]){
      let oimgs = o[key].split(',')
      let arr: string[] = []
      for(let j = 0; j < oimgs.length; j++){
        if(oimgs[j]){
          arr.push(process.env.STATIC_URL + (is_mini ? '/mini' : '' ) + oimgs[j])
        }
      }
      tempOb[key] = arr
    }else{
      tempOb[key] = set_default ? [DEFAULT_IMG[set_default]] : []
    }
    temp.push(tempOb)
  }
  return temp
}
// 将图片url转换成完整链接 objs为数组
export const toImgUrls = (objs, key, query: ImgQuery = {}) => {
  const {is_mini=false, set_default} = query
  let temp: any = []
  for(let o of objs){
    let tempOb = o
    if(tempOb[key]){
      tempOb[key] = process.env.STATIC_URL + (is_mini ? '/mini' : '' ) + o[key]
    }else{
      tempOb[key] = set_default ? DEFAULT_IMG[set_default] : ''
    }
    temp.push(tempOb)
  }
  return temp
}
// 将图片url多个转换成完整链接 obj为对象
export const toImgListUrl = (obj, key, query: ImgQuery = {}) => {
  const {is_mini=false, set_default} = query
  let tempOb = obj
  if(obj[key]){
    let tempimgs = obj[key].split(','), arr: string[] = []
    for(let i = 0; i < tempimgs.length; i++){
      arr.push(process.env.STATIC_URL + (is_mini ? '/mini' : '' ) + tempimgs[i])
    }
    tempOb[key] = arr
  }else{
    tempOb[key] = set_default ? [DEFAULT_IMG[set_default]] : []
  }
  return tempOb
}
// 将图片url转换成完整链接 obj为对象
export const toImgUrl = (obj, key, query: ImgQuery = {}) => {
  const {is_mini=false, set_default} = query
  let tempOb = obj
  if(tempOb[key]){
    tempOb[key] = process.env.STATIC_URL + (is_mini ? '/mini' : '' ) + obj[key]
  }else{
    tempOb[key] = set_default ? DEFAULT_IMG[set_default] : ''
  }
  return tempOb
}



// 判断用户是不是指定角色
export const isRole = (roleName: RoleName, role: string): boolean => {
  let isrole: boolean = false
  if(!role){
    return isrole
  }
  let arr: string[] = role.split(',')
  for(let a of arr){
    if(ROLE_OBJ[a]?.en === roleName) isrole = true
  }
  return isrole
}

export const roleName = (role: string): string[] => {
  let name:string[] = []
  if(!role){
    return []
  }
  let arr: string[] = role.split(',')
  for(let a of arr){
    name.push(ROLE_OBJ[a]?.zh)
  }
  return name
}



// 生成商品定价 
export const salePrice = (cost:number=0, fscost:number=0, scost:number=0, percent): number => {
  return new Decimal(cost).add(new Decimal(scost)).add(new Decimal(fscost)).mul(new Decimal(percent)).toNumber()
}


//isArray属于isJson
export const isArray = (value: any) => {
  return Object.prototype.toString.call(value) === '[object Array]'
}