import React, {ReactNode, useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import Taro from '@tarojs/taro'
import {ScrollView, Image, View, Text, Block} from '@tarojs/components'
import {TextEllipsis} from '@/components/widget/Components'
import useNavTabInfo from '@/hooks/useNavTabInfo'
import {ZPX} from '@/constants/constants'


import './widget.scss'


interface PageProps {
  children?: ReactNode
  onScrollToUpper?: Function
  onScrollToLower?: Function
  noScroll?: boolean     //是否可以纵向滚动
  enhanced?: boolean
  bounces?: boolean
  lowerThreshold?: string
  
  bgColor?: string
  bgImage?: string
  padding?: string
  
  type?: 'logopage' | 'subpage' | 'tabpage'
  
  navTitle?: string
  navLogoIcon?: string
  navTitleColor?: string
  navBgColor?: string
  isNavBlur?: boolean  // 是否开启毛玻璃
  navHomePath?: string

  isContentStartUnder?: boolean  // 导航栏是否压在内容上，刚开始的时候
  isAlwaysShowNav?: boolean  //刚开始，是否显示导航栏背景。不显示，则会以下拉动画显示
}

var animation = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration: 150,
  timingFunction: "linear",
  delay: 0
})

const distance = 25

export default (props: PageProps) => {

  const {styles} = useSelector((state: ReduxState) => state)
  const {
    children, 
    onScrollToUpper=()=>{},
    onScrollToLower=()=>{},
    noScroll=false, 
    enhanced=false, 
    bounces=true,
    lowerThreshold='50',
    
    bgColor='',
    bgImage='none',
    padding='0',

    type='subpage',
    
    navTitle='',
    navLogoIcon='',
    navTitleColor='',
    navBgColor='',
    isNavBlur=true,
    navHomePath='/pages/index/Index',

    isContentStartUnder=false,
    isAlwaysShowNav=false
  } = props
  const navInfo = useNavTabInfo()
  const [navBgAnimate, setNavBgAnimate] = useState<Animate>({actions: []})
  const [showNav, setShowNav] = useState(false)

  const [navTo, setNavTo] = useState(0)

  useEffect(() => {
    let l = Taro.getCurrentPages().length
    if(l > 1){
      setNavTo(2)
    }else{
      setNavTo(1)
    }
  }, [])

  return(
    <Block>
      <View
        className='_navigation_all'
        style={{
          height: navInfo.appHeaderHeight + 'px',
          paddingTop: navInfo.statusBarHeight + 'px',
          paddingLeft: navInfo.marginSides + 'px',
          paddingBottom: navInfo.top - navInfo.statusBarHeight + 'px',
        }}
      >
        <View 
          className={isNavBlur ? '_navigation_blur _navigation_content' : '_navigation_content'}
          style={{
            height: navInfo.appHeaderHeight + 'px',
            opacity: isAlwaysShowNav ? '1' : '0',
            backgroundColor: navBgColor || styles.navigationBgColor,
            borderBottom: `1rpx solid ${styles.navigationBorderColor}`
          }}
          animation={navBgAnimate}
        />
        <View
          className='_navigation_title'
          style={{
            width: navInfo.titelBarWidth + 'px',
            height: navInfo.titleBarHeight + 'px'
          }}
        >
          {
            {
              'logopage': (
                <View className='_navigation_title_con'>
                  <Image
                    style={{
                      width: navInfo.capsuleHeight - 5 + 'px',
                      height: navInfo.capsuleHeight - 5 + 'px',
                    }} 
                    className='_navigation_logo'
                    src={navLogoIcon} 
                  />
                  <Text className='_navigation_title_st' style={{color: navTitleColor || styles.navigationTextColor}}>{navTitle}</Text>
                </View>
              ),
              'tabpage': (
                <View className='_navigation_title_con_center' style={{paddingLeft: navInfo.capsuleWidth + navInfo.marginSides + 'px'}}>
                  <Text className='_navigation_title_st' style={{color: navTitleColor || styles.navigationTextColor}}>{navTitle}</Text>
                </View>
              ),
              'subpage': (
                <View
                  className='_navigation_title_con_back'
                  onClick={() => {
                    if(navTo <= 1){
                      Taro.switchTab({
                        url: navHomePath
                      })
                    }else{
                      Taro.navigateBack()
                    }
                  }}
                >
                  <View style={{width: navInfo.capsuleWidth + 'px'}} className='_navigation_title_con_back'>
                    <Image
                      style={{
                        width: 36 + 'rpx',
                        height: 36 + 'rpx',
                      }} 
                      className='_navigation_logo'
                      src={navTo <= 1 ? styles.iconNavHome : styles.iconNavBack} 
                    />
                  </View>
                  <View className='_navigation_title_con_center_back' style={{width: (navInfo.windowWidth - (navInfo.capsuleWidth + navInfo.marginSides) * 2 + 'px')}}>
                    <TextEllipsis fontSize='32' fontWeight='bold' line='1' color={navTitleColor || styles.navigationTextColor}>{navTitle}</TextEllipsis>
                  </View>
                </View>
              ),
            }[type]
          }
        </View>
      </View>

      {
        noScroll ? 
        <View
          style={{
            height: navInfo.windowHeight + 'px',
            width: '750rpx',
            position: 'relative',
            backgroundColor: bgColor || styles.pageBgColor,
            backgroundImage: bgImage || styles.pageBgImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment:'fixed',
            overflowX: 'hidden',
            overflowY: 'hidden',
          }}
        >
          <View
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: padding.replace(/\s/g, ZPX + ' ') + ZPX || '0' + ZPX
            }}
          >
            {!isContentStartUnder && <View style={{width: '100%', height: navInfo.appHeaderHeight + 'px'}}/>}
            {children}
          </View>
        </View>
        :
        <ScrollView
          scrollY
          style={{
            height: navInfo.windowHeight + 'px',
            backgroundColor: bgColor || styles.pageBgColor,
            backgroundImage: bgImage || styles.pageBgImage,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment:'fixed',
          }}
          enhanced={enhanced}
          bounces={bounces}
          lowerThreshold={+lowerThreshold}
          onScrollToUpper={() => {
            onScrollToUpper()
            if(showNav){
              if(styles.theme === 'dark'){
                animation.opacity(0).step()
                setNavBgAnimate(animation.export())
                setShowNav(false)
              }else{
                animation.opacity(0).step()
                setNavBgAnimate(animation.export())
                setShowNav(false)
              }
            }
          }}
          onScrollToLower={() => onScrollToLower()}
          onScroll={(e) => {
            if(isAlwaysShowNav) return
            if(e.detail.scrollTop > distance && !showNav){
              if(styles.theme === 'dark'){
                animation.opacity(1).step()
                setNavBgAnimate(animation.export())
                setShowNav(true)
              }else{
                animation.opacity(1).step()
                setNavBgAnimate(animation.export())
                setShowNav(true)
              }
            }
            if(e.detail.scrollTop < distance && showNav){
              if(styles.theme === 'dark'){
                animation.opacity(0).step()
                setNavBgAnimate(animation.export())
                setShowNav(false)
              }else{
                animation.opacity(0).step()
                setNavBgAnimate(animation.export())
                setShowNav(false)
              }
            }
          }}
        >
          <View
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: padding.replace(/\s/g, ZPX + ' ') + ZPX || '0' + ZPX
            }}
          >
            {!isContentStartUnder && <View style={{width: '100%', height: navInfo.appHeaderHeight + 'px'}}/>}
            {children}
          </View>
        </ScrollView>
      }
    </Block>
  )
}