import React, {useMemo} from 'react'
import {View, Text} from '@tarojs/components'

import './highlight.scss'

interface IHighlight{
  content: string
  heightKey: string
}

function Highlight(props: IHighlight) {
  const {content, heightKey} = props

  const txtList = useMemo(() => {
    if(!heightKey){
      return [content]
    }
    let all: string[] = []
    let arr1 = content.split(heightKey)
    for(let i = 0; i < arr1.length; i++){
      all.push(arr1[i])
      if(i < arr1.length - 1){
        all.push(heightKey)
      }
    }
    return all
  }, [content, heightKey])

  return (
    <View>
      {
        txtList.map((item, index) => {
          if(item === heightKey){
            return (
              <Text style={{color: '#ff2c2c'}}>{item}</Text>
            )
          }else{
            return(
              <Text>{item}</Text>
            )
          }
        })
      }
    </View>
  )
}


export default Highlight