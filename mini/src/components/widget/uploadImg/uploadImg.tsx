import React, {useCallback, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'

import ICON_DELETE_X from '@/images/icons/tip_error.svg'
import {upload} from '@/constants/fetch'

import './uploadImg.scss'

interface IUploadImgProps {
  disable?: boolean
  imgList?: string[]
  pathList?: string[]
  onChange?: Function
  num?: number //最多上传多少张
  uploadUrl: string
  compressed?: boolean
  maxKb?: number   // 图片最大
}

function UploadImg (props: IUploadImgProps) {

  const {styles} = useSelector((state: ReduxState) => state)
  const dispatch = useDispatch()
  const {disable=false, uploadUrl, imgList=[], pathList=[], onChange=()=>{}, num=9, compressed=true, maxKb} = props

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
    <View className='upload-img'>
      {
        disable ? 
        <View>
          {
            imgList.map((item, index) => (
              <View 
                className='upload-img-item'
                key={item}
              >
                <Image 
                  className='img-item _animate_enlarge120_show' 
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
        </View>
        :
        <View>
          {
            imgList.map((item, index) => (
              <View className='upload-img-item' key={item}>
                <Image 
                  className='img-item _animate_enlarge120_show' 
                  style={{
                    animationDelay: index * 0.08+'s',
                  }}
                  onClick={() => {preview(item)}} 
                  mode='aspectFill' 
                  src={item} 
                />
                <Image onClick={() => {deleteImg(index)}} className='delete-img' src={ICON_DELETE_X}></Image>
              </View>
            ))
          }
          {
            imgList.length < num &&
            <View className='_img_add_all'>
              <View 
                className='_img_upload _animate_enlarge120_show fccc' 
                style={{
                  backgroundColor: styles.boxColor
                }}
                onClick={() => {
                  if(loading) return
                  selectImg()
                }}
              >
                <View 
                  className='img-add _animate_font_size_enlarge66_show fccc'
                  style={{
                    animationDelay: imgList.length * 0.08+'s',
                  }}
                >
                  {loading ? '...' : '+'}
                </View>
              </View>
            </View>
          }
        </View>
      }
    </View>
  )
}


export default UploadImg