
const fs = require('fs')
const path = require('path')




// ncc 打包相对路径的校正. 如果是当前目录下的非代码文件，则可以不用此矫正
export const nccPath = (devPath: string, prodPath: string) => {
  if (process.env.NODE_ENV === "development") {
    return devPath
  }else{
    return prodPath
  }
}


// file为  multer 包处理后的file。
export const saveFile = (file: any, localPath: string, fileName?: string | number) => {
  let data = fs.readFileSync(file.path)
  let extname = file.originalname.substring(file.originalname.lastIndexOf('.')+1)
  let savename = fileName ? (fileName + '.' + extname) : file.originalname
  fs.writeFileSync(path.join(__dirname, nccPath('../static', './static') + localPath + '/' + savename), data)
  fs.unlinkSync(path.join(__dirname, nccPath('../uploads/', './uploads/') + file.filename))
  let baseUrl = localPath + '/' + savename
  return baseUrl
}



// 删除文件
export const deleteFile = (pathUrl: string) => {
  if (!fs.existsSync(path.join(__dirname, nccPath('../static', './static') + pathUrl))) {
    return true
  }
  fs.unlinkSync(path.join(__dirname, nccPath('../static', './static') + pathUrl))
  return true
}
