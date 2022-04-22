import React, {ReactNode, useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'


import './widget.scss'

interface Modal {
  children?: ReactNode
  isShow?: boolean
  title?: string
  content?: string
  onCancel?: () => void
  onConfirm?: (e?: any) => void
  cancelTxt?: string
  confirmTxt?: string
  isHaveCancel?: boolean
  isHaveConfirm?: boolean
}

const animation = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration:500,
  timingFunction: "ease",
  delay: 0
})

export default (props: Modal) => {
  const {styles} = useSelector((state: ReduxState) => state)
  const {windowHeight, windowWidth} = Taro.getSystemInfoSync()

  const {
    isShow=false,
    title='',
    content='',
    onCancel=() => {}, 
    onConfirm=() => {},
    cancelTxt='取消',
    confirmTxt='确定',
    isHaveCancel=true,
    isHaveConfirm=true,
    children
  } = props
  
  const [animate, setAnimate] = useState<Animate>({actions: []})
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if(isShow){
      setSize({
        width: windowWidth,
        height: windowHeight
      })
      animation.opacity(1).step()
      setAnimate(animation.export())
    }else{
      animation.opacity(0).step()
      setAnimate(animation.export())
      setTimeout(() => {
        setSize({
          width: 0,
          height: 0
        })
      }, 500);
    }
  }, [isShow, windowWidth, windowHeight])

  return(
    <View
      animation={animate}
      style={{
        width: size.width + 'px',
        height: size.height + 'px',
      }}
      className='_modal_back'
      onClick={() => {
        onCancel()
      }}
    >
      <View 
        className='_modal_content'
        style={{backgroundColor: styles.navigationBgColor}}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {
          size.width > 0 &&
          <View>
            <View className='_modal_title' style={{fontSize: styles.textSize, color: styles.textColor}}>
              {title}
            </View>
            <View className='_modal_cancel_txtcon'>
              {
                children ? children :
                <Text className='_modal_tile_des' style={{fontSize: styles.textSizeS, color: styles.textColor}}>{content}</Text>
              }
            </View>
            
            {
              (isHaveCancel || isHaveConfirm) &&  
              <View className='_modal_cancel_confirm' >
                {
                  isHaveCancel &&
                  <View 
                    className='_modal_cancel'
                    style={{
                      border: `1px solid ${styles.themeColor}`
                    }}
                    hoverClass='_modal_hover'
                    onClick={() => {
                      onCancel()
                    }}
                  >
                    {cancelTxt}
                  </View>
                }
                {
                  isHaveConfirm &&
                  <Button 
                    className='_modal_confirm'
                    style={{
                      width: isHaveCancel ? '280rpx' : '360rpx',
                      backgroundColor: styles.themeColor,
                      border: `1px solid ${styles.themeColor}`
                    }}
                    hoverClass='_modal_hover'
                    onClick={() => {
                      onConfirm()
                    }}
                  >
                    {confirmTxt}
                  </Button>
                }
              </View>
            }
          </View>
        }
      </View>
    </View>
  )
}

