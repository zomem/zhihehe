import Taro from '@tarojs/taro'

import onCurrentUser from '@/actions/currentUser'

let apiUrl='', fileUrl=''
if (process.env.NODE_ENV === 'development') {

  apiUrl = 'http://localhost:3200'
  fileUrl = 'http://localhost:3200'

} else {
  //正式环境的 
  apiUrl = ''
  fileUrl = ''
}



export const CONFIG_DATA = {
  API_URL: apiUrl,
  FILE_URL: fileUrl,
  ZM_LOGIN_USERINFO: "zm_login_userinfo",
  
}





//401时，用户信息清空
const initUserInfo = (dispatch) => {
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
  dispatch(onCurrentUser(initUser))
}

export const get = async (url: string, dispatch?: any) => {
  let res = await Taro.request({
    url: CONFIG_DATA.API_URL + url,
    method: 'GET',
    header: {
      'Authorization': `Bearer ${Taro.getStorageSync(CONFIG_DATA.ZM_LOGIN_USERINFO).token}`
    },
  })
  if(res.statusCode === 200){
    return res
  }
  if(res.statusCode >= 400 || res.statusCode < 500){
    if (res.statusCode === 401) {
      initUserInfo(dispatch)
      return {data: res.data}
    }
    Taro.showModal({
      title: '客户端请示错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  if (res.statusCode >= 500 || res.statusCode < 600) {
    Taro.showModal({
      title: '服务器错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  if(res.statusCode >= 600){
    Taro.showModal({
      title: '自定义错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  return {data: res.data}
}


export const put = async (url: string, params?: any, dispatch?: any) => {
  let res = await Taro.request({
    url: CONFIG_DATA.API_URL + url,
    method: 'PUT',
    header: {
      'Authorization': `Bearer ${Taro.getStorageSync(CONFIG_DATA.ZM_LOGIN_USERINFO).token}`
    },
    data: {
      ...params,
    }
  })
  if(res.statusCode === 200){
    return res
  }

  if(res.statusCode >= 400 && res.statusCode < 500){
    if (res.statusCode === 401) {
      initUserInfo(dispatch)
      return {data: res.data}
    }
    Taro.showModal({
      title: '客户端请示错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  if (res.statusCode >= 500 && res.statusCode < 600) {
    Taro.showModal({
      title: '服务器错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  if(res.statusCode >= 600){
    Taro.showModal({
      title: '自定义错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  return {data: res.data}
}


export const post = async (url: string, params?: any, dispatch?: any) => {
  let res = await Taro.request({
    url: CONFIG_DATA.API_URL + url,
    method: 'POST',
    header: {
      'Authorization': `Bearer ${Taro.getStorageSync(CONFIG_DATA.ZM_LOGIN_USERINFO).token}`
    },
    data: {
      ...params,
    }
  })
  if(res.statusCode === 200){
    return res
  }

  if(res.statusCode >= 400 || res.statusCode < 500){
    if (res.statusCode === 401) {
      initUserInfo(dispatch)
      return {data: res.data}
    }
    Taro.showModal({
      title: '客户端请示错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  if (res.statusCode >= 500 || res.statusCode < 600) {
    Taro.showModal({
      title: '服务器错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  if(res.statusCode >= 600){
    Taro.showModal({
      title: '自定义错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  return {data: res.data}
}


interface UploadRes {
  data: {
    url?: string,
    [key: string]: any,
  },
  statusCode?: number,
}
export const upload = async (url: string, filePath?: any, dispatch?: any): Promise<UploadRes>  => {
  let tempRes = await Taro.uploadFile({
    url: CONFIG_DATA.API_URL + url,  
    header: {
      'Authorization': `Bearer ${Taro.getStorageSync(CONFIG_DATA.ZM_LOGIN_USERINFO).token}`
    },
    filePath: filePath,
    name: 'file'
  }) as any
  let res: any = {data: {}, statusCode: tempRes.statusCode}
  if(res.statusCode === 200){
    res.data = JSON.parse(tempRes.data)
    return res
  }
  res.data = tempRes.data
  if(res.statusCode >= 400 || res.statusCode < 500){
    if (res.statusCode === 401) {
      initUserInfo(dispatch)
      return {data: res.data}
    }
    Taro.showModal({
      title: '客户端请示错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  if (res.statusCode >= 500 || res.statusCode < 600) {
    Taro.showModal({
      title: '服务器错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  if(res.statusCode >= 600){
    Taro.showModal({
      title: '自定义错误: ' + res.statusCode,
      content: '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message,
      showCancel: false
    })
    return {data: res.data}
  }
  return {data: res.data}
}