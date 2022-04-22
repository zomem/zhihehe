import React, {useState, useEffect} from 'react'
import Taro, {getCurrentInstance, useShareAppMessage} from '@tarojs/taro'
import {useDispatch, useSelector} from 'react-redux'
import Page from '@/components/widget/Page'

import {Block, Flex, Image, Text, Line, Button, Box, Press} from '@/components/widget/Components'
import { get } from '@/constants/fetch'
import Tag from '@/components/widget/Tag'

import Login from '@/components/widget/Login'
import {isPhone} from '@/utils/veriInfo'

import ICON_RIGHT_ARR from '@/images/icons/right_arr.svg'
import Loading from '@/components/widget/Loading'



function GiftSend() {
  const dispatch = useDispatch()
  const {currentUser, styles} = useSelector((state: ReduxState) => state)

  const [isOpenLogin, setIsOpenLogin] = useState(false)

  const [giftList, setGiftList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


  // 查寻手机号下面的礼物信息
  const checkGift = (phone) => {
    get('/zhihehe/gift/status_by_phone/' + phone, dispatch).then(res => {
      setGiftList(res.data)
      setLoading(false)
    })
  }


  return(
    <Block>
      <Page type='tabpage' navTitle='查寻礼物'>
        <Box padding='30' size='100% auto'>
          <Flex flex='frbc' size='100% 90' bgColor={styles.boxColor} radius='45' padding='0 15'>
            <Press 
              onClick={() => {
                if(currentUser.phone){
                  return
                }
                setIsOpenLogin(true)
              }}
            >
              <Flex flex='frsc' size='420 86'>
                {
                  currentUser.phone ?
                  <Text fontSize='34' color={styles.textColor}>{currentUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</Text>
                  :
                  <Text fontSize='34' color={styles.textColor}>获取手机号</Text>
                }
              </Flex>
            </Press>
            <Button
              size='150 80'
              radius='40'
              bgColor={styles.colorOrange}
              onClick={() => {
                if(!currentUser.id || !currentUser.phone){
                  return setIsOpenLogin(true)
                }
                if(!isPhone(currentUser.phone)){
                  return Taro.showToast({title: '手机号有误', icon: 'none'})
                }
                checkGift(currentUser.phone)
              }}
            >
              查寻
            </Button>
          </Flex>


          <Box size='100% auto' bgColor={styles.boxColor} radius='30' padding='0 25' margin='30 0 30 0'>
            {
              giftList.length > 0 &&
              giftList.map((item, index) => (
                <Press 
                  onClick={() => {
                    if(item.gift_status >= 8){
                      Taro.navigateTo({
                        url: '/pages/gift/GiftSend?gtid=' + item.gtid + '&gpid=' + item.gpid,
                      })
                    }else{
                      Taro.navigateTo({
                        url: '/pages/gift/GiftSend?gtid=' + item.gtid
                      })
                    }
                  }}
                  key={index}
                >
                  <Box size='100% auto' padding='15 0'>
                    <Flex flex='frbc' size='100% auto'>
                      <Image size='220 160' radius='12' src={item.cover_url} />
                      <Line size='15 1' />
                      <Flex size='400 160' flex='fcbs' >
                        <Text fontSize='34' color={styles.textColor}>{item.title}</Text>
                        <Text fontSize='28' color={styles.textColorGray}>{item.des}</Text>
                        <Flex flex='frsc'>
                          <Text color={styles.colorOrange} fontSize='30'>￥{item.price?.toFixed(2)}</Text>
                          <Line size='25 1' />
                          {
                            {
                              10: <Tag color='#a442f5' title={item.gift_status_name} />, 
                              8: <Tag color='#f59042' title={item.gift_status_name} />, 
                              15: <Tag color='#2196F3' title={item.gift_status_name} />, 
                              20: <Tag color='#5ec92c' title={item.gift_status_name} />, 
                              5: <Tag color='#fc0b03' title={item.gift_status_name} />, 
                              3: <Tag color='#8c8c8c' title={item.gift_status_name} />,
                              1: <Tag color='#8c8c8c' title={item.gift_status_name} />,
                              0: <Tag color='#fc0b03' title={item.gift_status_name} />
                            }[item.gift_status]
                          }
                        </Flex>
                      </Flex>
                      <Image size='20 20' src={ICON_RIGHT_ARR} />
                    </Flex>
                  </Box>
                </Press>
              ))
            }
            {
              (giftList.length === 0 && !loading) &&
              <Loading title='没有找到相关礼物记录' />
            }
          </Box>
        </Box>
      </Page>

      <Login
        type='wechat_phone'
        isOpen={isOpenLogin}
        onCancel={() => setIsOpenLogin(false)}
        onConfirm={() => setIsOpenLogin(false)}
      />
    </Block>
  )
}

export default GiftSend