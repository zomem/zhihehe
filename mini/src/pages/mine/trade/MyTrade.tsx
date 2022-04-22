import React, {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import Taro, {useDidShow} from '@tarojs/taro'

import Page from '@/components/widget/Page'

import OrderItem from '@/components/OrderItem'
import Loading from '@/components/widget/Loading'
import TopCatLine from '@/components/widget/topCatLine/topCatLine'
import { Block, Box, Flex, Image, Line, Press, Text } from '@/components/widget/Components'

import {get, put} from '@/constants/fetch'

function MyTrade() {

  const TOP_TITLE = {
    name: ['全部', '待发货', '待收货', '已完成', '待付款', '已取消'],
    type: [0, 10, 15, 20, 5, 3]
  }
  const dispatch = useDispatch()
  const [check, setCheck] = useState({
    page: 1,
    type: 0,
    current: 0
  })
  const [info, setInfo] = useState<{list: any[], have: boolean, loading: boolean}>({
    list: [],
    have: true,
    loading: true
  })
  const [r, setR] = useState(0)

  useDidShow(() => {
    setR(prev => prev + 1)
    setCheck(prev => ({
      ...prev,
      page: 1
    }))
  })

  useEffect(() => {
    if(r > 0){      
      setInfo(prev => ({...prev, loading: true}))
      get('/zhihehe/trade/list/' + check.page + '/' + check.type, dispatch).then(res => {
        setInfo(prev => ({
          list: check.page === 1 ? res.data.list : [...prev.list, ...res.data.list],
          have: res.data.have,
          loading: false
        }))
      })
    }
  }, [check.page, check.type, r])


  // 支付待支付订单
  const payTrade = (trade_id) => {
    get('/pay/buy/article/wait_pay/' + trade_id, dispatch).then(res => {
      if(res.data.status === 2){
        wx.requestPayment({
          ...res.data.wxData,
          success: function (res) {
            Taro.navigateTo({url: '/pages/article/Complete'})
          },
          fail: function (err) { 
            
          }
        })
      }else{
        Taro.showToast({title: res.data.message, icon: 'none'})
      }
    })
  }

  // 确认收货
  const onReciveProduct = (trade_id) => {
    put('/zhihehe/trade/recived/confirm', {
      trade_id,
    }, dispatch).then(res => {
      setR(prev => prev + 1)
      if(res.data.status === 2){
        Taro.showToast({title: res.data.message, icon: 'success'})
      }else{
        Taro.showModal({title: '提示', content: res.data.message})
      }
    })
  }

  return(
    <Page
      navTitle='我的订单'
      isAlwaysShowNav
      onScrollToLower={() => {
        if(info.loading) return
        if(!info.have) return
        setCheck(prev => ({...prev, page: prev.page + 1}))
      }}
    >
      <TopCatLine
        titleList={TOP_TITLE.name}
        current={check.current}
        onChange={(c) => setCheck({page: 1, type: TOP_TITLE.type[c], current: c})}
      />
      <Line size='1 75' />
      <Box size='100% auto' padding='30 25'>
        {
          info.list.length > 0 &&
          info.list.map((item, index) => (
            <OrderItem 
              item={item}
              isShowPay={item.trade_status === 5 ? true : false}
              type='order_user_show'
              key={item.id}
              onExpress={() => {
                Taro.setClipboardData({
                  data: item.express_no,
                  success: () => {
                    Taro.showToast({title: '已复制', icon: 'success'})
                  }
                })
                // Taro.navigateTo({url: '/pages/mine/trade/ExpressTrack?tradeNo=' + item.trade_no})
              }}
              onClick={() => {
                Taro.navigateTo({
                  url: '/pages/article/ArticleDetail?aid=' + item.article_id
                })
              }}
              onPay={() => {
                payTrade(item.id)
              }}
              onRecived={() => {
                Taro.showModal({
                  title: '提示',
                  content: '是否确认收货？',
                  confirmText: '是',
                  cancelText: '否'
                }).then(res => {
                  if(res.confirm){
                    onReciveProduct(item.id)
                  }
                })
              }}
            />
          ))
        }
        {
          info.loading ? 
          <Loading />
          :
          info.have ?
          <Loading />
          :
          <Loading title='没有更多了' />
        }
      </Box>
    </Page>
  )
}

export default MyTrade