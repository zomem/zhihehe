


//将时间戳转为 几小时，几分，几秒
function timeStampToHours(stamp){
  let h = stamp / 3600 >>> 0
  let m = (stamp % 3600) / 60 >>> 0
  //let s = stamp % 60
  return `${h}小时${m}分钟`
}


//将数组对象里的某个字段转成数组
function objectToArray(obj=[], j){
  let tempA = []
  for(let i = 0; i < obj.length; i++){
    tempA.push(obj[i][j])
  }
  return tempA
}

//便民服务圈，将数据转成markers，在地图上显示
function toMarkers (data) {
  let markers: any = []
  for(let i = 0; i < data.length; i++){
    let o = {
      iconPath: data[i].nearby_cat_id.icon.path || '',
      id: i,
      latitude: data[i].addr_point.coordinates[1],
      longitude: data[i].addr_point.coordinates[0],
      width: '64rpx',
      height: '64rpx'
    }
    markers.push(o)
  }
  return markers
}

//赛选marker
function changeMarkers(sid, data){
  let markers: any = []
  for(let i = 0; i < data.length; i++){
    if(data[i].nearby_cat_id.id !== sid){
      continue
    }
    let o = {
      iconPath: data[i].nearby_cat_id.icon.path || '',
      id: i,
      latitude: data[i].addr_point.coordinates[1],
      longitude: data[i].addr_point.coordinates[0],
      width: '64rpx',
      height: '64rpx'
    }
    markers.push(o)
  }
  return markers
}

//手机号检测
function checkPhone(phone){
  return /^1[3456789]\d{9}$/.test(phone)
}

//将生日转换成多少岁
var formatAge = function (birthday){
  var nowTime = Date.parse(new Date().toString()) / 1000
  var ageSec = nowTime - birthday
  return (ageSec / ( 24 * 3600 * 365)) >>> 0
}


module.exports = {
  objectToArray: objectToArray,
  toMarkers: toMarkers,
  changeMarkers: changeMarkers,
  checkPhone: checkPhone,
  formatAge: formatAge,
}







