import React, {ReactNode} from 'react'
import {View} from '@tarojs/components'


import './blockView.scss'

interface IBlockViewProps {
  padding?: string
  children?: ReactNode
  flex?: string
  height?: string
  margin?: string
}

function BlockView(props: IBlockViewProps){

  const {padding='0rpx 25rpx 0rpx 25rpx', margin='0', children, flex, height} = props

  return (
    <View 
      className={`_block_view_all ${flex}`} 
      style={{
        padding: padding,
        margin: margin,
        height: height ? height : 'auto',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </View>
  )
}

export default BlockView