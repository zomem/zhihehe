import {GIFT_NOTICE} from '@/constants/storeConfig'
import {get} from '@/constants/fetch'

export const onGiftNotice = () => {
  return async (dispatch: any) => {
    const info = (await get('/zhihehe/gift/notice', dispatch)).data
    dispatch({
      type: GIFT_NOTICE,
      payload: info
    })
  }
}