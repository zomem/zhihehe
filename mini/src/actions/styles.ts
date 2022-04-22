import { STYLES } from '@/constants/storeConfig'

export default function onStyles(styles){
  return (dispatch) => {
    dispatch({
      type: STYLES,
      payload: styles
    })
  }

}