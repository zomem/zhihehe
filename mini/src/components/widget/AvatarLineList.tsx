
import React, {useState, useEffect} from "react"
import {View, Image, Text} from '@tarojs/components'
import Taro from "@tarojs/taro"

import AvatarMoreImg from './icons/avatar_more.svg'

import './widget.scss'



interface IAvatarLineListProps {
  type?: 'avatar' | 'avatar_txt'
  txt?: string
  allNum: number
  avatars: string[]
  padding?: string
  animation?: 'none'
  refresh?: number
  delay?: number
}


const Animation = Taro.createAnimation({
  duration: 1500,
  timingFunction: "ease",
  delay: 0
})



function AvatarLineList(props: IAvatarLineListProps) {

  const {type='avatar', avatars=[], padding='0', txt='人', allNum=0, refresh=0, delay=2800} = props
  const [animateR, setAnimateR] = useState<Animate>({actions: []})
    
  useEffect(() => {
    if(refresh > 0){
      setTimeout(() => {
        Animation.opacity(0).step({duration: 0})
        setAnimateR(Animation.export())
        setTimeout(() => {
          Animation.opacity(1).step()
          setAnimateR(Animation.export())
        }, delay)
      }, 10)
    }
  }, [refresh, delay])

  if(allNum === 0){
    return (
      <View className='_avatar_line_list_all frcc' animation={animateR}>
        <View className='_avatar_line_list_i frcc' style={{paddingLeft: '0rpx'}}>
          <Text className='_avatar_line_list_info'>{txt}</Text>
        </View>
      </View>
    )
  }

  return (
    <View className='_avatar_line_list_all' style={{padding: padding}} animation={animateR}>
      {
        {
          'avatar': (
            <View className='_avatar_line_list frcc'>
              <View className='_avatar_line_list_a'>
                {
                  avatars.map((item, index) => (
                    <View 
                      key={item}
                      className='_avatar_line_list_imgv'
                      style={{
                        marginRight: '-25rpx',
                      }}
                    >
                      <Image
                        className='_avatar_line_list_img'
                        src={item}
                        mode='aspectFill'
                      />
                    </View>
                  ))
                }
                {
                  allNum > avatars.length &&
                  <View 
                    className='_avatar_line_list_imgv'
                    style={{
                      marginRight: '-25rpx',
                    }}
                  >
                    <Image
                      className='_avatar_line_list_img'
                      src={AvatarMoreImg}
                      mode='aspectFill'
                    />
                  </View>
                }
              </View>
            </View>
          ),
          'avatar_txt': (
            <View className='_avatar_line_list frcc'>
              <View className='_avatar_line_list_a'>
                {
                  avatars.map((item, index) => (
                    <View 
                      key={item}
                      className='_avatar_line_list_imgv'
                      style={{
                        marginRight: '-25rpx',
                      }}
                    >
                      <Image
                        className='_avatar_line_list_img'
                        src={item}
                        mode='aspectFill'
                      />
                    </View>
                  ))
                }
                {
                  allNum > avatars.length &&
                  <View 
                    className='_avatar_line_list_imgv'
                    style={{
                      marginRight: '-25rpx',
                    }}
                  >
                    <Image
                      className='_avatar_line_list_img'
                      src={AvatarMoreImg}
                      mode='aspectFill'
                    />
                  </View>
                }
              </View>
              <View className='_avatar_line_list_i frse'>
                <Text className='_avatar_line_list_info'>已有</Text>
                <Text className='_avatar_line_list_info_n'>{allNum}</Text>
                <Text className='_avatar_line_list_info'>{txt}</Text>
              </View>
            </View>
          )
        }[type]
      }
    </View>
  )
}


export default AvatarLineList