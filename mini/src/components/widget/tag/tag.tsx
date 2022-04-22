import React, { useEffect } from 'react'
import {View} from '@tarojs/components'


import './tag.scss'


interface ITagProps {
  title?: string
  onClick?: Function
  colorType?: 'red' | 'green' | 'yellow' | 'gray' | 'blue'
  margin?: string
  sizeType?: 'small' | 'large'
}

const color = {
  red: '#ef4040',
  green: '#36bd1a',
  yellow: '#ff9f41',
  gray: '#bdbdbd',
  blue: '#326de1',
}
const bgColor = {
  red: '#ef4040',
  green: '#36bd1a',
  yellow: 'rgba(255, 159, 65, 0.08)',
  gray: '#bdbdbd',
  blue: 'rgba(50, 109, 225, 0.08)',
}

function Tag (props: ITagProps) {

  // const colorList = ['yellow', 'blue']

  // const ranNum = Math.random() * 2 >>> 1
  const {title='', colorType='yellow', onClick=()=>{}, margin='0rpx 8rpx 10rpx 0rpx', sizeType='small'} = props


  return (
    <View 
      style={{
        backgroundColor: bgColor[colorType],
        margin: margin,
        color: color[colorType],
        border: `1rpx solid ${color[colorType]}`
      }}
      className={sizeType === 'large' ? '_tag_all_large frcc' : '_tag_all frcc'}
      onClick={() => {
        onClick()
      }}
    >
      {title}
    </View>
  )
}


export default Tag