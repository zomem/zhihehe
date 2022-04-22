import React, {} from 'react'
import {View} from '@tarojs/components'

import './blockLine.scss'

interface IBlockLine {
  color?: string
  height?: number
  isFitX?: boolean  //适配iphonex
}

function BlockLine (props: IBlockLine) {
  const {color='#f5f7fa', height=15, isFitX=false} = props

  return(
    <View
      style={{
        backgroundColor: color,
        width: '100%',
        height: height + 'rpx',
        paddingBottom: isFitX ? `env(safe-area-inset-bottom)` : '0',
      }}
    >

    </View>
  )
}

export default BlockLine