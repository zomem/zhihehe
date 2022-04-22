export const ZPX = 'rpx'


export const AUTHOR_SCOPE = {
  userInfo: {
    scope: 'scope.userInfo',
    info: '你还未授权获取基本信息，是否去授权',
  },
  // userLocation: {
  //   scope: 'scope.userLocation',
  //   info: '你还未授权地理位置，是否去授权',
  // },
  // userLocationBackground: {
  //   scope: 'scope.userLocationBackground',
  //   info: '你还未授权后台定位，是否去授权',
  // },
  // werun: {
  //   scope: 'scope.werun',
  //   info: '你还未授权微信运动步数，是否去授权',
  // },
  // record: {
  //   scope: 'scope.record',
  //   info: '你还未授权录音功能，是否去授权',
  // },
  // writePhotosAlbum: {
  //   scope: 'scope.writePhotosAlbum',
  //   info: '你还未授权保存到相册，是否去授权',
  // },
  // camera: {
  //   scope: 'scope.camera',
  //   info: '你还未授权摄像头，是否去授权',
  // }
}


export const ROLE_OBJ = {
  '1000': {zh: '销售', en: 'salespeople'},
  '1006': {zh: '总销售', en: 'salesleader'},
  '1200': {zh: '报价员', en: 'quoter'}
}
//角色编号
export const SALES_LEADER = '1006'
export const SALES_PEOPLE = '1000'
export const QUOTER = '1200'

//快递有效区域
export const EXPRESS_PROVINCE = ['四川省', '重庆市']

// 快递公司ID对应的名称
export const EXPRESS_NAME = {
  SF: '顺风速运'
}


// 微信直播，状态列表
export const LIVE_STATUS = {
  101: '直播中',
  102: '未开始',
  103: '已结束',
  104: '禁播',
  105: '暂停',
  106: '异常',
  107: '已过期',
}
