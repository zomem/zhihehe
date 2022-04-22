// const sharp = require("sharp")
// const path = require('path')
// const fs = require('fs')
// import {nccPath} from './file'


// interface ImageResize {
//   /** 输入的图片完整路径 */
//   inputImage: string
//   /** 输出的文件夹，在static下面的  */
//   outputFolder?: string
//   /** 输入的图片新名字 */
//   outputName?: string
//   /** 更改图片宽度，不填则自适应 */
//   width?: number
//   /** 更改图片高度，不填则自适应 */
//   height?: number
//   /** 压缩度，越大，压缩越狠 */
//   compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
//   /** 是否删除旧的图片 默认为 false */
//   deleteOld?: boolean
// }


// /**
//  * 
//  * 图片处理，使用的是 sharp 库
//  * https://www.npmjs.com/package/sharp
//  * 
//  * 
//  * @example
//     imageResize({
//       inputImage: '/images/8t.png',
//       outputFolder: '/some/folder',
//       outputName: '323',
//       width: 180,
//       compressionLevel: 9,
//     })
//  */
// export const imageResize = async (params: ImageResize) => {
//   const {inputImage, outputName, outputFolder, width, height, compressionLevel = 2, deleteOld=false} = params
//   let tempI = inputImage.lastIndexOf('/') + 1
//   let oriname = inputImage.substring(tempI)
//   let outpath = outputFolder || inputImage.substring(0, tempI - 1)

//   let extname = inputImage.substring(inputImage.lastIndexOf('.') + 1)
//   let outname = outputName ? outputName + '.' + extname : 'min_' + oriname

//   let data = await sharp(path.join(__dirname, nccPath('../static', './static') + inputImage))
//     .resize({width: width, height: height})
//     .jpeg({ quality: (10 - compressionLevel) * 10, force: false })
//     .png({ compressionLevel: compressionLevel, force: false })
//     .webp({quality: (10 - compressionLevel) * 10, force: false})
//     .toFile(path.join(__dirname, nccPath('../static', './static') + outpath + '/' + outname))

//   if(deleteOld){
//     fs.unlinkSync(path.join(__dirname, nccPath('../static', './static') + inputImage))
//   }
//   return {
//     path: outpath + '/' + outname,
//     fileData: data,
//   }
// }

