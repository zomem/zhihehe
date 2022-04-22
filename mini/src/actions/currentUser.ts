import { CURRENT_USER } from '@/constants/storeConfig'

export default function onCurrentUser(user){
  return { type: CURRENT_USER, payload: user }
}