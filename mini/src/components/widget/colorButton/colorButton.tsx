import React, { ReactChild } from 'react'
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'


import './colorButton.scss'

// 单位，默认微信小程序的 rpx
const zpx = 'rpx'

interface IColorButton {
  type?: 'blue_light' | 'blue_light_line' | 'blue_light_shadow' | 'gray' | 'little_blue' | 'op_white' | 'gray_disable'
  children: ReactChild 
  size?: string
  onClick?: () => void
  isFixAnimate?: boolean
  disable?: boolean
  spacing?: string
  txtColor?: string
}

function ColorButton(props: IColorButton) {
  const {
    type='blue_light', 
    children,
    onClick=() => {},
    disable=false,
    spacing='2',
    isFixAnimate = true,
    txtColor='#3d3d3d'
  } = props

  const sys = Taro.getSystemInfoSync()

  return (
    <View>
      {
        {
          'blue_light': (
            <View 
              className={disable ? '_color_button_disable fccc' : '_color_button fccc'}
              style={{
                width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + zpx) : '500' + zpx,
                height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + zpx) : '90' + zpx,
                letterSpacing: spacing,
                borderRadius: props.size ? (props.size.split(' ')[1].includes('auto') ? '0' : props.size.split(' ')[1].includes('%') ? '50%' : parseInt(props.size.split(' ')[1]) / 2 + zpx) : '45' + zpx,
              }}
              onClick={() => {
                if(disable) return
                if(sys.platform === 'android' && isFixAnimate){
                  setTimeout(() => {
                    onClick()
                  }, 240)
                }else{
                  onClick()
                }
              }}
            >
              {children}
            </View>
          ),
          'blue_light_shadow': (
            <View 
              className={disable ? '_color_button fccc' : '_color_button fccc'}
              style={{
                width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + zpx) : '500' + zpx,
                height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + zpx) : '90' + zpx,
                letterSpacing: spacing,
                borderRadius: '16rpx',
                boxShadow: '1rpx 1rpx 10rpx 2rpx rgba(84, 123, 228, 0.43)'
              }}
              onClick={() => {
                if(sys.platform === 'android' && isFixAnimate){
                  setTimeout(() => {
                    onClick()
                  }, 240)
                }else{
                  onClick()
                }
              }}
            >
              {children}
            </View>
          ),
          'blue_light_line': (
            <View 
              className={disable ? '_color_button_line fccc' : '_color_button_line fccc'}
              style={{
                width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + zpx) : '500' + zpx,
                height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + zpx) : '90' + zpx,
                letterSpacing: spacing,
              }}
              onClick={() => {
                if(sys.platform === 'android' && isFixAnimate){
                  setTimeout(() => {
                    onClick()
                  }, 240)
                }else{
                  onClick()
                }
              }}
            >
              {children}
            </View>
          ),
          'gray': (
            <View 
              className={disable ? '_color_button_gray fccc' : '_color_button_gray fccc'}
              style={{
                width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + zpx) : '500' + zpx,
                height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + zpx) : '90' + zpx,
                letterSpacing: spacing,
              }}
              onClick={() => {
                if(sys.platform === 'android' && isFixAnimate){
                  setTimeout(() => {
                    onClick()
                  }, 240)
                }else{
                  onClick()
                }
              }}
            >
              {children}
            </View>
          ),
          'gray_disable': (
            <View 
              className={disable ? '_color_button_gray_disable fccc' : '_color_button_gray_disable fccc'}
              style={{
                width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + zpx) : '500' + zpx,
                height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + zpx) : '90' + zpx,
                letterSpacing: spacing,
              }}
              onClick={() => {
                if(sys.platform === 'android' && isFixAnimate){
                  setTimeout(() => {
                    onClick()
                  }, 240)
                }else{
                  onClick()
                }
              }}
            >
              {children}
            </View>
          ),
          'little_blue': (
            <View 
              className={disable ? '_color_button_little_blue fccc' : '_color_button_little_blue fccc'}
              style={{
                width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + zpx) : '500' + zpx,
                height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + zpx) : '90' + zpx,
                letterSpacing: spacing,
              }}
              onClick={() => {
                if(sys.platform === 'android' && isFixAnimate){
                  setTimeout(() => {
                    onClick()
                  }, 240)
                }else{
                  onClick()
                }
              }}
            >
              {children}
            </View>
          ),
          'op_white': (
            <View 
              className={disable ? '_color_button_op_white fccc' : '_color_button_op_white fccc'}
              style={{
                width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + zpx) : '500' + zpx,
                height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + zpx) : '90' + zpx,
                letterSpacing: spacing,
                color: txtColor,
              }}
              onClick={() => {
                if(sys.platform === 'android' && isFixAnimate){
                  setTimeout(() => {
                    onClick()
                  }, 240)
                }else{
                  onClick()
                }
              }}
            >
              {children}
            </View>
          ),
        }[type]
      }
    </View>
  )
}

export default ColorButton