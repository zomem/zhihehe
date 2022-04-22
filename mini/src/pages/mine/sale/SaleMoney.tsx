import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'

import { Box, Flex, Image, Press, Text, Block, Line } from '@/components/widget/Components'
import Page from '@/components/widget/Page'
import OrderItem from '@/components/OrderItem'

import { get } from '@/constants/fetch'
import Loading from '@/components/widget/Loading'

import IMG_TOP from '@/images/account/yuetop.png'

function SaleMoney() {
  const dispatch = useDispatch()
  const {styles} = useSelector((state: ReduxState) => state)
  const [info, setInfo] = useState({
    list: [],
    all_amount: 0,
    have_amount: 0,
    have: true,
    loading: false,
  })

  const [page, setPage] = useState(1)

  useEffect(() => {
    setInfo(prev => ({...prev, loading: true}))
    get('/zhihehe/sale/sale_money/' + page, dispatch).then(res => {
      setInfo(prev => ({
        list: page === 1 ? res.data.list : [...prev.list, ...res.data.list],
        have: res.data.have,
        loading: false,
        have_amount: res.data.have_amount,
        all_amount: res.data.all_amount
      }))
    })
  }, [page])

  return (
    <Page 
      isContentStartUnder
      navTitle='我的提成'
      onScrollToLower={() => {
        if(info.loading) return
        if(!info.have) return
        setPage(page + 1)
      }}
    >
      <Box size='100% 455' position='relative' padding='140 0 0 0'>
        <Image src={IMG_TOP} size='100% 455' position='absolute' top='0' left='0' />
        <Flex size='100% 320' flex='frsc' padding='0 86' position='relative' >
          <Flex flex='fcbs'>
            <Text color='#ffffff' fontSize='30'>累计收益</Text>
            <Text color='#ffffff' fontSize='44' fontWeight='bold'>￥{((info.all_amount || 0) / 100).toFixed(2)}</Text>
          </Flex>
          <Line size='50 1' />
          <Flex flex='fcbs'>
            <Text color='#ffffff' fontSize='30'>累计到账</Text>
            <Text color='#ffffff' fontSize='44' fontWeight='bold'>￥{((info.have_amount || 0) / 100).toFixed(2)}</Text>
          </Flex>
        </Flex>
      </Box>
      
      <Box padding='25' radius='18' bgColor={styles.pageBgColor}>
        {
          info.list.length > 0 &&
          info.list.map((item:any, index) => (
            <OrderItem type='order_share_money' item={item} key={item.id} />
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

export default SaleMoney