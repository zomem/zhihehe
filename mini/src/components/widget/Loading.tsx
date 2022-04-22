import React, {} from 'react'
import {useSelector} from 'react-redux'
import {View} from '@tarojs/components'
import {Text} from '@/components/widget/Components'

import './widget.scss'


interface LoadingProps {
  title?: string
  type?: 'three_bounce' | 'fading_circle' | 'timer' | 'line_fade'
}

export default (props: LoadingProps) => {
  const { title, type='three_bounce' } = props
  const {styles} = useSelector((state: ReduxState) => state)

  return(
    <View className='_loading_all'>
      {
        title ? (
          <Text fontSize={styles.textSizeXS} color={styles.textColorGray}>{title}</Text>
        ) : (
          <View>
            {
              {
                'three_bounce': (
                  <View className="_loading_spinner" style={{width: '100%'}}>
                    <View className="_loading_bounce1" ></View>
                    <View className="_loading_bounce2" ></View>
                    <View className="_loading_bounce3" ></View>
                  </View>
                ),
                'fading_circle': (
                  <View className="sk-fading-circle">
                    <View className="sk-circle1 sk-circle"></View>
                    <View className="sk-circle2 sk-circle"></View>
                    <View className="sk-circle3 sk-circle"></View>
                    <View className="sk-circle4 sk-circle"></View>
                    <View className="sk-circle5 sk-circle"></View>
                    <View className="sk-circle6 sk-circle"></View>
                    <View className="sk-circle7 sk-circle"></View>
                    <View className="sk-circle8 sk-circle"></View>
                    <View className="sk-circle9 sk-circle"></View>
                    <View className="sk-circle10 sk-circle"></View>
                    <View className="sk-circle11 sk-circle"></View>
                    <View className="sk-circle12 sk-circle"></View>
                  </View>
                ),
                'timer': (
                  <View 
                    className="timer"
                  >
                  </View>
                ),
              }[type]
            }
          </View>
        )
      }
    </View>
  )
}

