import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {Box, Flex, Text, Press, ScrollView} from '@/components/widget/Components'
import { Block } from '@tarojs/components'
import Taro from '@tarojs/taro'

const RTX = Taro.getSystemInfoSync().windowWidth / 750


interface ListItem {
  id?: number
  title?: string
}
interface ChangeTab {
  list: ListItem[]
  current?: number
  onChange?: Function
  isScroll?: boolean
  itemWidth?: string
}

const CatLine = (props: ChangeTab) => {
  const {list, current=0, onChange=() => {}, isScroll=false, itemWidth} = props
  const {styles} = useSelector((state: ReduxState) => state)

  
  return (
    <Block>
      {
        !isScroll ?
        <Flex size='100% 93' flex='frac' bgColor={styles.boxColor} radius='30'>
          {
            list.length > 0 &&
            list.map((item, index) => (
              <Press onClick={() => {onChange(index)}} key={item.id}>
                <Flex size='auto 93' padding='0 25' flex='frcc'>
                  {
                    current === index ?
                    <Text fontSize={styles.textSize} color={styles.colorGreen} >{item.title}</Text>
                    :
                    <Text fontSize={styles.textSize} color={styles.textColor}>{item.title}</Text>
                  }
                </Flex>
              </Press>
            ))
          }
        </Flex>
        :
        <ScrollView scrollX scrollLeft={itemWidth ? ((current - 1) * (+itemWidth + 50)) * RTX : undefined} size='100% 93' bgColor={styles.boxColor} radius='30' padding='0 20' scrollWithAnimation>
          <Box size='auto 93' whiteSpace='nowrap'>
            {
              list.length > 0 &&
              list.map((item, index) => (
                <Press onClick={() => {onChange(index)}} key={item.id} display='inline-block'>
                  <Flex flex='frcc' size={`${itemWidth || '100%'} 93`} margin='0 25'>
                    {
                      current === index ?
                      <Text fontSize={styles.textSize} color={styles.colorGreen} >{item.title}</Text>
                      :
                      <Text fontSize={styles.textSize} color={styles.textColor} >{item.title}</Text>
                    }
                  </Flex>
                </Press>
              ))
            }
          </Box>
        </ScrollView>
      }
    </Block>
  )
}

export default CatLine