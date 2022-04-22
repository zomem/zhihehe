import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Taro from '@tarojs/taro'
import {Decimal} from 'decimal.js'

import Page from '@/components/widget/Page'
import OrderItem from '@/components/OrderItem'
import Login from '@/components/widget/Login'
import ColorButton from '@/components/widget/colorButton/colorButton'
import AddressItem from '@/components/widget/AddressItem'
import Loading from '@/components/widget/Loading'
import {Block, Box, Flex, SafeArea, Text, Press, Line} from '@/components/widget/Components'


import {get, post} from '@/constants/fetch'


function Buy() {
  const dispatch = useDispatch()
  const {currentUser} = useSelector((state: ReduxState) => state)

  const [list, setList] = useState([])
  const [total, setTotal] = useState({
    count: 0,
    price: 0
  })

  const [addr, setAddr] = useState({
    name: '收件人',
    phone: '',
    address: '请选择收货地址'
  })

  const [isOpenLogin, setIsOpenLogin] = useState(false)

  const calTotal = (arr) => {
    let c=0, p=0
    for(let a of arr){
      if(a.is_select === 1){        
        c += a.count
        p = new Decimal(p).add(new Decimal(a.price).mul(new Decimal(a.count))).toNumber()
      }
    }
    setTotal({count: c, price: p})
  }


  useEffect(() => {
    if(currentUser.id){
      get('/zhihehe/shopCart/list/1', dispatch).then(res => {
        let tempList = res.data
        setList(tempList)
        calTotal(tempList)
      })
    }
  }, [currentUser.id])
  
  const payFruits = () => {

    if(!addr.phone){
      return Taro.showToast({title: '请选择收货信息', icon: 'none'})
    }
    
    post('/pay/buy/shop_cart', {
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

  return (
    <Block>
      <Page navTitle='确认订单'>                
        <Box size='100% auto' padding='30'>
          <Press
            onClick={async () => {
              let addrInfo = await Taro.chooseAddress()
              setAddr({
                name: addrInfo.userName,
                phone: addrInfo.telNumber,
                address: addrInfo.provinceName + addrInfo.cityName + addrInfo.countyName + addrInfo.detailInfo
              })
            }}
          >
            <Flex flex='fccc' size='100% auto'>
              <AddressItem item={addr} />
            </Flex>
          </Press>
        </Box>

        <Box size='100% auto' padding='30' margin='-30 0 0 0'>
          {
            list.length === 0 &&
            <Box padding='30'>
              <Loading title='您还没有添加商品' />
            </Box>
          }
          {
            list.length > 0 &&
            list.map((item: any, index) => (
              <Box>
                <OrderItem
                  type='order_shop_info'
                  item={item}
                  num={item.count}
                />
                <Line size='1 15' />
              </Box>
            ))
          }
        </Box>
        <Line type='bottom' size='1 120' />



        <SafeArea safe='bottom' bgColor='#ffffff' shadowColor='#efefef' position='fixed' left='0' bottom='0' size='100% 130'>
          <Flex flex='frbc' size='100% 100%' padding='0 30'>
            <Flex flex='fcbs'>
              <Text color='#ff7310'>合计: <Text fontWeight='bold' color='#ff7310'>￥{total.price.toFixed(2)}</Text></Text>
              <Text color='#676464' fontSize='28'>购买数量: x{total.count}</Text>
            </Flex>
            <ColorButton
              size='220 95'
              onClick={() => {
                if(!currentUser.id){
                  return setIsOpenLogin(true)
                }
                payFruits()
              }}
            >
              确定
            </ColorButton>
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

export default Buy