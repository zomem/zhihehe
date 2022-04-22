import React, {useEffect, useState} from 'react'
import Taro, {useDidShow} from '@tarojs/taro'
import {useDispatch} from 'react-redux'
import {Box, Block} from '@/components/widget/Components'

import Page from '@/components/widget/Page'
import Loading from '@/components/widget/Loading'
import OrderItem from '@/components/OrderItem'

import {get} from '@/constants/fetch'

export default (props) => {

  const dispatch = useDispatch()

  const [infos, setInfos] = useState<any>({
    list: [],
    have: true,
    loading: false,
  })
  const [page, setPage] = useState(1)
  const [r, setR] = useState(0)

  useDidShow(() => {
    setR(r + 1)
    setPage(1)
  })

  useEffect(() => {
    if(r > 0){
      setInfos(prev => ({
        ...prev,
        loading: true,
      }))
      get('/zhihehe/gift/user/gift_recive/' + page, dispatch).then(res => {
        setInfos({
          loading: false,
          list: res.data.list,
          have: res.data.have
        })
      })
    }
  }, [page, r])

  
  return (
    <Page
      navTitle='我收到的礼物'
      onScrollToLower={() => {
        if(infos.loading) return
        if(!infos.have) return
        setPage(page + 1)
      }}
    >
      <Box size='100% auto' padding='30 25'>
        {
          infos.list.length > 0 &&
          infos.list.map((item, index) => (
            <OrderItem 
              item={item}
              isShowPay={item.trade_status === 5 ? true : false}
              type='gift_user_recive'
              key={item.id}
              onClick={() => {
                Taro.navigateTo({
                  url: '/pages/article/ArticleDetail?aid=' + item.article_id
                })
              }}
            />
          ))
        }
        {
          infos.loading ? 
          <Loading />
          :
          infos.have ?
          <Loading />
          :
          <Loading title='没有更多了' />
        }
      </Box>
    </Page>
  )
}