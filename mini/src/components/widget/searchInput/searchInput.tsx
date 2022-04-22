import React, {useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Image, Input} from '@tarojs/components'

import ICON_SEARCH from './search.png'

import './searchInput.scss'


interface ISearchProps {
  disable?: boolean
  type?: 'default' | 'input'
  value?: string
  placeholder?: string
  onInput?: Function
  onConfirm?: Function
}


let A1 = Taro.createAnimation({
  duration: 500,
  timingFunction: "ease",
})


function SearchInput (props: ISearchProps) {

  const {disable=false, placeholder='请输入要搜索的内容', type='input', value, onInput=() => {}, onConfirm=() => {}} = props

  const [isInputing, setIsInputing] = useState(false)
  const [animate, setAnimate] = useState<IAnimate>({actions: []})
  const [isShowInput, setIsShowInput] = useState(false)
  const [isAutoFocus, setIsAutoFocus] = useState(false)

  // useEffect(() => {
  //   // setTimeout(() => {
  //   //   setIsInputing(true)
  //   //   setIsAutoFocus(true)
  //   // }, 20)
  // }, [])

  useEffect(() => {
    if(isInputing){
      A1.left('25rpx').step()
      setTimeout(() => {
        setAnimate(A1.export())
      }, 10)
      setTimeout(() => {
        setIsShowInput(true)
        setIsAutoFocus(false)
      }, 510);
    }else{
      A1.left('210rpx').step()
      setTimeout(() => {
        setAnimate(A1.export())
      }, 10)
      setTimeout(() => {
        setIsShowInput(false)
        setIsAutoFocus(false)
      }, 510);
    }
  }, [isInputing])


  useEffect(() => {
    if(value){
      setIsInputing(true)
    }
  }, [value])

  return(
    <View>
      {
        {
          'default': (
            <View 
              className='_search_all'
              hoverClass='hover-op'
              onClick={() => {
                // Taro.navigateTo({
                //   url: '/pages/searchPage/searchPage'
                // })
              }}
            >  
              <View className='_search_con'>
                <View className='_search_con_i frsc'>
                  <Image className='_search_icon' src={ICON_SEARCH} />
                  <View className='_search_input fs15 fcc9 frsc' >{placeholder}</View>
                </View>
              </View>
            </View>
          ),
          'input': (
            <View 
              className='_search_all'
            >  
              <View className='_search_con'>
                <View animation={animate} className='_search_con_i frsc'>
                  <Image className='_search_icon' src={ICON_SEARCH} />
                  {
                    !isShowInput ? 
                    <View
                      className='_search_input fs15 fcc9 frsc'
                      onClick={() => {
                        setIsInputing(true)
                      }}
                    >{placeholder}</View>
                    :
                    <Input
                      placeholder={placeholder}
                      confirmType='search'
                      placeholderClass='fs15 fcc9' 
                      value={value}
                      className='_search_input_l fs15 fc33'
                      focus={true}
                      onBlur={() => {
                        if(value) return
                        setIsInputing(false)
                        setIsShowInput(false)
                      }}
                      onInput={(e) => {
                        onInput(e.detail.value)
                      }}
                      onConfirm={() => {
                        onConfirm()
                      }}
                    />
                  }
                </View>
              </View>
          </View>
          ),
        }[type]
      }
    </View>

  )
}


export default SearchInput