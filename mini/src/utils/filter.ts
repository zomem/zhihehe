import {Decimal} from 'decimal.js'

export const textCut = (txt: string, maxl: number=50) => {
  if(!txt){
    return ''
  }
  if(txt.length <= maxl){
    return txt
  }else{
    return txt.substring(0, maxl-2) + '...'
  }
}



//将数组对象里的摸个元素提取成数组
// [{a: '1', b: '2'}, {a: '4', b: '23'}], a  =>  ['1', '4']
export const arrayItemToArray = (objs, key) => {
  let newA: any[] = []
  for(let o of objs){
    newA.push(o[key])
  }
  return newA
}


//价格保留两位
export const priceShow = (p) => {
  return p.toFixed(2)
}

//检测数组对象里，[key] = ?value
// [{a: '1', b: '2'}, {a: '4', b: '23'}], a, '1'  =>  {isHave: true, ...}
export const isKeyEqual = (arr, key, value) => {
  let isHave = false, theItem = {}, theIndex = -1
  for(let i = 0; i < arr.length; i++){
    if(arr[i][key] === value){
      isHave = true
      theItem = arr[i]
      theIndex = i
      break
    }
  }
  return {
    isHave,
    theItem,
    theIndex
  }
}



//从数组中，取出某个字段为某个的值 [key]=value
// [{a: '1', b: '2'}, {a: '4', b: '23'}], a, '1'  =>  {a: '1'}
export const getKeyItem = (list, key, value) => {
  for(let i = 0; i < list.length; i++){
    if(list[i][key] === value) {
      return list[i]
    }
  }
  return {}
}

//计算数组对象的值   统计价格等
// [{a: 1, b: 2}, {a: 4, b: 23}], 'a', 2  =>  5.00
export const addKeyItem = (list, key, n) => {
  let r = 0
  for(let i = 0; i < list.length; i++){
    r = r + list[i][key]
  }
  return parseFloat(r.toFixed(n))     //保留两位小数
}



//从数组中，删除指定元素
// [a, b, c] b => [a, c]
export const deleteArrItem = (arr, item) => {
  let index = -1
  for(let i = 0; i < arr.length; i++){
    if(arr[i] === item){
      index = i
      break
    }
  }
  if(index > -1){
    arr.splice(index, 1)
    return arr
  }else{
    return arr
  }
}


//从数组中，查找是否有指定obj的key的value
// [{a: 1, b: 3}]  {a: 2}  a  =>  false  没有a值为2的item
export const isHaveArrObj = (arr, item, name) => {
  for(let i = 0; i < arr.length; i++){
    if(arr[i][name] === item[name]){
      return true
    }
  }
  return false
}

//从数组中，删除同指定obj的key相同的value的值
// [{a: 1, b: 3}]  {a: 1}  a  =>  [{b: 3}]  
export const deleteArrObj = (arr, item, name) => {
  let index = -1
  for(let i = 0; i < arr.length; i++){
    if(arr[i][name] === item[name]){
      index = i
      break
    }
  }
  if(index > -1){
    arr.splice(index, 1)
    return arr
  }else{
    return arr
  }
}







//本地搜索，，数组对象  元素包含
export const searchKey = (objs, name, key) => {
  let tempObjs: any = []
  for(let i = 0; i < objs.length; i++){
    if(objs[i][name].indexOf(key) > -1){
      tempObjs.push(objs[i])
    }
  }
  return tempObjs
}



// 生成商品定价 
export const salePrice = (cost:number=0, fscost:number=0, scost:number=0, percent:number): number => {
  let all = new Decimal(cost).add(new Decimal(scost)).add(new Decimal(fscost))
  return new Decimal(percent).mul(all).toNumber()
}


// 将base64图片转成微信本地图片
export const base64ToLocal = (base64): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fs = wx.getFileSystemManager()
    const filePath = wx.env.USER_DATA_PATH + '/base64_wxcode.png'
    fs.writeFile({
      filePath: filePath,
      data: base64,
      encoding:"base64",
      success() {
        resolve(filePath)
      }
    })
  })
}