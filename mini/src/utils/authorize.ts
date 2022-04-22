import Taro from '@tarojs/taro'
import {ROLE_OBJ} from '@/constants/constants'

/**
 * 检测用户授权
 */
export const checkAuthorize = async (type): Promise<boolean> => {
  let res = await Taro.getSetting()
  let setting = res.authSetting
  if(typeof(setting[type.scope]) === 'undefined') {
    let authRes = await Taro.authorize({
      scope: type.scope,
    })
    if(authRes.errMsg === "authorize:ok"){
      return true
    }else{
      return false
    }
  }
  if(setting[type.scope]){
    return true
  }

  let tempRes = await Taro.showModal({
    title: '提示',
    content: type.info,
    confirmText: '去授权'
  })
  if(tempRes.confirm){
    Taro.openSetting()
  }
  return false
}



// 判断用户是不是指定角色
export const isRole = (roleName: RoleName, role: string): boolean => {
  let isrole: boolean = false
  if(!role){
    return isrole
  }
  let arr: string[] = role.split(',')
  for(let a of arr){
    if(ROLE_OBJ[a]?.en === roleName) isrole = true
  }
  return isrole
}

export const roleName = (role: string): string[] => {
  let name:string[] = []
  if(!role){
    return []
  }
  let arr: string[] = role.split(',')
  for(let a of arr){
    name.push(ROLE_OBJ[a]?.zh)
  }
  return name
}
