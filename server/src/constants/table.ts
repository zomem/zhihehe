
/* 数据库的表 */
export const users = {
  t: 'users',
  id: 'users.id',
  nickname: 'users.nickname',
  gender: 'users.gender',
  language: 'users.language',
  city: 'users.city',
  province: 'users.province',
  country: 'users.country',
  avatar_url: 'users.avatar_url',
  openid: 'users.openid',
  unionid: 'users.unionid',
  phone: 'users.phone',
  email: 'users.email',
  password: 'users.password',
  created_at: 'users.created_at',
  updated_at: 'users.updated_at',
  authority: 'users.authority',
  role: 'users.role',
}

export const users_history_avatar = {
  t: 'users_history_avatar',
  id: 'users_history_avatar.id',
  uid: 'users_history_avatar.uid',
  img_url: 'users_history_avatar.img_url',
  created_at: 'users_history_avatar.created_at',
  updated_at: 'users_history_avatar.updated_at',
}

//权限的管理后台页面路径
export const sys_paths = {
  t: 'sys_paths',
  id: 'sys_paths.id',
  name: 'sys_paths.name',
  sub_name: 'sys_paths.sub_name',
  path: 'sys_paths.path',
  sub_path: 'sys_paths.sub_path',
  icon_name: 'sys_paths.icon_name',
  type: 'sys_paths.type',
  uni_key: 'sys_paths.uni_key',
  sort_num: 'sys_paths.sort_num'
}

// banner配置
export const sys_banner = {
  t: 'sys_banner',
  id: 'sys_banner.id',
  img_urls: 'sys_banner.img_urls',
  path_urls: 'sys_banner.path_urls',
  name: 'sys_banner.name',
  page: 'sys_banner.page',
  color: 'sys_banner_color',
}

// 常量
export const sys_constants = {
  t: 'sys_constants',
  id: 'sys_constants.id',
  key: 'sys_constants.key',
  value: 'sys_constants.value',
  status: 'sys_constants.status',
  description: 'sys_constants.description'
}

// 角色表
export const sys_role = {
  t: 'sys_role',
  id: 'sys_role.id',
  name: 'sys_role.name',
  identifier: 'sys_role.identifier',
  api_paths: 'sys_role.api_paths',
  status: 'sys_role.status',
}
export const sys_product_cat = {
  t: 'sys_product_cat',
  id: 'sys_product_cat.id',
  title: 'sys_product_cat.title',
  created_at: 'sys_product_cat.created_at',
  updated_at: 'sys_product_cat.updated_at',
  rank_num: 'sys_product_cat.rank_num',
  status: 'sys_product_cat.status'
}


// 反馈
export const feedback = {
  t: 'feedback',
  id: 'feedback.id',
  content: 'feedback.content',
  created_at: 'feedback.created_at',
  updated_at: 'feedback.updated_at',
}

// 文章
export const article = {
  t: 'article',
  id: 'article.id',
  title: 'article.title',
  des: 'article.des',
  uid: 'article.uid',
  product_id: 'article.product_id',
  author: 'article.author',
  html: 'article.html',
  created_at: 'article.created_at',
  updated_at: 'article.updated_at',
  img_urls: 'article.img_urls',
  status: 'article.status',
}

// 商品
export const product = {
  t: 'product',
  id: 'product.id',
  title: 'product.title',
  uid: 'product.uid',
  img_urls: 'product.img_urls',
  des: 'product.des',
  price: 'product.price',
  cost: 'product.cost',
  sale_cost: 'product.sale_cost',
  f_sale_cost: 'product.f_sale_cost',
  quantity: 'product.quantity',
  status: 'product.status',
  name: 'product.name',
  mobile: 'product.mobile',
  company: 'product.company',
  province: 'product.province',
  city: 'product.city',
  area: 'product.area',
  addr: 'product.addr',
  weight: 'product.weight',
  space_x: 'product.space_x',
  space_y: 'product.space_y',
  space_z: 'product.space_z',
  cat_id: 'product.cat_id',
  can_gift: 'product.can_gift',
  can_group: 'product.can_group',
  group_end: 'product.group_end',
  group_price: 'product.group_price',
  group_quantity: 'product.group_quantity',
  group_cost: 'product.group_cost',
  group_sale_cost: 'product.group_sale_cost',
  group_f_sale_cost: 'product.group_f_sale_cost',
  goods_url: 'product.goods_url',
}

// 草稿
export const article_draft = {
  t: 'article_draft',
  id: 'article_draft.id',
  uid: 'article_draft.uid',
  article_title: 'article_draft.article_title',
  article_des: 'article_draft.article_des',
  article_html: 'article_draft.article_html',
  article_img_urls: 'article_draft.article_img_urls',
  created_at: 'article_draft.created_at',
  updated_at: 'article_draft.updated_at',
  status: 'article_draft.status',
  reason: 'article_draft.reason',
  product_draft_id: 'article_draft.product_draft_id',
  online_article_id: 'article_draft.online_article_id',
}

export const product_draft = {
  t: 'product_draft',
  id: 'product_draft.id',
  uid: 'product_draft.uid',
  online_product_id: 'product_draft.online_product_id',
  product_title: 'product_draft.product_title',
  product_img_urls: 'product_draft.product_img_urls',
  product_des: 'product_draft.product_des',
  product_price: 'product_draft.product_price',
  product_cost: 'product_draft.product_cost',
  product_sale_cost: 'product_draft.product_sale_cost',
  product_f_sale_cost: 'product_draft.product_f_sale_cost',
  product_quantity: 'product_draft.product_quantity',
  created_at: 'product_draft.created_at',
  updated_at: 'product_draft.updated_at',
  status: 'product_draft.status',
  reason: 'product_draft.reason',
  product_name: 'product_draft.product_name',
  product_mobile: 'product_draft.product_mobile',
  product_company: 'product_draft.product_company',
  product_province: 'product_draft.product_province',
  product_city: 'product_draft.product_city',
  product_area: 'product_draft.product_area',
  product_addr: 'product_draft.product_addr',
  product_weight: 'product_draft.product_weight',
  product_space_x: 'product_draft.product_space_x',
  product_space_y: 'product_draft.product_space_y',
  product_space_z: 'product_draft.product_space_z',
  product_cat_id: 'product_draft.product_cat_id',
  product_can_gift: 'product_draft.product_can_gift',
  product_can_group: 'product_draft.product_can_group',
  product_group_end: 'product_draft.product_group_end',
  product_group_price: 'product_draft.product_group_price',
  product_group_quantity: 'product_draft.product_group_quantity',
  product_group_cost: 'product_draft.product_group_cost',
  product_group_sale_cost: 'product_draft.product_group_sale_cost',
  product_group_f_sale_cost: 'product_draft.product_group_f_sale_cost',
  product_goods_url: 'product_draft.product_goods_url',
}


export const trade = {
  t: 'trade',
  id: 'trade.id',
  article_id: 'trade.article_id',
  product_id: 'trade.product_id',
  title: 'trade.title',
  des: 'trade.des',
  cover_url: 'trade.cover_url',
  uid: 'trade.uid',
  sale_uid: 'trade.sale_uid',
  f_sale_uid: 'trade.f_sale_uid',
  business_uid: 'trade.business_uid',
  phone: 'trade.phone',
  name: 'trade.name',
  address: 'trade.address',
  trade_status: 'trade.trade_status',
  status: 'trade.status',
  cost: 'trade.cost',
  sale_cost: 'trade.sale_cost',
  f_sale_cost: 'trade.f_sale_cost',
  quantity: 'trade.quantity',
  price: 'trade.price',
  total_price: 'trade.total_price',
  trade_no: 'trade.trade_no',
  transaction_id: 'trade.transaction_id',
  trade_type: 'trade.trade_type',
  express_no: 'trade.express_no',
  created_at: 'trade.created_at',
  updated_at: 'trade.updated_at',
  province: 'trade.province',
  city: 'trade.city',
  area: 'trade.area',
  addr: 'trade.addr',
  is_group: 'trade.is_group',
}

// 待支付时的支付参数信息
export const wait_paid = {
  t: 'wait_paid',
  id: 'wait_paid.id',
  sign_type: 'wait_paid.sign_type',
  pay_sign: 'wait_paid.pay_sign',
  package: 'wait_paid.package',
  nonce_str: 'wait_paid.nonce_str',
  time_stamp: 'wait_paid.time_stamp',
  created_at: 'wait_paid.created_at',
  uid: 'wait_paid.uid',
  trade_id: 'wait_paid.trade_id',
  status: 'wait_paid.status',
}

// 销售关系表
export const sale_rela = {
  t: 'sale_rela',
  id: 'sale_rela.id',
  sale_uid: 'sale_rela.sale_uid',
  f_sale_uid: 'sale_rela.f_sale_uid',
  created_at: 'sale_rela.created_at',
  status: 'sale_rela.status'
}

// 用户和销售关系表
export const sale_user_rela = {
  t: 'sale_user_rela',
  id: 'sale_user_rela.id',
  sale_uid: 'sale_user_rela.sale_uid',
  uid: 'sale_user_rela.uid',
  created_at: 'sale_user_rela.created_at',
}

// 分账记录
export const share_money = {
  t: 'share_money',
  id: 'share_money.id',
  order_id: 'share_money.order_id',
  out_order_no: 'share_money.out_order_no',
  transaction_id: 'share_money.transaction_id',
  account: 'share_money.account',
  amount: 'share_money.amount',
  create_at: 'share_money.create_at',
  description: 'share_money.description',
  detail_id: 'share_money.detail_id',
  finish_at: 'share_money.finish_at',
  type: 'share_money.type',
  share_status: 'share_money.share_status',
  status: 'share_money.status',
  is_group: 'share_money.is_group',
}


// 购物车
export const shop_cart = {
  t: 'shop_cart',
  id: 'shop_cart.id',
  uid: 'shop_cart.uid',
  pid: 'shop_cart.pid',
  count: 'shop_cart.count',
  fuid: 'shop_cart.fuid',
  aid: 'shop_cart.aid',
  created_at: 'shop_cart.created_at',
  updated_at: 'shop_cart.updated_at',
  is_select: 'shop_cart.is_select',
}


// 礼物购买
export const gift_trade = {
  t: 'gift_trade',
  id: 'gift_trade.id',
  article_id: 'gift_trade.article_id',
  product_id: 'gift_trade.product_id',
  title: 'gift_trade.title',
  des: 'gift_trade.des',
  cover_url: 'gift_trade.cover_url',
  uid: 'gift_trade.uid',
  trade_status: 'gift_trade.trade_status',
  status: 'gift_trade.status',
  quantity: 'gift_trade.quantity',
  remain_quantity: 'gift_trade.remain_quantity',
  price: 'gift_trade.price',
  total_price: 'gift_trade.total_price',
  trade_no: 'gift_trade.trade_no',
  transaction_id: 'gift_trade.transaction_id',
  trade_type: 'gift_trade.trade_type',
  created_at: 'gift_trade.created_at',
  updated_at: 'gift_trade.updated_at',
  business_uid: 'gift_trade.business_uid',
  sale_uid: 'gift_trade.sale_uid',
  f_sale_uid: 'gift_trade.f_sale_uid',
  cost: 'gift_trade.cost',
  sale_cost: 'gift_trade.sale_cost',
  f_sale_cost: 'gift_trade.f_sale_cost',
  picked_phone: 'gift_trade.picked_phone',
  gift_theme_id: 'gift_trade.gift_theme_id',
  message: 'gift_trade.message',
}

// 礼物收方
export const gift_picked = {
  t: 'gift_picked',
  id: 'gift_picked.id',
  article_id: 'gift_picked.article_id',
  product_id: 'gift_picked.product_id',
  title: 'gift_picked.title',
  des: 'gift_picked.des',
  cover_url: 'gift_picked.cover_url',
  uid: 'gift_picked.uid',
  phone: 'gift_picked.phone',
  name: 'gift_picked.name',
  address: 'gift_picked.address',
  gift_trade_status: 'gift_picked.gift_trade_status',
  status: 'gift_picked.status',
  quantity: 'gift_picked.quantity',
  price: 'gift_picked.price',
  total_price: 'gift_picked.total_price',
  created_at: 'gift_picked.created_at',
  updated_at: 'gift_picked.updated_at',
  business_uid: 'gift_picked.business_uid',
  express_no: 'gift_picked.express_no',
  province: 'gift_picked.province',
  city: 'gift_picked.city',
  area: 'gift_picked.area',
  addr: 'gift_picked.addr',
  gift_trade_id: 'gift_picked.gift_trade_id',
  verify_phone: 'gift_picked.verify_phone',
  picked_no: 'gift_picked.picked_no',
}


export const gift_theme = {
  t: 'gift_theme',
  id: 'gift_theme.id',
  title: 'gift_theme.title',
  bg_image: 'gift_theme.bg_image',
  share_image: 'gift_theme.share_image',
  message: 'gift_theme.message',
  status: 'gift_theme.status',
  created_at: 'gift_theme.created_at',
  updated_at: 'gift_theme.updated_at',
}


/** 用户余额 */
export const users_account = {
  t: 'users_account',
  id: 'users_account.id',
  uid: 'users_account.uid',
  balance: 'users_account.balance',
  created_at: 'users_account.created_at',
  updated_at: 'users_account.updated_at'
}

export const users_account_record = {
  t: 'users_account_record',
  id: 'users_account_record.id',
  users_account_id: 'users_account_record.users_account_id',
  uid: 'users_account_record.uid',
  content: 'users_account_record.content',
  change_balance: 'users_account_record.change_balance',
  obj: 'users_account_record.obj',
  created_at: 'users_account_record.created_at',
  updated_at: 'users_account_record.updated_at'
}

export const account_recharge = {
  t: 'account_recharge',
  id: 'account_recharge.id',
  price: 'account_recharge.price',
  pay_price: 'account_recharge.pay_price',
  status: 'account_recharge.status',
  created_at: 'account_recharge.created_at',
  updated_at: 'account_recharge.updated_at'
}

// 产品的评论
export const comment = {
  t: 'comment',
  id: 'comment.id',
  uid: 'comment.uid',
  nickname: 'comment.nickname',
  avatar_url: 'comment.avatar_url',
  product_id: 'comment.product_id',
  img_urls: 'comment.img_urls',
  video_url: 'comment.video_url',
  content: 'comment.content',
  star: 'comment.star',
  status: 'comment.status',
  created_at: 'comment.created_at',
  updated_at: 'comment.updated_at'
}



// redis table
export const redis_product = 'zhihehe_product'