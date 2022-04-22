import React, {useState, useEffect} from 'react'
import Taro from '@tarojs/taro'

interface INavInfo {
  statusBarHeight: number
  titleBarHeight: number
  titelBarWidth: number
  appHeaderHeight: number
  marginSides: number
  capsuleWidth: number
  capsuleHeight:number
  capsuleLeft: number
  screenHeight: number
  windowHeight: number
  windowWidth: number
  top: number
}

function useNavTabInfo(): INavInfo {
  const [navInfo, setNavInfo] = useState({
    statusBarHeight: 0,
    titleBarHeight: 0,
    titelBarWidth: 0,
    appHeaderHeight: 0,
    marginSides: 0,
    capsuleWidth: 0,
    capsuleHeight: 0,
    capsuleLeft: 0,
    screenHeight: 0,
    windowHeight: 0,
    windowWidth: 0,
    top: 0,
  })

  useEffect(() => {
    const { statusBarHeight, screenWidth, screenHeight, windowHeight, platform, windowWidth } = Taro.getSystemInfoSync()
    // 获取胶囊信息
    const { width, height, left, top, right, bottom } = Taro.getMenuButtonBoundingClientRect()
    // 计算标题栏高度
    let titleBarHeight = height + (top - statusBarHeight) * 2
    // 计算导航栏高度
    let appHeaderHeight = statusBarHeight + titleBarHeight //
    if(platform === 'ios' || platform === 'devtools') {
      appHeaderHeight = appHeaderHeight + (top - statusBarHeight)
      titleBarHeight = titleBarHeight + (top - statusBarHeight)
    }
    //边距，两边的
    let marginSides = screenWidth - right
    //标题宽度
    let titelBarWidth = screenWidth - width - marginSides * 3
    //去掉导航栏，屏幕剩余的高度

    setNavInfo({
      statusBarHeight: statusBarHeight, //状态栏高度
      titleBarHeight: titleBarHeight,  //标题栏高度
      titelBarWidth: titelBarWidth,  //标题栏宽度
      appHeaderHeight: appHeaderHeight, //整个导航栏高度
      marginSides: marginSides, //侧边距
      capsuleWidth: width, //胶囊宽度
      capsuleHeight: height, //胶囊高度
      capsuleLeft: left,
      screenHeight: screenHeight,
      windowHeight: windowHeight,
      windowWidth: windowWidth,
      top: top,
    })
  }, [])
  return navInfo
}


export default useNavTabInfo