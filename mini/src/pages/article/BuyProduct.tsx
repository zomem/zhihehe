import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Decimal} from 'decimal.js'

import Page from '@/components/widget/Page'
import OrderItem from '@/components/OrderItem'
import Login from '@/components/widget/Login'
import ColorButton from '@/components/widget/colorButton/colorButton'
import AddressItem from '@/components/widget/AddressItem'
import {Block, Box, Flex, SafeArea, Text, Press, Input, Button, Line, Image, Switch, TextEllipsis} from '@/components/widget/Components'
import Card from '@/components/widget/Card'
import CardItem from '@/components/widget/CardItem'

import ICON_WX_PAY from '@/images/gift/wx_pay.png'
import ICON_OWN_PAY from '@/images/gift/own_pay.png'

import {EXPRESS_PROVINCE} from '@/constants/constants'
import {get, post} from '@/constants/fetch'
import {isPhone} from '@/utils/veriInfo'
import ICON_DELETE from '@/images/delete.png'


function BuyProduct() {
  const dispatch = useDispatch()
  const {currentUser, styles} = useSelector((state: ReduxState) => state)
  const [options, setOptions] = useState({
    aid: 0,
    pid: 0,
    fuid: 0,
    open_gift: 0,
    open_group: 0,
  })
  const [detail, setDetail] = useState({
    id: 0,
    title: '',
    price: 0,
    can_gift: 0,
    group_price: 0,
    can_group: 0,
  })
  const [addr, setAddr] = useState({
    name: '收件人',
    phone: '',
    address: '请选择收货地址',
    province: '',
    city: '',
    area: '',
    addr: '',
  })

  const [isOpenLogin, setIsOpenLogin] = useState(false)
  const [buyNum, setBuyNum] = useState(1)
  const [isGift, setIsGift] = useState(false)  // 是否是送礼
  const [phoneList, setPhoneList] = useState<string[]>([]) // 收礼人的手机号
  const [inputPhone, setInputPhone] = useState('')

  const [themeList, setThemeList] = useState<any>([]) // 贺卡列表
  const [themeId, setThemeId] = useState(0)  //贺卡id

  const [payWay, setPayWay] = useState(1)  // 1为微信支付，5为余额支付。

  // 获取路由
  useEffect(() => {
    const instance = getCurrentInstance()
    const aid = parseInt(instance?.router?.params.aid || '0')
    const pid = parseInt(instance?.router?.params.pid || '0')
    const fuid = parseInt(instance?.router?.params.fuid || '0')
    const open_gift = parseInt(instance?.router?.params.open_gift || '0')
    const open_group = parseInt(instance?.router?.params.open_group || '0')
    setOptions({
      aid,
      pid,
      fuid,
      open_gift,
      open_group
    })
    if(open_gift === 1){
      setIsGift(true)
    }
  }, [])


  useEffect(() => {
    if(options.pid){
      get('/zhihehe/product/detail/' + options.pid, dispatch).then(res => {
        setDetail(res.data)
      })

      // 获取贺卡主题
      get('/zhihehe/gift/gift_theme_list', dispatch).then(res => {
        setThemeList(res.data)
      })
    }
  }, [options.pid])

  
  // 买水果
  const payFruits = (isGroup=0) => {
    if(!addr.phone){
      return Taro.showToast({title: '请选择收货信息', icon: 'none'})
    }

    if(payWay === 5){
      // 余额支付
      if(isGroup === 1){
        Taro.showLoading({
          title: '支付中'
        })
        post('/pay/buy/fruits/balance/group', {
          aid: options.aid,
          pid: options.pid,
          fuid: options.fuid,
          buyNum: buyNum,
          ...addr
        }, dispatch).then(res => {
          let temp = res.data
          Taro.hideLoading()
          if(temp.status === 2){
            Taro.navigateTo({url: '/pages/article/Complete'})
          }else{
            Taro.showToast({
              title: temp.message,
              icon: 'none'
            })
          }
        })
      }else{
        Taro.showLoading({
          title: '支付中'
        })
        post('/pay/buy/fruits/balance', {
          aid: options.aid,
          pid: options.pid,
          fuid: options.fuid,
          buyNum: buyNum,
          ...addr
        }, dispatch).then(res => {
          let temp = res.data
          Taro.hideLoading()
          if(temp.status === 2){
            Taro.navigateTo({url: '/pages/article/Complete'})
          }else{
            Taro.showToast({
              title: temp.message,
              icon: 'none'
            })
          }
        })
      }
    }
    if(payWay === 1){
      if(isGroup === 1){
        post('/pay/buy/fruits/group', {
          aid: options.aid,
          pid: options.pid,
          fuid: options.fuid,
          buyNum: buyNum,
          ...addr
        }, dispatch).then(res => {
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
      }else{
        post('/pay/buy/article/fruits', {
          aid: options.aid,
          pid: options.pid,
          fuid: options.fuid,
          buyNum: buyNum,
          ...addr
        }, dispatch).then(res => {
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
    }
  }

  
  // 送礼
  const payGift = () => {

    if(phoneList.length === 0){
      return Taro.showToast({title: '请输入收礼人手机号', icon: 'none'})
    }
    if(phoneList.length < buyNum){
      return Taro.showToast({title: '领取手机号的个数，不能少于礼物数。', icon: 'none', duration: 3000})
    }
    if(!themeId){
      return Taro.showToast({title: '请选择贺卡类别', icon: 'none'})
    }
    

    if(payWay === 5){
      Taro.showLoading({
        title: '支付中'
      })
      post('/pay/buy/gift/balance', {
        aid: options.aid,
        pid: options.pid,
        fuid: options.fuid,
        buyNum: buyNum,
        phoneStr: phoneList.toString(),
        gift_theme_id: themeId,
      }, dispatch).then(res => {
        let temp = res.data
        Taro.hideLoading()
        if(temp.status === 2){
          Taro.redirectTo({url: '/pages/gift/GiftSend?gtid=' + temp.gtid})
        }else{
          Taro.showToast({
            title: temp.message,
            icon: 'none'
          })
        }
      })
    }
    if(payWay === 1){
      post('/pay/buy/gift', {
        aid: options.aid,
        pid: options.pid,
        fuid: options.fuid,
        buyNum: buyNum,
        phoneStr: phoneList.toString(),
        gift_theme_id: themeId,
      }, dispatch).then(res => {
        let temp = res.data
        if(temp.status === 2){
          wx.requestPayment({
            ...temp.wxData,
            success: function (res) {
              Taro.redirectTo({url: '/pages/gift/GiftSend?gtid=' + temp.gtid})
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
  }

  return (
    <Block>
      <Page navTitle='确认订单' >
        <Box size='100% auto' padding='20'>
          <OrderItem
            isGroup={options.open_group === 1 ? true : false}
            item={detail}
            num={buyNum}
            onNumber={(num) => {
              setBuyNum(num)
            }}
          />
        </Box>
        {
          (detail.can_gift === 1 && options.open_group !== 1) &&
          <Box size='100% auto' padding='20'>
            <Flex flex='frbc' size='100% auto' padding='20' radius='30' bgColor={styles.boxColor}>
              <Text fontSize='28' color={styles.textColor}>是否开启送礼</Text>
              <Switch
                bgColor={styles.colorOrange}
                checked={isGift}
                onChange={(value) => setIsGift(value)}
              />
            </Flex>
          </Box>
        }
        {
          !isGift && 
          <Box size='100% auto' padding='20'>
            <Press
              hoverBgColor={styles.hoverColor}
              onClick={async () => {
                let addrInfo = await Taro.chooseAddress()
                setAddr({
                  name: addrInfo.userName,
                  phone: addrInfo.telNumber,
                  address: addrInfo.provinceName + addrInfo.cityName + addrInfo.countyName + addrInfo.detailInfo,
                  province: addrInfo.provinceName,
                  city: addrInfo.cityName,
                  area: addrInfo.countyName,
                  addr: addrInfo.detailInfo,
                })
              }}
            >
              <Flex flex='fccc' size='100% auto'>
                <AddressItem item={addr} />
              </Flex>
            </Press>
          </Box>
        }
        {
          isGift && 
          <Box size='100% auto' padding='20'>
            <Box size='100% auto' radius='30' bgColor={styles.boxColor} padding='20'>
              <Text fontSize='28' color={styles.textColorGray}>
                收礼人手机号
                {/* <Text fontSize='24' color={styles.colorOrange}>【注:目前只支持重庆和四川地区用户收礼】</Text> */}
              </Text>
              <Line size='1 15' />
              {
                phoneList.map((item, index) => (
                  <Box key={index}>
                    <Flex flex='frbc' size='100% 90'>
                      <Flex flex='frse'>
                        <Text fontSize='28' fontStyle='italic' color={styles.textColorGray}>{index + 1}.</Text>
                        <Line size='12 1' />
                        <Text color={styles.textColor}>{item}</Text>
                      </Flex>
                      <Press
                        onClick={() => {
                          let temp = [...phoneList]
                          temp.splice(index, 1)
                          setPhoneList(temp)
                          if(buyNum > 1){
                            setBuyNum(prev => prev - 1)
                          }
                        }}
                      >
                        <Image src={ICON_DELETE} size='42 42' />
                      </Press>
                    </Flex>
                    <Line size='100% 1' bgColor={styles.lineColor} />
                  </Box>
                ))
              }
              <Line size='1 15' />
              <Flex flex='frbc' size='100% auto'>
                <Input
                  type='number'
                  size='410 80'
                  pColor={styles.textColorGray}
                  color={styles.textColor}
                  bgColor={styles.boxColorGray}
                  radius='40'
                  padding='0 25'
                  placeholder='请输入手机号'
                  value={inputPhone}
                  onInput={(value) => {
                    setInputPhone(value)
                  }}
                />
                <Button
                  size='200 80'
                  radius='40'
                  bgImage='linear-gradient(to right , #fcc661, #f78874)'
                  onClick={() => {
                    if(!isPhone(inputPhone)) {
                      return Taro.showToast({title: '请输入正确的手机号', icon: 'none'})
                    }
                    if(phoneList.indexOf(inputPhone) > -1) {
                      return Taro.showToast({title: '手机号已存在', icon: 'none'})
                    }
                    let tempPhone = [...phoneList, inputPhone]
                    setPhoneList(tempPhone)
                    setInputPhone('')
                    if(tempPhone.length > 1){
                      setBuyNum(prev => prev + 1)
                    }
                  }}
                >
                  添加
                </Button>
              </Flex>


              <Line size='1 25' />
              <Text fontSize='28' color={styles.textColorGray}>请选择电子贺卡</Text>
              <Line size='1 15' />
              <Box size='100% auto' flexWrap='wrap' display='flex'>
                {
                  themeList.length > 0 &&
                  themeList.map((item, index) => (
                    <Press 
                      key={item.id}
                      onClick={() => {
                        setThemeId(item.id)
                      }}
                    >
                      <Box 
                        size='210 300'
                        margin={(index + 1) % 3 === 0 ? '0 0 30 0' : '0 20 30 0'}
                        radius='12'
                        overflow='hidden'
                        shadowColor={themeId === item.id ? styles.colorOrange : styles.lineColor}
                      >
                        <Image size='210 210' src={item.share_image_url} />
                        <Box size='100% auto' padding='4 8'>
                          <Line size='100% 10' />
                          <TextEllipsis line='2' fontSize='28' color={themeId === item.id ? styles.colorOrange : styles.textColor}>{item.title}</TextEllipsis>
                        </Box>
                      </Box>
                    </Press>
                  ))
                }
              </Box>
            </Box>
          </Box>
        }

        <Box size='100% auto' padding='20'>
          <Card>
            <CardItem type='check_one' value={payWay === 1 ? true : false} onClick={() => setPayWay(1)}>
              <Flex flex='frsc'>
                <Image src={ICON_WX_PAY} size='42 42' margin='0 15 0 0' />
                <Text color={styles.textColor} fontSize={styles.textSize}>微信支付</Text>
              </Flex>
            </CardItem>
            <CardItem type='check_one' value={payWay === 5 ? true : false} onClick={() => setPayWay(5)} noBottom>
              <Flex flex='frsc'>
                <Image src={ICON_OWN_PAY} size='42 42' margin='0 15 0 0' />
                <Text color={styles.textColor} fontSize={styles.textSize}>余额支付</Text>
              </Flex>
            </CardItem>
          </Card>
        </Box>

        <Line size='100% 150' safe='bottom' />


        <SafeArea safe='bottom' backdrop='20' bgColor={styles.bottomBoxColor} position='fixed' left='0' bottom='0' size='100% 110'>
          <Line size='100% 1' bgColor={styles.lineColor} />
          <Flex flex='frbc' size='100% 100%' padding='0 30'>
            <Flex flex='fcbs'>
              <Text color={styles.colorRed}>合计: <Text fontWeight='bold' color={styles.colorRed}>￥{new Decimal(options.open_group === 1 ? detail.group_price : detail.price).mul(new Decimal(buyNum)).toNumber().toFixed(2)}</Text></Text>
              <Text color={styles.textColorGray} fontSize='28'>购买数量: x{buyNum}</Text>
            </Flex>
            {
              options.open_group === 1 ?
              <Button
                size='220 80'
                radius='40'
                letterSpacing='normal'
                disable={detail.can_group !== 1 ? true : false}
                bgImage='linear-gradient(to right , #6cc68c, #36a65d)'
                onClick={() => {
                  if(!currentUser.id){
                    return setIsOpenLogin(true)
                  }
                  if(detail.can_group !== 1){
                    return Taro.showToast({title: '参团未开启', icon: 'none'})
                  }
                  payFruits(detail.can_group)
                }}
              >
                确定参团
              </Button>
              :
              isGift ?
              <Button
                size='220 80'
                radius='40'
                letterSpacing='normal'
                bgImage='linear-gradient(to right , #ff8ea3, #ff7258)'
                onClick={() => {
                  if(!currentUser.id){
                    return setIsOpenLogin(true)
                  }
                  payGift()
                }}
              >
                购买礼物
              </Button>
              :
              <ColorButton
                size='220 80'
                onClick={() => {
                  if(!currentUser.id){
                    return setIsOpenLogin(true)
                  }
                  payFruits()
                }}
              >
                确定
              </ColorButton>
            }
          </Flex>
        </SafeArea>
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

export default BuyProduct