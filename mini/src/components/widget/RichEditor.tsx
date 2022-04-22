import React, {} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Taro from '@tarojs/taro'
import {Editor} from '@tarojs/components'
import {Box, Image, Flex} from '@/components/widget/Components'


import {upload} from '@/constants/fetch'

import ICON_EDIT_IMG from '@/components/widget/icons/edit_img.svg'

interface RichEditorProps {
  html?: string   //初始时的html
  uploadUrl?: string
  onInput?: Function
  height?: string
  compressed?: boolean
  maxKb?: number   // 图片最大
}


let editorCtx


function RichEditor(props: RichEditorProps) {
  

  const dispatch = useDispatch()
  const {styles} = useSelector((state: ReduxState) => state)
  const {html, uploadUrl='', onInput=() => {}, height='860', compressed=true, maxKb} = props

  const editorReady = e => {
    Taro.createSelectorQuery().select('#editor').context((res) => {
      editorCtx = res.context
      editorCtx.setContents({
        html: html
      })
    }).exec()
  }

  const undo = e => {
    editorCtx.undo()
  }

  const insertImg = e => {
    Taro.showLoading()
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
        upload(uploadUrl, tempFilePath, dispatch).then(res => {
          Taro.hideLoading()
          let imgData = res.data
          editorCtx.insertImage({
            src: imgData.url,
            width: '100%',
            height: 'auto',
            extClass: '_rich_text_img'
          })
        }, err => {Taro.hideLoading()})
      },
      complete: () => {
        Taro.hideLoading()
      }
    })
  }

  return(
    <Box>
      {/* <Box type='warn' onClick={undo}>撤销</Box> */}
      <Flex size='80 80' flex='frcc' onClick={insertImg} display='inline-block' bgColor={styles.boxColorGray} margin='0 0 15 0'>
        <Image src={ICON_EDIT_IMG} size='43 43' />
      </Flex>
      <Editor
        style={{
          backgroundColor: styles.boxColor,
          height: height + 'rpx'
        }}
        id='editor'
        placeholder='写文章...'
        showImgSize={true}
        showImgToolbar={true}
        onReady={editorReady}
        onInput={(e) => {
          onInput(e.detail.html, e.detail.text)
        }}
      />
      
    </Box>
  )
}


export default RichEditor