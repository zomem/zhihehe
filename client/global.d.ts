
interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  [key]: any
}

declare module 'react-highlight-words'

type RoleName = 'salespeople' | 'quoter' | 'salesleader'

interface IStoreAction {
  type: string
  payload: any
}

interface IRootStore {
  currentUser: {
    id: number | string
    nickname: string
    gender: number
    avatar_url: string
    language: string
    city: string
    province: string
    country: string
    phone: string
    email: string
    openid: string
    unionid: string
    session_key: string
    token: string
    authority: string
  }
}



// useStyle 的返回
interface UseStyle {
  line?: string
  red?: string
  textLarger?: string
  textLarge?: string
  textNormal?: string
  textSmall?: string
  textSmaller?: string
  textGray?: string
  textColorMain?: string
  editorBorder?: string
  oneColor?: string
  pic?: string
}