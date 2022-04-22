/// <reference path="node_modules/@tarojs/taro/types/index.d.ts" />

declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.styl";



declare const wx: {
  [key: string]: any;
}



// @ts-ignore
declare const process: {
  env: {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
    [key: string]: any
  }
}


interface ProductItem {
  id: number
  title: string
  [key: string]: any
}





type RoleName = 'salespeople' | 'quoter' | 'salesleader'

interface Animate {
  actions: any[]
}



//location
interface Address {
  name: string,
  address: string,
  longitude: number,
  latitude: number
}



// useStyle 的返回
interface UseStyle {
  theme?:string
  navBgColor?: string
  navTxtStyle?: string
  bgColor?: string
  bgTxtStyle?: string
  bgColorTop?: string
  bgColorBottom?: string
  tabFontColor?: string
  tabSelectedColor?: string
  tabBgColor?: string
  tabBorderStyle?: string
  iconPath1?: string
  selectedIconPath1?: string
  iconPath2?: string
  selectedIconPath2?: string

  navigationBgColor: string
  navigationTextColor: string
  navigationBorderColor: string
  bottomBoxColor: string
  pageBgColor: string
  pageBgImage: string
  pagePadding: string
  iconNavBack: string
  iconNavHome: string
  iconUpload: string
  iconChecked: string
  iconRight:string
  iconHomeBanner:string
  iconMineTop:string

  textColor: string
  textColorGray: string
  textColorLight: string
  textSizeXL: string
  textSizeL: string
  textSize: string
  textSizeS: string
  textSizeXS: string
  textSizeXXS: string
  textSizeXXXS: string

  boxColor: string
  boxColorGray: string
  boxColorGrayBlur: string
  boxHomeColor: string
  boxSelectColor: string
  hoverColor: string

  lineColor: string

  themeColor: string
  colorRed: string
  colorLightGreen: string
  colorOrange: string
  colorYellow: string
  colorGreen: string
  colorWhite: string
}




// redux 类型
interface ReduxState {
  trade: {
    balance: number
  }
  currentUser: {
    id: number
    nickname: string
    avatar_url: string
    gender: number
    phone: string
    openid: string
    session_key: string
    token: string
    unionid: string
    email: string
    authority: string
    role: string
  }
  productCat: {
    list: ProductItem[]
  }
  gift: {
    giftNotice: {
      send_num: number
      recive_num: number
    }
  }
  styles: UseStyle
}


