import Taro from '@tarojs/taro'
import {PRODUCT_CAT_LIST} from '@/constants/storeConfig'

const initialState = {
  list: Taro.getStorageSync(PRODUCT_CAT_LIST || '')
}



export default function setProductCat(state=initialState, action){
  switch(action.type){
    case PRODUCT_CAT_LIST:
      Taro.setStorageSync(PRODUCT_CAT_LIST, action.payload)
      return {...state, list: action.payload}
    default:
      return state
  }
}