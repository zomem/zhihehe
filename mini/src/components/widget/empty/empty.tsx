import React, {} from 'react'
import {View, Image, Text} from '@tarojs/components'

import IMG_EMPTY_CONTENT from '@/images/pic/empty_content.png'
import IMG_EMPTY_SEARCH from '@/images/pic/empty_search.png'

import './empty.scss'


interface IEmptyProps {
  type?: 'content' | 'search'
  txt?: string
}

function Empty(props: IEmptyProps) {

  const {type='content', txt='你未参与过活动'} = props

  return(
    <View className='_empty_all fcsc'>
      {
        {
          'content': (
            <Image className='_empty_img' src={IMG_EMPTY_CONTENT} />
          ),
          'search': (
            <Image className='_empty_img' src={IMG_EMPTY_SEARCH} />
          ),
        }[type]
      }
      <Text className='fs15 fc3e'>{txt}</Text>
    </View>
  )
}


export default Empty