import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import Taro, {useDidShow} from '@tarojs/taro'
import onCurrentUser from '@/actions/currentUser'

import Login from '@/components/widget/Login'
import Page from '@/components/widget/Page'


import {AUTHOR_SCOPE} from '@/constants/constants'    //用户授权操作
import {checkAuthorize} from '@/utils/authorize'    //用户授权操作
import {get} from '@/constants/fetch'
import { Box, Flex, Image, Press, Text, Block, Button, Line } from '@/components/widget/Components'

import {isRole, roleName} from '@/utils/authorize'
import {onGiftNotice} from '@/actions/gift'
import {onAccountBalance} from '@/actions/trade'



import PIC_AVATAR from '@/images/pic/defaultavatar.png'
import ICON_PUBLISH from '@/images/publish.png'
import ICON_TICHENG from '@/images/ticheng.png'
import ICON_MANAGE from '@/images/manage.png'
import ICON_WODEYH from '@/images/wodeyh.png'
import ICON_WODEXS from '@/images/wodexs.png'
import ICON_WDZF from '@/images/wdzf.png'
import ICON_BACKF from '@/images/backf.png'
import ICON_TRADEMY from '@/images/trademy.png'
import ICON_LIANXI from '@/images/lianxi.png'
import ICON_SALE_CODE from '@/images/wxcode.png'
import ICON_RECIVE from '@/images/recive.png'
import ICON_SEND from '@/images/send.png'
import ICON_WDYE from '@/images/wdye.png'

function Mine() {
  const {currentUser, gift, styles, trade} = useSelector((state: ReduxState) => state)
  const {giftNotice} = gift
  const dispatch = useDispatch()

  const [isOpenLogin, setIsOpenLogin] = useState(false)


  useEffect(() => {
    // get('/express/delivery/list', dispatch).then(res => {
    
    // })
    if(currentUser.id){
      onGiftNotice()(dispatch)
      onAccountBalance()(dispatch)
    }
  }, [currentUser.id])

  //用户授权操作  示例
  // async function selectAddr(): Promise<IAddress>{
  //   let isOk = await checkAuthorize(AUTHOR_SCOPE.userLocation)
  //   if(isOk){
  //     let tempLoc = await Taro.getLocation({type: 'gcj02'})
  //     let latitude = tempLoc.latitude
  //     let longitude = tempLoc.longitude
  //     let tempAddr = await Taro.chooseLocation({latitude, longitude})
  //     return {
  //       name: tempAddr.name,
  //       address: tempAddr.address,
  //       longitude: tempAddr.longitude as unknown as number,
  //       latitude: tempAddr.latitude as unknown as number
  //     }
  //   }
  //   return {
  //     name: '',
  //     address: '',
  //     longitude: 0,
  //     latitude: 0
  //   }
  // }

  useDidShow(() => {
    get('/common/refresh/user_info', dispatch).then(res => {
      dispatch(onCurrentUser(res.data))
    })
    if(currentUser.id){
      onGiftNotice()(dispatch)
      onAccountBalance()(dispatch)
    }
  })

  useEffect(() => {
    if(giftNotice.recive_num || giftNotice.send_num){
      Taro.setTabBarBadge({
        index: 2,
        text: `${giftNotice.recive_num + giftNotice.send_num}`
      })
    }
  }, [giftNotice.recive_num, giftNotice.send_num])

  return (
    <Block>
      <Page type='tabpage' navTitle='我的' isContentStartUnder>
        <Box size='100% 456' position='relative'>
          <Image src={styles.iconMineTop} size='100% 456' position='absolute' left='0' top='0' />
          <Press
            onClick={() => {
              if(!currentUser.id){
                return setIsOpenLogin(true)
              }
            }}
          >
            <Box size='500 140' position='absolute' left='62' bottom='30'>
              <Flex size='100% 100%' flex='frse'>
                <Image size='140 140' radius='70' src={currentUser.avatar_url || PIC_AVATAR} />
                <Text fontWeight='bold' padding='15 30' color={styles.textColor}>{currentUser.nickname || '用户名'}</Text>
              </Flex>
            </Box>
          </Press>
          {/* <Box position='absolute' right='50' top='170'>
            <Text fontSize='28' color={styles.textColorLight}>{roleName(currentUser.role).toString()}</Text>
          </Box> */}
        </Box>
        <Box padding='27 20'><Text fontSize='30' color={styles.textColorGray}>我的服务</Text></Box>
        <Box size='100% auto' padding='0 20'>
          
          <Flex size='100% 195' flex='frsc' margin='0 0 20 0' radius='30' padding='0 17' bgColor={styles.boxColor} overflow='hidden'>
            <Press 
              hoverBgColor={styles.hoverColor}
              onClick={() => {
                if(!currentUser.id){
                  return setIsOpenLogin(true)
                }
                Taro.navigateTo({url: '/pages/mine/trade/MyTrade'})
              }}
            >
              <Flex flex='fccc' size='225 195'>
                <Image size='64 64' src={ICON_TRADEMY} />
                <Line size='1 15' />
                <Text fontSize='28' color={styles.textColor}>我的订单</Text>
              </Flex>
            </Press>
            <Press 
              onClick={() => {
                if(!currentUser.id){
                  return setIsOpenLogin(true)
                }
                Taro.navigateTo({url: '/pages/mine/trade/Account'})
              }} 
              hoverBgColor={styles.hoverColor}
            >
              <Flex flex='fccc' size='225 195'>
                <Image size='64 64' src={ICON_WDYE} />
                <Line size='1 15' />
                <Text fontSize='28' color={styles.textColor}>余额￥{trade.balance.toFixed(2)}</Text>
              </Flex>
            </Press>
          </Flex>
          {/* <Flex size='100% 195' flex='frsc' margin='0 0 20 0' radius='30' padding='0 17' bgColor={styles.boxColor} overflow='hidden'>
            <Press
              hoverBgColor={styles.hoverColor}
              onClick={() => {
                if(!currentUser.id){
                  return setIsOpenLogin(true)
                }
                Taro.navigateTo({url: '/pages/mine/gift/GiftBuy'})
              }}
            >
              <Flex flex='fccc' size='225 195' position='relative'>
                <Image size='64 64' src={ICON_SEND} />
                <Line size='1 15' />
                <Text fontSize='28' color={styles.textColor}>赠送的礼物</Text>
                {
                  gift.giftNotice.send_num > 0 &&
                  <Box size='18 18' radius='18' position='absolute' top='25' right='56' bgColor={styles.colorRed} />
                }
              </Flex>
            </Press>
            <Press 
              hoverBgColor={styles.hoverColor}
              onClick={() => {
                if(!currentUser.id){
                  return setIsOpenLogin(true)
                }
                Taro.navigateTo({url: '/pages/mine/gift/GiftRecive'})
              }}
            >
              <Flex flex='fccc' size='225 195' position='relative'>
                <Image size='64 64' src={ICON_RECIVE} />
                <Line size='1 15' />
                <Text fontSize='28' color={styles.textColor}>收到的礼物</Text>
                {
                  gift.giftNotice.recive_num > 0 &&
                  <Box size='18 18' radius='18' position='absolute' top='25' right='56' bgColor={styles.colorRed} />
                }
              </Flex>
            </Press>
          </Flex> */}

          {
            isRole('quoter', currentUser.role) &&
            <Flex size='100% 195' flex='frsc' margin='0 0 20 0' radius='30' padding='0 17' bgColor={styles.boxColor} overflow='hidden'>
              <Press onClick={() => {
                  if(!currentUser.id){
                    return setIsOpenLogin(true)
                  }
                  Taro.navigateTo({url: '/pages/mine/product/AddProduct'})
                }}
                hoverBgColor={styles.hoverColor}
              >
                <Flex flex='fccc' size='225 195'>
                  <Image size='64 64' src={ICON_PUBLISH} />
                  <Line size='1 15' />
                  <Text fontSize='28' color={styles.textColor}>发布商品</Text>
                </Flex>
              </Press>
              <Press onClick={() => {
                  if(!currentUser.id){
                    return setIsOpenLogin(true)
                  }
                  Taro.navigateTo({url: '/pages/mine/article/ArticleList'})
                }}
                hoverBgColor={styles.hoverColor}
              >
                <Flex flex='fccc' size='225 195'>
                  <Image size='64 64' src={ICON_MANAGE} />
                  <Line size='1 15' />
                  <Text fontSize='28' color={styles.textColor}>商品管理</Text>
                </Flex>
              </Press>
            </Flex>
          }
          {
            (isRole('salespeople', currentUser.role) || isRole('salesleader', currentUser.role)) &&
            <Flex size='100% 195' flex='frsc' margin='0 0 20 0' radius='30' padding='0 17' bgColor={styles.boxColor} overflow='hidden'>
              <Press onClick={() => {
                  if(!currentUser.id){
                    return setIsOpenLogin(true)
                  }
                  Taro.navigateTo({url: '/pages/mine/sale/SaleMoney'})
                }}
                hoverBgColor={styles.hoverColor}
              >
                <Flex flex='fccc' size='225 195'>
                  <Image size='64 64' src={ICON_TICHENG} />
                  <Line size='1 15' />
                  <Text fontSize='28' color={styles.textColor}>我的提成</Text>
                </Flex>
              </Press>
              {
                isRole('salespeople', currentUser.role) &&
                <Press onClick={() => {
                    if(!currentUser.id){
                      return setIsOpenLogin(true)
                    }
                    Taro.navigateTo({url: '/pages/mine/sale/MyUserList'})
                  }}
                  hoverBgColor={styles.hoverColor}
                >
                  <Flex flex='fccc' size='225 195'>
                    <Image size='64 64' src={ICON_WODEYH} />
                    <Line size='1 15' />
                    <Text fontSize='28' color={styles.textColor}>我的用户</Text>
                  </Flex>
                </Press>
              }
              {
                isRole('salesleader', currentUser.role) &&
                <Press onClick={() => {
                    if(!currentUser.id){
                      return setIsOpenLogin(true)
                    }
                    Taro.navigateTo({url: '/pages/mine/sale/MySaleList'})
                  }}
                  hoverBgColor={styles.hoverColor}
                >
                  <Flex flex='fccc' size='225 195'>
                    <Image size='64 64' src={ICON_WODEXS} />
                    <Line size='1 15' />
                    <Text fontSize='28' color={styles.textColor}>我的销售</Text>
                  </Flex>
                </Press>
              }
            </Flex>
          }
          {
            isRole('salespeople', currentUser.role) &&
            <Flex size='100% 195' flex='frsc' margin='0 0 20 0' radius='30' padding='0 17' bgColor={styles.boxColor} overflow='hidden'>
              <Press onClick={() => {
                  if(!currentUser.id){
                    return setIsOpenLogin(true)
                  }
                  Taro.navigateTo({url: '/pages/mine/sale/SaleCode'})
                }}
                hoverBgColor={styles.hoverColor}
              >
                <Flex flex='fccc' size='225 195'>
                  <Image size='64 64' src={ICON_SALE_CODE} />
                  <Line size='1 15' />
                  <Text fontSize='28' color={styles.textColor}>邀请码</Text>
                </Flex>
              </Press>
            </Flex>
          }
          <Flex size='100% 195' flex='frsc' margin='0 0 20 0' radius='30' padding='0 17' bgColor={styles.boxColor} overflow='hidden'>
            <Press openType='contact' hoverBgColor={styles.hoverColor}>
              <Flex flex='fccc' size='225 195'>
                <Image size='64 64' src={ICON_LIANXI} />
                <Line size='1 15' />
                <Text fontSize='28' color={styles.textColor}>联系客服</Text>
              </Flex>
            </Press>
            <Press onClick={() => {Taro.navigateTo({url: '/pages/mine/feedback/Feedback'})}} hoverBgColor={styles.hoverColor}>
              <Flex flex='fccc' size='225 195'>
                <Image size='64 64' src={ICON_BACKF} />
                <Line size='1 15' />
                <Text fontSize='28' color={styles.textColor}>意见反馈</Text>
              </Flex>
            </Press>
          </Flex>
        </Box>
        <Line size='100% 50' safe='bottom' />
      </Page>

      <Login
        type='wechat'
        isOpen={isOpenLogin}
        onCancel={() => setIsOpenLogin(false)}
        onConfirm={() => setIsOpenLogin(false)}
      />
    </Block>
  )
}


export default Mine