import Taro from '@tarojs/taro'
import {CURRENT_USER} from '@/constants/storeConfig'
import {CONFIG_DATA} from '@/constants/fetch'


const initialState = {
  id: '',
  nickname: '',
  avatar_url: '',
  gender: '',
  phone: '',
  openid: '',
  session_key: '',
  language: '',
  city: '',
  province: '',
  country: '',
  email: '',
  unionid: '',
  token: '',
  authority: '',
  role: '',
}

export default function setCurrentUser(state=initialState, action){
  switch(action.type){
    case CURRENT_USER:
      let tempUser = {
        ...state,
        ...action.payload
      }
      Taro.setStorageSync(CONFIG_DATA.ZM_LOGIN_USERINFO, tempUser)
      return tempUser
    default:
      return state
  }
}