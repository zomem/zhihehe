import React, { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import Taro from '@tarojs/taro'
import {Box, Button, Image, Flex, Text, Line} from '@/components/widget/Components'

import Page from '@/components/widget/Page'
import Loading from '@/components/widget/Loading'

import {get} from '@/constants/fetch'
import Card from '@/components/widget/Card'
import CardItem from '@/components/widget/CardItem'

import {dateTime} from '@/utils/timeFormat'
import {onAccountBalance} from '@/actions/trade'

import IMG_TOP from '@/images/account/yuetop.png'
import ICON_CHONGZHI from '@/images/account/chongzhi.png'
import ICON_GOUWU from '@/images/account/gouwu.png'
import ICON_TUIKUAN from '@/images/account/tuikuan.png'


const Account = () => {
  const dispatch = useDispatch()
  const {currentUser, styles, trade} = useSelector((state: ReduxState) => state)

  
  const [page, setPage] = useState(1)
  const [infos, setInfos] = useState<{list: any[], loading: boolean, have: boolean}>({
    list: [],
    loading: true,
    have: true
  })


  useEffect(() => {
    if(currentUser.id){
      onAccountBalance()(dispatch)
    }
  }, [currentUser.id])

  useEffect(() => {
    if(currentUser.id){
      get('/zhihehe/account/balance/list/' + page, dispatch).then(res => {
        setInfos(prev => ({
          list: [...prev.list, ...res.data.list],
          loading: false,
          have: res.data.have
        }))
      })
    }
  }, [page, currentUser.id])
  
  return (
    <Page 
      isContentStartUnder
      navTitle='我的账户'
      onScrollToLower={() => {
        if(infos.loading) return
        if(!infos.have) return
        setPage(page + 1)
      }}
    >
      <Box size='100% 455' position='relative' padding='170 0 0 0'>
        <Image src={IMG_TOP} size='100% 455' position='absolute' top='0' left='0' />
        <Flex flex='fcbc' position='relative' >
          <Text fontSize={styles.textSizeXL} fontWeight='bold' color={styles.colorWhite}>{trade.balance.toFixed(2)}<Text fontSize={styles.textSize} color={styles.colorWhite}>￥</Text></Text>
          <Text fontSize={styles.textSizeS} color={styles.colorWhite}>我的余额</Text>
          <Line size='1 18' />
          <Button
            size='190 78'
            radius='39'
            bgColor={styles.colorWhite}
            color={styles.colorGreen}
            onClick={() => {
              Taro.navigateTo({url: '/pages/mine/trade/Recharge'})
            }}
          >
            充值
          </Button>
        </Flex>
      </Box>


      <Box size='100% auto' padding='25 25'>
        <Card>
          {
            infos.list.length > 0 &&
            infos.list.map((item, index) => (
              <CardItem size='100% auto' padding='0 25' noBottom={index + 1 === infos.list.length}>
                <Flex flex='frbc' size='100% auto' minHeight='180'>
                  {
                    {
                      1: <Image size='80 80' src={ICON_GOUWU} />,
                      2: <Image size='80 80' src={ICON_GOUWU} />,
                      11: <Image size='80 80' src={ICON_CHONGZHI} />,
                      12: <Image size='80 80' src={ICON_TUIKUAN} />,
                    }[item.type]
                  }
                  <Line size='15 1' />
                  <Flex flex='fcbs' size='400 auto'>
                    <Text color={styles.textColor}>{item.content}</Text>
                    <Line size='1 15' />
                    <Text fontSize={styles.textSizeXS} color={styles.textColorGray}>{dateTime(item.created_at, 'dateTime')}</Text>
                  </Flex>
                  <Flex flex='frec' size='150 auto'>
                    <Text color={item.change_balance > 0 ? styles.colorRed : styles.colorGreen}>{item.change_balance > 0 && '+'}{item.change_balance}</Text>
                  </Flex>
                </Flex>
              </CardItem>
            ))
          }
        </Card>
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
      <Line size='1 50' safe='bottom' />
    </Page>
  )
}

export default Account