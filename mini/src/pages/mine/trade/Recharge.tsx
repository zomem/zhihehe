import React, { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Box, Button, Image, Flex, Text, Line, Press} from '@/components/widget/Components'

import Page from '@/components/widget/Page'
import Loading from '@/components/widget/Loading'

import {get, post} from '@/constants/fetch'
import Card from '@/components/widget/Card'
import CardItem from '@/components/widget/CardItem'

import {dateTime} from '@/utils/timeFormat'
import {onAccountBalance} from '@/actions/trade'

import IMG_TOP from '@/images/account/chongzhi_top.jpg'
import Taro from '@tarojs/taro'


const Recharge = () => {
  const dispatch = useDispatch()
  const {currentUser, styles, trade} = useSelector((state: ReduxState) => state)

  const [info, setInfo] = useState<any>([])

  const [select, setSelect] = useState<any>({})

  useEffect(() => {
    if(currentUser.id){
      onAccountBalance()(dispatch)
      get('/zhihehe/account/recharge/list', dispatch).then(res => {
        setInfo(res.data)
      })
    }
  }, [currentUser.id])



  // 用户充值
  const onRecharge = () => {
    if(!select.id) {
      return Taro.showToast({title: '请选择金额', icon: 'none'})
    }
    post('/pay/recharge', {arid: select.id}, dispatch).then(res => {
      let temp = res.data
      if(temp.status === 2){
        wx.requestPayment({
          ...temp.wxData,
          success: function (res) {
            Taro.navigateTo({url: '/pages/article/Complete'})
          },
          fail: function (err) { 
          }
        })
      }else{
        Taro.showToast({
          title: temp.message,
          icon: 'none'
        })
      }
    })
  }

  return (
    <Page 
      isContentStartUnder
      navTitle='充值'
    >
      <Box size='100% 390' position='relative' padding='140 0 0 0' zIndex='0'>
        <Image src={IMG_TOP} size='100% 390' position='absolute' top='0' left='0' />
        <Flex flex='fcbs' position='relative' padding='0 100' >
          <Text fontSize={styles.textSizeS} color={styles.colorWhite}>余额</Text>
          <Text fontSize={styles.textSizeXL} fontWeight='bold' color={styles.colorWhite}>{trade.balance.toFixed(2)}<Text fontSize={styles.textSize} color={styles.colorWhite}>￥</Text></Text>
        </Flex>
      </Box>

      <Box bgColor={styles.boxColor} size='700 auto' padding='25' radius='30' margin='-90 25 0 25' zIndex='10' position='relative'>
        <Text fontSize={styles.textSize} color={styles.textColor}>请选择金额</Text>
        <Line size='1 25' />
        <Box size='100% auto' display='flex' flexWrap='wrap'>
          {
            info.length > 0 &&
            info.map((item, index) => (
              <Box key={item.id} margin={index % 2 === 0 ? '0 25 25 0' : '0 0 25 0'} radius='20' overflow='hidden'>
                <Press hoverBgColor={styles.hoverColor} onClick={() => setSelect(item)}>
                  <Flex flex='fccc' size='312 180' borderColor={select.id === item.id ? styles.colorGreen : styles.lineColor} radius='20' bgColor={select.id === item.id ? styles.boxSelectColor : ''} >
                    <Text color={styles.textColor} fontSize={styles.textSizeL}>{item.price}<Text fontSize={styles.textSizeS} color={styles.textColor}>元</Text></Text>
                    <Line size='1 12' />
                    <Text fontSize={styles.textSizeS} color={styles.textColorGray}>优惠价：<Text fontWeight='bold' fontSize={styles.textSizeS} color={styles.colorGreen}>{item.pay_price}</Text>元</Text>
                  </Flex>
                </Press>
              </Box>
            ))
          }
        </Box>
        <Line size='1 25' />
        <Flex flex='frcc' size='100% auto'>
          <Button
            letterSpacing='0'
            size='480 90'
            radius='45'
            bgImage='linear-gradient(to right, #36a65d, #36a65d , #51b875, #51b875)'
            onClick={onRecharge}
          >
            立即充值(￥{select.pay_price || '0.00'})
          </Button>
        </Flex>
      </Box>

      <Line size='1 50' safe='bottom' />
    </Page>
  )
}

export default Recharge