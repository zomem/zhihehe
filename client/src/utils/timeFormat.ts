

// 时间戳   =>   1小时前
export const pastTime = (datetime: string) => {
  if(!datetime) return
  let timeStamp = new Date(datetime).getTime() / 1000
  var minute = 60
  var hour = minute * 60
  var day = hour * 24
  var month = day * 30
  var year = month * 12
  var now = Math.round(new Date().getTime() / 1000)
  var diffValue = now - timeStamp
  var result = ''
  if (diffValue < 0) return
  var yearC = diffValue / year >>> 0
  var monthC = diffValue / month >>> 0
  var weekC = diffValue / (7 * day) >>> 0
  var dayC = diffValue / day >>> 0
  var hourC = diffValue / hour >>> 0
  var minC = diffValue / minute >>> 0

  if (yearC >= 1) {
    result = yearC + "年前";
  }
  else if (monthC >= 1) {
    result = monthC + "个月前"
  }
  else if (weekC >= 1) {
    result = weekC + "周前"
  }
  else if (dayC >= 1) {
    result = dayC + "天前"
  }
  else if (hourC >= 1) {
    result = hourC + "小时前"
  }
  else if (minC >= 1) {
    result = minC + "分钟前"
  } else
    result = "刚刚"
  return result
}



// 时间戳   =>   
export const dateTime = (datetime: string, type: 'dateTime' | 'date' | 'time') => {
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















