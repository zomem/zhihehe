import Taro from '@tarojs/taro'
import {STYLES} from '@/constants/storeConfig'


const initialState = {
  
}

export default function setStyles(state=initialState, action){
  switch(action.type){
    case STYLES:
      return action.payload
    default:
      return state
  }
}