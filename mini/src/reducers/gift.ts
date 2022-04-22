import {GIFT_NOTICE} from '@/constants/storeConfig'

const initialState = {
  giftNotice: {
    send_num: 0,
    recive_num: 0
  }
}



export default function setGift(state=initialState, action){
  switch(action.type){
    case GIFT_NOTICE:
      return {...state, giftNotice: action.payload}
    default:
      return state
  }
}