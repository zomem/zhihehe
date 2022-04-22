import { combineReducers } from 'redux'
import currentUser from './currentUser'
import productCat from './productCat'
import gift from './gift'
import styles from './styles'
import trade from './trade'

export default combineReducers({
  currentUser,
  productCat,
  gift,
  styles,
  trade,
})
