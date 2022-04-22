import {PRODUCT_CAT_LIST} from '@/constants/storeConfig'
import {get} from '@/constants/fetch'

export default function onProductCatList () {
  return async (dispatch: any) => {
    const list = (await get('/zhihehe/product/product_cat/list', dispatch)).data
    if(!Array.isArray(list)){
      dispatch({
        type: PRODUCT_CAT_LIST,
        payload: []
      })
    }else{
      dispatch({
        type: PRODUCT_CAT_LIST,
        payload: list
      })
    }
  }
}