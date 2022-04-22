import {ACCOUNT_BALANCE} from '@/constants/storeConfig'
import {get} from '@/constants/fetch'

export const onAccountBalance = () => {
  return async (dispatch: any) => {
    const info = (await get('/zhihehe/account/balance', dispatch)).data
    dispatch({
      type: ACCOUNT_BALANCE,
      payload: info.balance || 0
    })
  }
}