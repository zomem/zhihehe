import React, {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Taro, {getCurrentInstance} from '@tarojs/taro'


import Page from '@/components/widget/Page'
import ColorButton from '@/components/widget/colorButton/colorButton'
import {Block, Flex, Line, Textarea} from '@/components/widget/Components'

import {post} from '@/constants/fetch'



function Feedback() {


  const {styles} = useSelector((state: ReduxState) => state)
  const [content, setContent] = useState('')
  const dispatch = useDispatch()


  const sendFeedback = () => {
    post('/common/feedback', {
      content: content
    }, dispatch).then(res => {
      if(res.data.status === 2){
        Taro.showToast({title: res.data.message})
        setContent('')
        setTimeout(() => {
          Taro.navigateBack()
        }, 1200)
      }
    })
  }

  return (
    <Page navTitle='意见反馈'>     
      <Flex size='100% auto' flex='fcbc' padding='30'>
        <Textarea bgColor={styles.boxColor} color={styles.textColor} padding='25' size='100% 280' radius='12' value={content} onInput={(v) => setContent(v)} />
        <Line size='0 50' />
        <ColorButton
          onClick={() => {
            if(!content) {
              return Taro.showToast({title: '请输入反馈内容', icon: 'none'})
            }
            sendFeedback()
          }}
        >
          提交
        </ColorButton>
      </Flex>
    </Page>
  )
}


export default Feedback