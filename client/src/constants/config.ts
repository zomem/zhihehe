import axios from 'axios'
import onCurrentUser from '@/actions/currentUser'

let apiUrl='', fileUrl=''
if (process.env.NODE_ENV === 'development') {
  
  apiUrl = 'http://localhost:3200'
  fileUrl = 'http://localhost:3200'
  
} else {
  apiUrl = ''
  fileUrl = ''
}



export const CONFIG_DATA = {
  API_URL: apiUrl,
  FILE_URL: fileUrl,
  ZM_LOGIN_TOKEN: "zm_zhi_login_token",
  ZM_LOGIN_REMEMBER: '0',
}





//401时，用户信息清空
const initUserInfo = (dispatch: any) => {
  const initUser = {
    id: '',
    nickname: '',
    avatar_url: '',
    gender: '',
    phone: '',
    openid: '',
    session_key: '',
    token: '',
    unionid: '',
    remember: false,
    authority: '',
  }
  dispatch(onCurrentUser(initUser))
}

export const fetchGet = async (url: string, dispatch?: any) => {
  let res = await axios.get(CONFIG_DATA.API_URL + url, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem(CONFIG_DATA.ZM_LOGIN_TOKEN) || ''}`
    }
  })
  if(res.status === 200){
    return res
  }
  if(res.status >= 400 || res.status < 500){
    if (res.status === 401) {
      initUserInfo(dispatch)
      return {data: res.data}
    }
    alert('客户端请示错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  if (res.status >= 500 || res.status < 600) {
    alert('服务器错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  if(res.status >= 600){
    alert('自定义错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  return {data: res.data}
}






export const fetchPut = async (url: string, params?: any, dispatch?: any) => {
  let res = await axios.put(CONFIG_DATA.API_URL + url, params, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem(CONFIG_DATA.ZM_LOGIN_TOKEN) || ''}`
    }
  })
  if(res.status === 200){
    return res
  }

  if(res.status >= 400 && res.status < 500){
    if (res.status === 401) {
      initUserInfo(dispatch)
      return {data: res.data}
    }
    alert('客户端请示错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  if (res.status >= 500 && res.status < 600) {
    alert('服务器错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  if(res.status >= 600){
    alert('自定义错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  return {data: res.data}
}




export const fetchPost = async (url: string, params?: any, dispatch?: any) => {
  let res = await axios.post(CONFIG_DATA.API_URL + url, params, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem(CONFIG_DATA.ZM_LOGIN_TOKEN) || ''}`
    }
  })
  if(res.status === 200){
    return res
  }

  if(res.status >= 400 || res.status < 500){
    if (res.status === 401) {
      initUserInfo(dispatch)
      return {data: res.data}
    }
    alert('客户端请示错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  if (res.status >= 500 || res.status < 600) {
    alert('服务器错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  if(res.status >= 600){
    alert('自定义错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  return {data: res.data}
}



interface IUploadRes {
  data: {
    url?: string,
    [key: string]: any,
  },
  status?: number,
}
export const fetchUpload = async (url: string, files?: any, dispatch?: any): Promise<IUploadRes>  => {
  //通过FormData生成服务端需要的数据格式
  let data = new FormData()
  data.append('file',files)  // 这里 file 是和后台对应的
  let tempRes = await axios.post(CONFIG_DATA.API_URL + url, data, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem(CONFIG_DATA.ZM_LOGIN_TOKEN) || ''}`,
      'Content-Type': 'multipart/form-data'
    }
  })
  let res: any = {data: {}, status: tempRes.status}
  if(res.status === 200){
    res.data = tempRes.data
    return res
  }
  res.data = tempRes.data
  if(res.status >= 400 || res.status < 500){
    if (res.status === 401) {
      initUserInfo(dispatch)
      return {data: res.data}
    }
    alert('客户端请示错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  if (res.status >= 500 || res.status < 600) {
    alert('服务器错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  if(res.status >= 600){
    alert('自定义错误: ' + res.status + '\n' + '[' + res.data.code + ']' + '[' + res.data.url + ']' + res.data.message)
    return {data: res.data}
  }
  return {data: res.data}
}





