import React, {ReactNode, useState, useEffect} from 'react'
import Taro, { connectSocket, nextTick } from '@tarojs/taro'
import { View, Canvas, Text } from '@tarojs/components'
import {Button, Box, Flex} from '@/components/widget/Components'
import './widget.scss'

interface IModalQRCode {
  type?: 'default'
  isShow?: boolean
  time?: string
  address?: string
  price?: string
  avatar?: string
  nickName?: string
  title?: string
  codeUrl: string
  topUrl: string
  username?: string
  des?: string
  onCancel?: () => void
  onConfirm?: (e?: any) => void
  cancelTxt?: string
  confirmTxt?: string
}

let animation = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration:500,
  timingFunction: "ease",
  delay: 0
})

let _canvas

function ModalQRCode(props: IModalQRCode) {

  const {windowHeight, windowWidth} = Taro.getSystemInfoSync()

  const {
    des='',
    time='',
    address='',
    type='default',
    avatar='',
    price='',
    nickName='',
    isShow=false,
    title='',
    username='',
    codeUrl='',
    topUrl='',
    onCancel=() => {}, 
    onConfirm=() => {},
    cancelTxt='取消',
    confirmTxt='确定',
  } = props
  
  const [animate, setAnimate] = useState<Animate>({actions: []})
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if(isShow){
      setSize({
        width: windowWidth,
        height: windowHeight,
      })
      animation.opacity(1).step()
      setAnimate(animation.export())
    }else{
      animation.opacity(0).step()
      setAnimate(animation.export())
      setTimeout(() => {
        setSize({
          width: 0,
          height: 0,
        })
      }, 300);
    }
  }, [isShow, windowWidth, windowHeight])

  
  
  useEffect(() => {
    
    function draw(node) {
      // Canvas 实例
      const canvas = node[0].node
      _canvas = canvas
      // Canvas 的绘图上下文
      const ctx = canvas.getContext('2d')
  
      // 设备像素比
      // 这里根据像素比来设置 canvas 大小
      const dpr = (750 / Taro.getSystemInfoSync().windowWidth)
      canvas.width = node[0].width * dpr
      canvas.height = node[0].height * dpr
      ctx.scale(dpr, dpr)
  
      // 解决下载来的图片是黑色背景的问题
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, node[0].width, node[0].height)

      let tempTitle = ['', '', '']
      if(title.length > 20){
        tempTitle[0] = title.substring(0, 10)
        tempTitle[1] = title.substring(10, 20)
        tempTitle[2] = title.substring(20, 30)
      }else if(title.length > 10){
        tempTitle[0] = title.substring(0, 10)
        tempTitle[1] = title.substring(10, 20)
      }else{
        tempTitle[0] = title
      }
    

      // ctx.font = '12px'
      // ctx.fillStyle = '#646464'
      // ctx.fillText('保存至相册 分享到朋友圈', 172/dpr, 780/dpr)


      // 获取顶部背景图片
      Taro.downloadFile({
        url: topUrl, 
        success: function (res) {
          if (res.statusCode === 200) {
            Taro.getImageInfo({
              src: res.tempFilePath,
              success: resImg => {
                // 创建一个图片对象
                let img = canvas.createImage();
                img.src = res.tempFilePath
                img.onload = () => {
                  // 绘制图像到画布
                  ctx.drawImage(img, 0, 0, resImg.width, resImg.height, 0, 0, node[0].width, node[0].width)

                  ctx.font = '16px'
                  ctx.fillStyle = '#000000'
                  //let tempX = (canvas.width - 31 * tempTitle[0].length)/2/dpr
                  if(tempTitle[2]){
                    ctx.fillText(tempTitle[0], 50/dpr, node[0].width + 60/dpr)
                    ctx.fillText(tempTitle[1]+'...', 50/dpr, node[0].width + 95/dpr)
                    ctx.font = '13px'
                    ctx.fillStyle = '#8a8a8a'
                    ctx.fillText(des, 50/dpr, node[0].width + 121/dpr)
                    ctx.font = '16px'
                    ctx.fillStyle = '#ef5249'
                    ctx.fillText('￥'+price, 50/dpr, node[0].width + 153/dpr)
                  }else if(tempTitle[1]){
                    ctx.fillText(tempTitle[0], 50/dpr, node[0].width + 60/dpr)
                    ctx.fillText(tempTitle[1], 50/dpr, node[0].width + 95/dpr)
                    ctx.font = '13px'
                    ctx.fillStyle = '#8a8a8a'
                    ctx.fillText(des, 50/dpr, node[0].width + 121/dpr)
                    ctx.font = '16px'
                    ctx.fillStyle = '#ef5249'
                    ctx.fillText('￥'+price, 50/dpr, node[0].width + 153/dpr)
                  }else{
                    ctx.fillText(tempTitle[0], 50/dpr, node[0].width + 70/dpr)
                    ctx.font = '13px'
                    ctx.fillStyle = '#8a8a8a'
                    ctx.fillText(des, 50/dpr, node[0].width + 109/dpr)
                    ctx.font = '16px'
                    ctx.fillStyle = '#ef5249'
                    ctx.fillText('￥'+price, 50/dpr, node[0].width + 150/dpr)
                  }

                  
                }

                //小程序码
                Taro.getImageInfo({
                  src: codeUrl,
                  success: resImg => {
                    // 创建一个图片对象
                    let img = canvas.createImage();
                    img.src = codeUrl
                    img.onload = () => {
                      // 绘制图像到画布
                      ctx.drawImage(img, 0, 0, resImg.width, resImg.height, node[0].width - 250/dpr, node[0].width + 28/dpr, 200 / dpr, 200 / dpr)
                    }
                    //用户头像
                    Taro.downloadFile({
                      url: avatar, 
                      success: function (res) {
                        if (res.statusCode === 200) {
                          Taro.getImageInfo({
                            src: res.tempFilePath,
                            success: resImg => {
                              // 创建一个图片对象
                              let img = canvas.createImage();
                              img.src = res.tempFilePath
                              img.onload = () => {
                                // 绘制图像到画布
                                //ctx.drawImage(img, 0, 0, resImg.width, resImg.height, 213 / dpr, 400 / dpr, 36 / dpr, 36 / dpr)
                              
                                var x= 50 / dpr + 15, y = node[0].width + 198 / dpr, r=15;
                                ctx.font = '13px'
                                ctx.fillStyle = '#303030'
                                ctx.fillText(nickName, 116/dpr, node[0].width + 199 / dpr)
                                
                                ctx.beginPath();
                                ctx.arc(x, y, r, 0, Math.PI * 2, false);
                                ctx.clip();
                                ctx.drawImage(img, x-r,y-r, 2*r, 2*r);
                                
                              }
                            }
                          })
                        }
                      },
                      fail: (err) => {
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    }

    if(size.width > 0 && codeUrl && topUrl){
      const query = Taro.createSelectorQuery()
      query.select('#canvas').fields({ node: true, size: true }).exec((res) => {draw(res)});
    }
  }, [size.width, title, username, codeUrl, topUrl, price])

  return(
    <View
      animation={animate}
      style={{
        width: size.width + 'PX',
        height: size.height + 'PX',
      }}
      className='_modalQR_back'
      onClick={() => {
        onCancel()
      }}
    >
      <View 
        className='_modalQR_content'
        style={{width: size.width > 0 ? '625rpx' : '0'}}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Canvas 
          id='canvas' 
          className='_modal_QR_canvas' 
          type='2d'
          style={{
            position: 'absolute',
            top: size.width ? 0 : '-1000rpx',
            left: size.width ? 0 : '-860rpx'
          }}
        />
        <View className='_modal_QR_canvas_b'></View>
        <Flex padding='25 0' flex='fcbc'>
          <Text className='fc3c fs13' style={{marginBottom: '20rpx', color: '#1a1a1a'}}>销售商品分享码 保存至相册</Text>
          <Button
            size='306 84'
            radius='42'
            bgImage='linear-gradient(to right , #36a65d, #51b875)'
            onClick={() => {
              Taro.canvasToTempFilePath({
                canvas: _canvas,
                success(res) {
                  Taro.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                      Taro.showToast({
                        title: '保存成功',
                        icon: 'success'
                      })
                    }
                  })
                }
              })            
            }}
          >
            保存图片
          </Button>
        </Flex>
      </View>
    </View>
  )
}


export default ModalQRCode