import React, { useEffect, useState } from 'react'
import {View, Image} from '@tarojs/components'
import Taro from '@tarojs/taro'

import useNavTabInfo from '@/hooks/useNavTabInfo'

import ICON_TIP_SUCCESS from '@/images/icons/tip_success.svg'
import ICON_TIP_ERROR from '@/images/icons/tip_error.svg'
import ICON_TIP_WARNING from '@/images/icons/tip_warning.svg'

import './toast.scss'

interface IToastProps {
  title: string
  type?: 'success' | 'error' | 'warning'
  onFinish?: Function
}

let animate = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration: 500,
  timingFunction: "ease",
  delay: 0
})

function Toast(props: IToastProps){

  const {title='', type='success', onFinish=() => {}} = props
  const [animation, setAnimation] = useState<IAnimate>({actions: []})

  const navInfo = useNavTabInfo()

  useEffect(() => {
    if(title){
      animate.top(0).step()
      setAnimation(animate.export())
      setTimeout(() => {
        animate.top(-(navInfo.appHeaderHeight+40)).step()
        setAnimation(animate.export())
        setTimeout(() => {
          onFinish()
        }, 500);
      }, 2000);
    }
  }, [animate, title, navInfo])

  return (
    <View
      animation={animation}
      className={`_toast_all frsc`}
      style={{
        top: `-${navInfo.appHeaderHeight + 40}PX`,
        height: navInfo.appHeaderHeight + 'PX',
        paddingTop: navInfo.statusBarHeight + 'PX'
      }}
    >
      <Image 
        className='_toast_icon'
        src={
          type === 'success' ? ICON_TIP_SUCCESS :
          type === 'warning' ? ICON_TIP_WARNING :
          ICON_TIP_ERROR
        }
      />
      <View>{title}</View>
    </View>
  )
}


export default Toast