import React, {} from 'react'
import Taro from '@tarojs/taro'
import {View, Image, Text} from '@tarojs/components'

import './productItem.scss'

interface IProductItem {
  type?: 'cardList'
  onAmount?: Function
  disableAmount?: boolean
  item?: {
    id: number
    title: string
    content: string
    cover_url: string
    img_urls: string
    status: number
    price: number
    dis_price: number
    quantity: number
    score: number
    type: number
    sort: number
    score_type: number
  }
}



function ProductItem(props: IProductItem) {

  const {
    item={
      id: 0,
      title: '',
      score: 0,
      cover_url: '',
    }, 
    type='cardList',
  } = props

  return(
    <View>
      {
        {
          'cardList': (
            <View 
              className='_productItem_content'
              onClick={() => {
                
              }}
            >
              <Image className='_productItem_cover' src={item.cover_url || ''} mode='widthFix' />
              <View className='_productItem_bottom'>
                <Text className='_productItem_title'>{item.title}</Text>
                <Text className='_productItem_price'>
                  <Text className='_productItem_price_y'>￥</Text>
                  {item.score}
                  <Text className='_productItem_ex'>{0}人已兑换</Text>
                </Text>
              </View>
            </View>
          )
        }[type]
      }
    </View>
    
  )
}

export default ProductItem