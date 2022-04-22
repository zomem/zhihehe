import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'

import { Box, Flex, Image, Press, Text, Block, Line } from '@/components/widget/Components'
import Card from '@/components/widget/Card'
import Page from '@/components/widget/Page'
import UserItem from '@/components/UserItem'

import { get, post } from '@/constants/fetch'
import ColorButton from '@/components/widget/colorButton/colorButton'
import Loading from '@/components/widget/Loading'


function MySaleList() {
  const dispatch = useDispatch()
  const {currentUser} = useSelector((state: ReduxState) => state)
  const [info, setInfo] = useState({
    list: [],
  })
  const [r, setR] = useState(1)

  useEffect(() => {
    get('/zhihehe/sale/leader/saler_list', dispatch).then(res => {
      setInfo({
        list: res.data,
      })
    })
  }, [r])


  // 审核或取消
  const changeSale = (type, uid) => {
    post('/zhihehe/sale/join/check', {
      type: type,
      uid: uid,
    }, dispatch).then(res => {
      if(res.data.status === 2){
        Taro.showToast({title: res.data.message, icon: 'none'})
      }else{
        Taro.showToast({title: res.data.message, icon: 'none'})
      }
      setR(r + 1)
    })
  }

  return (
    <Page navTitle='我的销售' padding='20 30'>
      <Card >
        {
          info.list.length > 0 &&
          info.list.map((item:any, index) => (
            <UserItem 
              item={item} 
              noBottom={index === info.list.length - 1 ? true : false}
              key={item.id}
              onClick={() => {
                if(item.status === 1){
                  Taro.showModal({
                    title: '提示',
                    content: '确定同意[' + item.nickname + ']，加入你的销售团队吗？',
                    success: (res) => {
                      if(res.confirm){
                        changeSale(2, item.uid)
                      }
                    }
                  })
                }else{
                  Taro.showModal({
                    title: '提示',
                    content: '确定删除[' + item.nickname + ']用户吗？',
                    confirmColor: '#c00519',
                    confirmText: '删除',
                    success: (res) => {
                      if(res.confirm){
                        changeSale(0, item.uid)
                      }
                    }
                  })
                }
              }}
            />
          ))
        }
      </Card>
      <Loading title='没有更多了' />


      <Line size='0 40' />
      <Flex padding='0 30' flex='frcc'>
        <ColorButton 
          onClick={() => {
            Taro.navigateTo({url: '/pages/mine/sale/InviteSale'})
          }}
        >
          邀请销售
        </ColorButton>
      </Flex>
    </Page>
  )
}

export default MySaleList