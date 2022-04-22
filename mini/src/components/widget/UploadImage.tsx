import React, {useCallback, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import {View, Image, Block} from '@tarojs/components'
import {ZPX} from '@/constants/constants'

import ICON_DELETE_X from '@/images/icons/tip_error.svg'
import {upload} from '@/constants/fetch'

import './widget.scss'

interface UploadImageProps {
  radius?: string
  disable?: boolean
  imgList?: string[]
  pathList?: string[]
  onChange?: Function
  num?: number //最多上传多少张
  uploadUrl?: string
  compressed?: boolean
  maxKb?: number   // 图片最大
}

function UploadImage (props: UploadImageProps) {
  const dispatch = useDispatch()
  const {styles} = useSelector((state: ReduxState) => state)
  const {disable=false, uploadUrl='', imgList=[], pathList=[], onChange=()=>{}, num=9, compressed=true, maxKb, radius='0'} = props

  const [loading, setLoading] = useState(false)
  
  /**
   * 上传图片
   */
  const selectImg = useCallback(() => {
    Taro.chooseImage({
      count: 1,
      sizeType: [compressed ? 'compressed' : 'original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        let tempFilePath = res.tempFilePaths[0]
        let tempFile = res.tempFiles[0]
        if(maxKb){
          if(tempFile.size > maxKb * 1024){
            return Taro.showToast({title: `图片不能超过 ${maxKb}kb`, icon: 'none'})
          }
        }
        setLoading(true)
        upload(uploadUrl, tempFilePath, dispatch).then(res => {
          setLoading(false)
          let imgData = res.data
          if(imgData.url && imgData.path){
            let tempImgs = [...imgList]
            let tempPaths = [...pathList]
            tempImgs.push(imgData.url)
            tempPaths.push(imgData.path)
            onChange(tempImgs, tempPaths)
          }
        })
      }
    })
  }, [uploadUrl, imgList])



  function deleteImg(index){
    let tempImgs = [...imgList]
    let tempPaths = [...pathList]
    tempImgs.splice(index, 1)
    tempPaths.splice(index, 1)
    onChange(tempImgs, tempPaths)
  }

  function preview(url){
    Taro.previewImage({
      current: url,
      urls: imgList
    })
  }

  return (
    <View className='_upload_image'>
      {
        disable ? 
        <Block>
          {
            imgList.map((item, index) => (
              <View 
                className='_upload_image_item'
                key={item}
                style={{
                  marginRight: (index + 1) % 3 === 0 ? '0rpx' : '25rpx',
                  borderRadius: props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX
                }}
              >
                <Image 
                  className='_upload_image_i _upload_image_animate_show' 
                  style={{
                    animationDelay: index * 0.08+'s',
                  }}
                  onClick={() => {preview(item)}} 
                  mode='aspectFill' 
                  src={item} 
                />
              </View>
            ))
          }
        </Block>
        :
        <Block>
          {
            imgList.map((item, index) => (
              <View className='_upload_image_item' key={item} style={{marginRight: (index + 1) % 3 === 0 ? '0rpx' : '25rpx', borderRadius: props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX}}>
                <Image 
                  className='_upload_image_i _upload_image_animate_show' 
                  style={{
                    animationDelay: index * 0.08+'s',
                  }}
                  onClick={() => {preview(item)}} 
                  mode='aspectFill' 
                  src={item} 
                />
                <Image onClick={() => {deleteImg(index)}} className='_upload_image_delete_img' src={ICON_DELETE_X}></Image>
              </View>
            ))
          }
          {
            imgList.length < num &&
            <View className='_upload_image_add_all' style={{marginRight: '0rpx', borderRadius: props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX}}>
              <View 
                className='_upload_image_upload _upload_image_animate_show'
                style={{backgroundColor: styles.boxColorGray, borderRadius: props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX}}
                onClick={() => {
                  if(loading) return
                  selectImg()
                }}
              >
                <View 
                  className='_upload_image_add _upload_image_animate_font_size_show'
                  style={{
                    animationDelay: imgList.length * 0.08+'s',
                    color: styles.textColorGray
                  }}
                >
                  {loading ? '上传中...' : <Image style={{width: '48rpx', height: '48rpx'}} src={styles.iconUpload} />}
                </View>
              </View>
            </View>
          }
        </Block>
      }
    </View>
  )
}


export default UploadImage