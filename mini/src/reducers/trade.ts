import {ACCOUNT_BALANCE} from '@/constants/storeConfig'

const initialState = {
  balance: 0.00,
}



export default function setGift(state=initialState, action){
  switch(action.type){
    case ACCOUNT_BALANCE:
      return {...state, balance: action.payload}
    default:
      return state
  }
}