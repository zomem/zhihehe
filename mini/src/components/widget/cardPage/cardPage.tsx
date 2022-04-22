import React, { ReactNode } from 'react'
import {View, ScrollView} from '@tarojs/components'


import BlockLine from '@/components/widget/blockLine/blockLine'

import './cardPage.scss'


interface ICardPageProps {
  children?: ReactNode
  isScrollView?: boolean
  height?: number
  padding?: string
  bgColor?: string
  onScrollBottom?: Function
  //padding?: string
  marginTop?: number  //用于向上偏移量
}

function CardPage(props: ICardPageProps) {

  const {
    children, 
    isScrollView, 
    height=360, 
    padding='25rpx',
    bgColor='#f5f7fa',
    onScrollBottom=() => {},
    marginTop=0
  } = props

  return(
    <View 
      className='_cardPage_all'
      style={{
        height: height - marginTop + 'PX',
        backgroundColor: bgColor,
        marginTop: marginTop + 'PX'
      }}
    >
      {
        !isScrollView ? 
        <View className='_cardPage_con' style={{padding: padding}} >
          {children}
        </View>
        :
        <ScrollView
          scrollY
          style={{
            height: height - marginTop + 'px',
          }}
          onScrollToLower={() => {
            onScrollBottom()
          }}
          className='_card_page_scroll'
        >
          <View className='_cardPage_con2' style={{padding: padding}}>
            {children}
          </View>
          <BlockLine isFitX color='#f5f7fa' />
        </ScrollView>
      }
    </View>
  )
}

export default CardPage