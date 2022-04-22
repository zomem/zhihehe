import React, {useEffect, useState} from 'react'
import Taro, {} from '@tarojs/taro'
import {View} from '@tarojs/components'

import pLimit from '@/utils/pLimit'

import ProductItem from '@/components/widget/productItem/productItem'

import './waterfall.scss'


interface IProductItem {
  id: number
  title: string
  content: string
  cover_url: string
  img_urls: string
  status: number
  price: number
  dis_price: number
  quantity: number
  score: number
  type: number
  sort: number
  score_type: number
}
interface IWaterfallProps {
  productList: IProductItem[]
}

interface IWater{
  left: IProductItem[]
  right: IProductItem[]
}

function Waterfall(props: IWaterfallProps) {

  const {productList} = props

  const [water, setWater] = useState<IWater>({left: [], right: []})

  useEffect(() => {
    if(productList.length > 0){
      async function getListImgInfo () {
        let leftData: IProductItem[] = []
        let rightData: IProductItem[] = []
        let leftHeight = 0
        let rightHeight = 0
        let result: any = []
        
        let input: any = []
        
        for(let i = 0; i < productList.length; i++){
          input.push(Taro.getImageInfo({
            src: productList[i].cover_url || '',
          }))
        }
        result = await pLimit(input, 5)
        for(let i = 0; i < result.length; i++){
          if(leftHeight <= rightHeight) {
            leftData.push(productList[i])
            leftHeight = leftHeight + 130 + (result[i].height / result[i].width) * 330  //显示的图片是330rpx
          }else{
            rightData.push(productList[i])
            rightHeight = rightHeight + 130 + (result[i].height / result[i].width) * 330
          }
        }
        setWater({
          left: [...leftData],
          right: [...rightData]
        })
      }
      getListImgInfo()
    }
    
  }, [productList])


  return(
    <View className='_waterfall_content'>
      <View className='_waterfall_left' id='waterfall_left_id'>
        {
          water.left.map((item, index) => (
            <ProductItem 
              key={item.id} 
              item={item}
            />
          ))
        }
      </View>

      <View className='_waterfall_right' id='waterfall_right_id'>
        {
          water.right.map((item, index) => (
            <ProductItem 
              key={item.id} 
              item={item}
            />
          ))
        }
      </View>
    </View>
  )
}

export default Waterfall