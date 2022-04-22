import React, {useState, useMemo, useEffect} from 'react'
import {View} from '@tarojs/components'
import {useSelector} from 'react-redux'
import Taro from '@tarojs/taro'


import useNavTabInfo from '@/hooks/useNavTabInfo'

import './topCatLine.scss'


interface ITopCatLineProps {
  titleList: string[]
  current?: number
  onChange?: (cur: number) => void
  isShow?: boolean
}

let animate = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration: 300,
  timingFunction: "ease",
  delay: 0
})
let animate2 = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration: 500,
  timingFunction: "ease",
  delay: 0
})

function TopCatLine(props: ITopCatLineProps) {
  const {styles} = useSelector((state: ReduxState) => state)

  const {titleList, current=0, onChange=() => {}, isShow=true} = props
  const [animateData, setAnimateData] = useState<Animate>({actions: []})
  const [animateData2, setAnimateData2] = useState<Animate>({actions: []})

  const navInfo = useNavTabInfo()

  const itemWidth = useMemo(() => {
    if(titleList.length === 0) {
      return 750
    }
    return 750 / titleList.length
  }, [titleList])

  useEffect(() => {
    animate.left(`${itemWidth * current}rpx`).step()
    setAnimateData(animate.export())
  }, [current, itemWidth])

  useEffect(() => {
    if(isShow){
      animate2.top(navInfo.appHeaderHeight - 3).step()
      setAnimateData2(animate2.export())
    }else{
      animate2.top(0).step()
      setAnimateData2(animate2.export())
    }
  }, [isShow, navInfo])

  return (
    <View 
      className='_topCatLine_all'
      style={{
        top: navInfo.appHeaderHeight - 3 + 'PX',
        backgroundColor: styles.navigationBgColor
      }}
      animation={animateData2}
    >
      <View 
        className='_topCatLine_scroll_bar'
        style={{
          width: itemWidth + 'rpx',
        }}
        animation={animateData}
      >
        <View className='_topCatLine_scroll_bar_color'></View>
      </View>

      {
        titleList.map((item, index) => (
          <View 
            className='_topCatLine_item'
            style={{
              width: itemWidth + 'rpx',
              color: current === index ? '#36a65d' : '#a0a0a0'
            }}
            onClick={() => {
              if(current === index) return
              onChange(index)
            }}
          >
            {item}
          </View>
        ))
      }
    </View>
  )
}


export default TopCatLine