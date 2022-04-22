export default {
  pages: [
    'pages/index/Index',
    'pages/mine/Mine',
    'pages/mine/feedback/Feedback',
    'pages/mine/trade/MyTrade',
    'pages/mine/trade/ExpressTrack',
    'pages/mine/trade/Recharge',
    'pages/article/ArticleDetail',
    'pages/article/BuyProduct',
    'pages/mine/article/AddArticle',
    'pages/mine/article/ArticleList',
    'pages/mine/product/AddProduct',
    'pages/mine/product/AddComment',
    'pages/mine/sale/MySaleList',
    'pages/mine/sale/SaleMoney',
    'pages/mine/sale/MyUserList',
    'pages/mine/sale/InviteSale',
    'pages/mine/sale/SaleCode',
    'pages/article/Complete',
    'pages/shopCart/ShopCart',
    'pages/shopCart/Buy',
    'pages/gift/GiftSend',
    'pages/gift/checkGift/CheckGift',
    'pages/mine/gift/GiftBuy',
    'pages/mine/gift/GiftRecive',
    'pages/mine/trade/Account'
  ],
  window: {
    backgroundTextStyle: '@bgTxtStyle',
    navigationStyle: 'custom',
    disableScroll: true,
    navigationBarTextStyle: '@navTxtStyle'
  },
  darkmode: true,
  themeLocation: 'theme.json',
  tabBar: {
    color: '@tabFontColor',
    selectedColor: '@tabSelectedColor',
    borderStyle: '@tabBorderStyle',
    backgroundColor: '@tabBgColor',
    list: [
      {
        pagePath: 'pages/index/Index',
        text: '纸禾禾',
        iconPath: '@iconPath1',
        selectedIconPath: '@selectedIconPath1'
      },
      // {
      //   pagePath: 'pages/shopCart/ShopCart',
      //   text: '购物车',
      //   iconPath: '@iconPath1',
      //   selectedIconPath: '@selectedIconPath1'
      // },
      // {
      //   pagePath: 'pages/gift/checkGift/CheckGift',
      //   text: '礼物',
      //   iconPath: '@iconPath3',
      //   selectedIconPath: '@selectedIconPath3'
      // },
      {
        pagePath: 'pages/mine/Mine',
        text: '我的',
        iconPath: '@iconPath2',
        selectedIconPath: '@selectedIconPath2'
      }
    ]
  }
}
