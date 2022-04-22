import React, { useEffect, useState } from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {useSelector, useDispatch} from 'react-redux'
import {Block, Box, Text, Textarea, Button, Line, Flex} from '@/components/widget/Components'

import StarTap from '@/components/widget/StarTap'
import UploadImage from '@/components/widget/UploadImage'
import Page from '@/components/widget/Page'
import Card from '@/components/widget/Card'

import {post} from '@/constants/fetch'


interface Comment {
  star: number
  content: string
  img_urls: string[]
  video_url: string
  paths: string[]
}

export default function () {
  const {styles} = useSelector((state: ReduxState) => state)
  const dispatch = useDispatch()

  const [options, setOptions] = useState<{title?: string, pid?: number}>({})

  const [comment, setComment] = useState<Comment>({
    star: 0,
    content: '',
    img_urls: [],
    paths: [],
    video_url: ''
  })

  useEffect(() => {
    const instance = getCurrentInstance()
    let title = instance.router?.params.title
    let pid = parseInt(instance.router?.params.pid || '0')

    setOptions({
      title,
      pid
    })
  }, [])


  const commentIt = () => {
    if(options.pid === 0) return false
    if(comment.star < 1 || comment.star > 5){
      return Taro.showToast({title: '请点击评分', icon: 'error'})
    }
    post('/zhihehe/comment/add', {
      star: comment.star,
      pid: options.pid,
      content: comment.content,
      paths: comment.paths,
    }, dispatch).then(res => {
      if(res.data.status === 2){
        Taro.showToast({title: '评价成功', icon: 'none'})
        setTimeout(() => {
          Taro.navigateBack()
        }, 1000)
      }else{
        Taro.showToast({title: '评价失败', icon: 'error'})
      }
    })
  }

  return (
    <Page navTitle={options.title ? `对【${options.title}】评价` : '商品评价'} padding='25'>
      <Card padding='25 25 0 25' frontTxt='您对这件商品还满意吗' afterTxt='请勿恶意评价，或者评论与商品无关的内容，否则会影响您在本平台的信誉。'>
        <StarTap
          score={comment.star}
          onChange={(num) => {
            setComment(prev => ({
              ...prev,
              star: num
            }))
          }}
        />
        <Textarea
          value={comment.content}
          bgColor={styles.boxColorGray}
          color={styles.textColor}
          radius='20'
          margin='15 0 25 0'
          padding='15'
          placeholder='留言'
          onInput={(value) => {
            setComment(prev => ({
              ...prev,
              content: value
            }))
          }}
        />
        
        <UploadImage
          imgList={comment.img_urls}
          pathList={comment.paths}
          radius='20'
          uploadUrl='/upload/comment'
          onChange={(imgs, paths) => {
            console.log(imgs, paths)
            setComment(prev => ({
              ...prev,
              img_urls: imgs,
              paths: paths
            }))
          }}
        />
      </Card>


      <Line size='100% 50' />

      <Flex flex='frcc' size='100% auto'>
        <Button
          size='480 86'
          bgImage='linear-gradient(to right , #51b875, #36a65d);'
          radius='43'
          onClick={() => {
            commentIt()
          }}
        >
          提交评价
        </Button>
      </Flex>
    </Page>
  )
}