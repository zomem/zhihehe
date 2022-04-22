import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Taro from '@tarojs/taro'

import ColorButton from '@/components/widget/colorButton/colorButton'
import Page from '@/components/widget/Page'


import RichEditor from '@/components/widget/RichEditor'

import {Box, Flex, Block, Input, Text, Line} from '@/components/widget/Components'
import UploadImg from '@/components/widget/uploadImg/uploadImg'

import {isRole} from '@/utils/authorize'

import {post} from '@/constants/fetch'

function Publish() {

  const {currentUser} = useSelector((state: ReduxState) => state)
  
  const dispatch = useDispatch()
  const [edit, setEdit] = useState({
    title: '',
    img_urls: [],
    img_paths: [],
    html: '',
  })
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState({
    pdid: 0
  })

  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const pdid = parseInt(instance?.router?.params.pdid || '0')
    setOptions({pdid}) 
  }, [])
  
  useEffect(() => {
      // fetchGet('/zhihehe/article/draft_init', dispatch).then(res => {
      //   if(res.data.id){
      //     setEdit({
      //       title: res.data.article_title,
      //       img_urls: res.data.article_img_urls,
      //       img_paths: res.data.article_img_paths,
      //       html: res.data.article_html,
      //     })
      //   }
      // })
  }, [])

  const onSend = () => {
    if(!edit.title){
      return Taro.showToast({title: '请输入商品名称', icon: 'none'})
    }
    if(edit.img_paths.length === 0){
      return Taro.showToast({title: '请输入图片', icon: 'none'})
    }
    if(!edit.html){
      return Taro.showToast({title: '请输入详情', icon: 'none'})
    }
    if(!options.pdid){
      return Taro.showToast({title: '请先录入商品信息', icon: 'none'})
    }
    if(loading) return
    setLoading(true)
    
    post('/zhihehe/article/add', {
      ...edit,
      product_draft_id: options.pdid,
      img_paths: edit.img_paths.toString()
    }, dispatch).then(res => {
      if(res.data.status === 2){
        Taro.showToast({
          title: '新增成功，待审核',
          icon: 'none'
        })
        setTimeout(() => {
          setLoading(false)
          Taro.switchTab({url: '/pages/mine/Mine'})
        }, 1500)
      }else{
        setLoading(false)
      }
    }, err => {setLoading(false)})
  }


  if(!isRole('quoter', currentUser.role)){
    return (
      <Page navTitle='文章发布'>
        <Flex flex='frcc'>
          <Text fontSize='36'>你是怎么进来的？</Text>
        </Flex>
      </Page>
    )
  }


  return (
    <Page navTitle='文章发布'>
      <Box padding='0 25'>
        <Box>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>标题</Text></Box>
          <Input
            placeholder='请输入文章标题'
            value={edit.title}
            onInput={(value) => {
              setEdit(prev => ({
                ...prev,
                title: value
              }))
            }} 
          />
        </Box>
        <Box>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>展示图片</Text></Box>
          <UploadImg
            compressed={false}
            uploadUrl={'/upload/article'}
            imgList={edit.img_urls}
            pathList={edit.img_paths}
            onChange={(imgs, paths) => {
              setEdit(prev => ({
                ...prev,
                img_urls: imgs,
                img_paths: paths
              }))
            }}
          />
        </Box>

        <Box>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>标题</Text></Box>
          <RichEditor
            html={edit.html}
            uploadUrl='/upload/article'
            onInput={(value) => {
              setEdit(prev => ({
                ...prev,
                html: value
              }))
            }} 
          />
        </Box>

        <Line size='1 50' />

        <Flex flex='frcc' size='100% auto'>
          <ColorButton
            onClick={() => {
              onSend()
            }}
          >
            新增
          </ColorButton>
        </Flex>
      </Box>
      <Line size='0 50' type='bottom' />
    </Page>
  )
}

export default Publish