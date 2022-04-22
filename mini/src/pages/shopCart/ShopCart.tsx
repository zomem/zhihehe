import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Taro, {useDidShow} from '@tarojs/taro'
import {Decimal} from 'decimal.js'


import {get, put} from '@/constants/fetch'
import {Block, Flex, Line, Box, SafeArea, Text, Press, Image} from '@/components/widget/Components'
import OrderItem from '@/components/OrderItem'
import Loading from '@/components/widget/Loading'
import Page from '@/components/widget/Page'

import IMG_SHOP_CART from '@/images/pic/shopcart.jpg'
import ICON_SELECT from '@/images/select.png'
import ColorButton from '@/components/widget/colorButton/colorButton'


function ShopCart() {
  const dispatch = useDispatch()
  const {currentUser} = useSelector((state: ReduxState) => state)

  const [list, setList] = useState([])
  const [r, setR] = useState(0)
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [total, setTotal] = useState({
    count: 0,
    price: 0
  })
  const [isEdit, setIsEdit] = useState(false)

  useDidShow(() => {
    setR(r + 1)
  })



  const checkIsSelectAll = (arr) => {
    let sall = true, c=0, p=0
    for(let a of arr){
      if(a.is_select === 1){        
        c += a.count
        p = new Decimal(p).add(new Decimal(a.price).mul(new Decimal(a.count))).toNumber()
      }
      if(a.is_select === 0 && sall){
        sall = false
      }
    }
    if(arr.length === 0){
      sall = false
    }
    setTotal({count: c, price: p})
    setIsSelectAll(sall)
  }
  
  useEffect(() => {
    if(r > 0 && currentUser.id){
      get('/zhihehe/shopCart/list/0', dispatch).then(res => {
        setList(res.data)
        checkIsSelectAll(res.data)
      })
    }
  }, [r, currentUser.id])

  //选择与取消选择,数量更改
  const change = async (item, index, num=0) => {
    put('/zhihehe/shopCart/change', {
      pid: item.pid,
      aid: item.aid,
      count: num || item.count,
      is_select: num ? item.is_select : (item.is_select === 1 ? 0 : 1),
    }, dispatch).then(res => {
      let tempList: any = [...list]
      tempList[index] = res.data
      setList(tempList)
      checkIsSelectAll(tempList)
    })
  }

  // 全选，取消全选
  const changeall = async () => {
    put('/zhihehe/shopCart/changeall', {
      is_select_all: isSelectAll ? 0 : 1
    }, dispatch).then(res => {
      let tempList = res.data
      setList(tempList)
      checkIsSelectAll(tempList)
    })
  }

  // 删除
  const deleteShop = async () => {
    put('/zhihehe/shopCart/del', {}, dispatch).then(res => {
      if(res.data.status === 2){
        Taro.showToast({title: res.data.message, icon: 'none'})
      }
      setR(r + 1)
    })
  }


  return (
    <Page >
      <SafeArea safe='top' size='100% 220' bgImage={`url(${IMG_SHOP_CART})`}>
        <Flex flex='frbc' padding='80 50 20 50'>
          <Flex flex='fcbs'>
            <Text fontSize='34' color='#1a1a1a'>购物车</Text>
            <Text fontSize='28' color='#8a8a8a'>您一共有5件商品</Text>
          </Flex>
          <Press onClick={() => setIsEdit(prev => !prev)}>
            <Text fontSize='28' color='#1a1a1a'>{isEdit ? '完成' : '编辑'}</Text>
          </Press>
        </Flex>
      </SafeArea>
      <Box size='100% auto' padding='0 30 30 30' margin='-30 0 0 0'>
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
                type='order_shop'
                item={item}
                num={item.count}
                onNumber={(num) => {
                  change(item, index, num)
                }}
                onSelect={() => {
                  change(item, index)
                }}
              />
              <Line size='1 15' />
            </Box>
          ))
        }
      </Box>
      <Line type='bottom' size='1 120' />

      <Box bgColor='#ffffff' size='100% 120' position='fixed' bottom='0' left='0'>
        <Line size='100% 1' bgColor='#efefef' />
        <Flex flex='frbc' padding='0 30 0 20' size='100% 100%'>
          <Press onClick={() => {changeall()}}>
            <Flex flex='fcbc' size='120 80'>
              {
                isSelectAll ?
                <Image size='42 42' src={ICON_SELECT} />
                :
                <Box size='42 42' borderColor='#ff7310' radius='21'></Box>
              }
              <Text fontSize='24' color='#666666'>{isSelectAll ? '取消全选' : '全选'}</Text>
            </Flex>
          </Press>
          {
            isEdit ?
            <Flex flex='frbc'>
              <Flex flex='fcce' size='auto 80' margin='0 18 0 0'>
                <Text>共{total.count}件</Text>
              </Flex>
              <ColorButton 
                size='160 70'
                onClick={deleteShop}
              >
                删除
              </ColorButton>
            </Flex>
            :
            <Flex flex='frbc'>
              <Flex flex='fcbe' size='auto 80' margin='0 18 0 0'>
                <Text>合计￥{total.price.toFixed(2)}</Text>
                <Text fontSize='28' color='#888888'>共{total.count}件</Text>
              </Flex>
              <ColorButton 
                size='160 70'
                disable={total.price ? false : true}
                onClick={() => {
                  Taro.navigateTo({url: '/pages/shopCart/Buy'})
                }}
              >
                去结算
              </ColorButton>
            </Flex>
          }
        </Flex>
      </Box>
    </Page>
  )
}


export default ShopCart