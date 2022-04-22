import { Component } from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'
import onCurrentUser from '@/actions/currentUser'
import configStore from './store/index'
import onStyles from '@/actions/styles'
import theme from '../theme.json'
import {IMPORT} from '@/constants/themeIcon'
import {onAccountBalance} from '@/actions/trade'

import './app.scss'

const {CONFIG_DATA} = require('@/constants/fetch')
const store = configStore()




// 加载样式
const appStyles = (dispatch) => {
  // 检测文件
  const insertImport = (config: any = {}, themeMode: string) => {
    let temp = {...config}
    for(let c in config){
      if(config[c].indexOf('@import') > -1){
        temp[c] = themeMode === 'dark' ? IMPORT[c+'_dark'] : IMPORT[c]
      }
    }
    return temp
  }
  let mode = 'light'
  let style = theme.light
  const themeNow = Taro.getSystemInfoSync().theme || 'light'
  if (themeNow === 'dark') {
    mode = 'dark'
    style = theme.dark
  }
  onStyles(insertImport(style, mode))(dispatch)
  const eventListener = (res: {theme: 'light' | 'dark'}) => {
    if(mode === 'light' && res.theme !== 'light'){
      mode = 'dark'
      style = theme.dark
      onStyles(insertImport(style, mode))(dispatch)
    }
    if(mode === 'dark' && res.theme !== 'dark'){
      mode = 'light'
      style = theme.light
      onStyles(insertImport(style, mode))(dispatch)
    }
  }
  Taro.onThemeChange(eventListener)
}


class App extends Component {
  props: any
  async componentDidMount () {
    appStyles(store.dispatch)
    const initUser = {
      id: '',
      nickname: '',
      avatar_url: '',
      gender: '',
      phone: '',
      openid: '',
      session_key: '',
      language: '',
      city: '',
      province: '',
      country: '',
      email: '',
      unionid: '',
      token: '',
      authority: '',
      role: '',
    }
    let tempUser = Taro.getStorageSync(CONFIG_DATA.ZM_LOGIN_USERINFO) || initUser
    //用户静默登录
    // const silentLogin = async (dispatch, token) => {
    //   let code = (await Taro.login()).code
    //   let res = await Taro.request({
    //     url: CONFIG_DATA.API_URL + '/login/silent/' + code + '/' + token,
    //     method: 'GET',
    //   })
    //   dispatch(onCurrentUser(res.data))
    // }
    // if(tempUser.token){
    //   await silentLogin(store.dispatch, tempUser.token)
    // }else{
    //   store.dispatch(onCurrentUser(tempUser))
    // }
    store.dispatch(onCurrentUser(tempUser))
    onAccountBalance()(store.dispatch)
  }

  componentDidShow () {
    const updateManager = Taro.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  }

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
