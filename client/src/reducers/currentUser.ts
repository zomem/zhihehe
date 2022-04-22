import {CURRENT_USER} from '@/constants/storeConfig'
import {CONFIG_DATA} from '@/constants/config'


const initialState = {
  id: 'init',
  nickname: '',
  avatar_url: '',
  gender: '',
  phone: '',
  openid: '',
  session_key: '',
  token: '',
  authority: ''
}

export default function setCurrentUser(state=initialState, action: IStoreAction){
  switch(action.type){
    case CURRENT_USER:
      let tempUser = {
        ...state,
        ...action.payload
      }
      if(action.payload.remember){
        localStorage.setItem(CONFIG_DATA.ZM_LOGIN_TOKEN, tempUser.token)
        localStorage.setItem(CONFIG_DATA.ZM_LOGIN_REMEMBER, '1')
      }else{
        localStorage.setItem(CONFIG_DATA.ZM_LOGIN_TOKEN, tempUser.token)
        localStorage.setItem(CONFIG_DATA.ZM_LOGIN_REMEMBER, '0')
      }
      return tempUser
    default:
      return state
  }
}