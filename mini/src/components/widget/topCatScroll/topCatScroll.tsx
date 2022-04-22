import React, {} from 'react'
import {View, ScrollView, Text} from '@tarojs/components'


import './topCatScroll.scss'


interface ITopCatScrollList {
  id: string | number
  name: string
}
interface ITopCatScrollProps {
  type?: 'default'
  list: ITopCatScrollList[]
  current?: number
  onChange?: (value: number) => void
  height?: string
}

function TopCatScroll(props: ITopCatScrollProps) {
  const {type='default', list=[], current=-1, onChange=() => {}, height='32PX'} = props

  return(
    <view className='_top_cat_scroll' style={{height: height}}>
      {
        {
          'default': (
            <ScrollView 
              className='_top_cat_scroll_d'
              scrollX
            >
              {
                list.length > 0 &&
                list.map((item, index) => (
                  <View className='_top_cat_scroll_d_item_con' key={item.id}>
                    <View className='_top_cat_scroll_d_item_con2 fccc'>
                      <View 
                        className={current === index ? '_top_cat_scroll_d_item _top_cat_scroll_d_item_select' : '_top_cat_scroll_d_item'}
                        onClick={() => {
                          onChange(index)
                        }}
                      >
                        {item.name}
                      </View>
                    </View>
                  </View>
                ))
              }
            </ScrollView>
          )
        }[type]
      }
    </view>
  )
}


export default TopCatScroll