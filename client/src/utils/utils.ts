

// 将img的宽度自动改成100%，和去掉前面回车
export const braftHtmlCorrect = (html: string) => {
  let tempHtml = html
  let imgReg = /<img.*?(?:>|\/>)/gi;
  // let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/gi
  // let srcArr = html.match(srcReg)
  let imgArr = html.match(imgReg) || [], tempImgArr = []
  for(let i = 0; i < imgArr.length; i++){
    let tempImg = ''
    if(imgArr[i].indexOf('style') === -1){
      tempImg = imgArr[i].replace('/>', ' style="width: 100%; display: block;" />')
    }else{
      tempImg = imgArr[i].replace(/style=".*?"/, 'style="width: 100%; display: block;"')
    }
    tempHtml = tempHtml.replace(imgArr[i], tempImg)
  }
  tempHtml = tempHtml.replace(/<p><\/p><div class="media-wrap image-wrap">/gi, '<div class="media-wrap image-wrap">')
  return tempHtml
}


// 将图片间的空格还原
export const braftHtmlCorrectRe = (html: string) => {
  let tempHtml = html
  tempHtml = tempHtml.replace(/<p><\/p><div class="media-wrap image-wrap">/gi, '<p></p><div class="media-wrap image-wrap">')
  return tempHtml
}