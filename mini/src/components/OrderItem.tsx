import React, {} from 'react'
import Taro from '@tarojs/taro'
import {useSelector} from 'react-redux'
import {Box, Flex, Line, Image, Text, Block, Press} from '@/components/widget/Components'
import InputNumber from '@/components/widget/InputNumber'
import StarTap from '@/components/widget/StarTap'

import {dateTime} from '@/utils/timeFormat'

// import ICON_SELECT from '@/images/icons/rec_gou.svg'
// import ICON_SELECT_NOT from '@/images/icons/rec_gou_gray.svg'

import ICON_SELECT from '@/images/select.png'

interface OItem {
  title?: string
  id?: number
  img_urls?: string[]
  price?: number

  is_select?: number

  address?: string
  article_id?: number
  business_uid?: number
  cover_url?: string
  created_at?: string
  des?: string
  express_no?: string
  name?: string
  phone?: string
  product_id?: string
  quantity?: number
  status?: number
  total_price?: number
  trade_no?: number
  trade_status?: number
  uid?: number
  updated_at?: string
  trade_status_name?: string 

  account?: string
  amount?: number
  create_at?: string
  description?: string
  out_order_no?: string
  share_status?: number

  remain_quantity?: number
  gift_trade_status?: number
  gift_trade_id?: number
  theme_title?: string
  picked_phone?: string[]
  sender_nickname?: string
  sender_avatar_url?: string
  picked_no?: string
  theme_message?: string

  group_price?: number
  is_group?: number

  star?: number
}
interface OrderItemProps {
  item: OItem
  num?: number
  isGroup?: boolean
  onNumber?: Function
  onClick?: Function
  onExpress?: Function
  onSelect?: Function
  onPay?: Function
  onRecived?: Function
  isShowPay?: boolean
  type?: 'order_buy' | 'order_user_show' | 'order_share_money' | 'order_shop' | 'order_shop_info' | 'gift_user_buy' | 'gift_user_recive'
}
function OrderItem(props: OrderItemProps) {
  const {item, num, onNumber=()=>{}, onExpress=()=>{}, type='order_buy', onSelect=() => {}, onRecived=() => {}, onClick=() => {}, onPay=() => {}, isShowPay=false, isGroup=false} = props
  const {
    img_urls=[], title, id, price, cover_url, 
    created_at, address, article_id, business_uid, 
    des, express_no, name, phone, product_id,
    quantity, status, total_price, trade_no, trade_status_name, trade_status,
    description, amount, create_at, account, out_order_no, share_status, remain_quantity,
    theme_title, picked_phone=[], sender_nickname, sender_avatar_url, picked_no, gift_trade_status,
    theme_message, gift_trade_id, group_price, is_group, star
  } = item
  const {styles} = useSelector((state: ReduxState) => state)

  return (
    <Block>
      {
        {
          'order_buy': (
            <Flex size='100% auto' radius='15' flex='frbc' padding='30 30' bgColor={styles.boxColor}>
              <Image size='128 128' src={img_urls[0] || ''} />
              <Flex flex='fcbs' size='430 100%'>
                <Text color={styles.textColor}>{title}</Text>
                <Text fontSize='28' color={styles.textColorLight}>{des || '纸禾禾'}</Text>
                <Flex flex='frbc' size='100% 100%'>
                  {isGroup ? 
                    <Text color={styles.colorRed}>￥{group_price?.toFixed(2)}</Text>
                    :
                    <Text color={styles.colorRed}>￥{price?.toFixed(2)}</Text>
                  }
                  <InputNumber value={num} onChange={(value) => {onNumber(value)}} />
                </Flex>
              </Flex>
            </Flex>
          ),
          'order_shop': (
            <Flex size='100% auto' radius='15' flex='frbc' padding='30 30' bgColor='#ffffff' shadowColor='#efefef'>
              <Press onClick={() => {onSelect()}}>
                {
                  item.is_select === 1 ?
                  <Image size='42 42' src={ICON_SELECT} />
                  :
                  <Box size='42 42' borderColor='#ff7310' radius='21'></Box>
                }
              </Press>
              <Image size='128 128' src={img_urls[0] || ''} />
              <Flex flex='fcbs' size='390 100%'>
                <Text color='#454545'>{title}</Text>
                <Text fontSize='28' color='#676464'>{des || '纸禾禾'}</Text>
                <Flex flex='frbc' size='100% 100%'>
                  <Text color='#ff7310'>￥{price?.toFixed(2)}</Text>
                  <InputNumber value={num} onChange={(value) => {onNumber(value)}} />
                </Flex>
              </Flex>
            </Flex>
          ),
          'order_shop_info': (
            <Flex size='100% auto' radius='15' flex='frbc' padding='40 30' bgColor='#ffffff' shadowColor='#efefef'>
              <Image size='128 128' src={img_urls[0] || ''} />
              <Flex flex='fcbs' size='430 100%'>
                <Text color='#454545'>{title}</Text>
                <Text fontSize='28' color='#676464'>{des || '纸禾禾'}</Text>
                <Flex flex='frbc' size='100% 100%'>
                  <Text color='#ff7310'>￥{price?.toFixed(2)}</Text>
                  <Flex flex='frsc'>
                    <Text fontSize='28'>共计</Text>
                    <Text fontWeight='bold'>{num}</Text>
                    <Text fontSize='28'>件</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          ),
          'order_user_show': (
            <Press>
              <Box size='100% auto' padding='30 30' radius='30' bgColor={styles.boxColor} margin='0 0 35 0'>
                <Press onClick={onClick}>
                  <Flex size='100% 150' flex='frbc'>
                    <Image size='150 150' radius='12' src={cover_url || ''} />
                    <Flex flex='fcbs' size='430 100%'>
                      <Text color={styles.textColor}>{title}</Text>
                      {
                        {
                          10: <Text fontSize='28' color='#f59042' >{trade_status_name}</Text>, 
                          15: <Text fontSize='28' color='#34a0f9' >{trade_status_name}</Text>, 
                          20: <Text fontSize='28' color='#5ec92c' >{trade_status_name}</Text>, 
                          5: <Text fontSize='28' color='#fc0b03' >{trade_status_name}</Text>, 
                          3: <Text fontSize='28' color='#8c8c8c' >{trade_status_name}</Text>,
                          1: <Text fontSize='28' color='#8c8c8c' >{trade_status_name}</Text>
                        }[trade_status || 3]
                      }
                      <Flex flex='frbc' size='100% 100%'>
                        <Text color={styles.textColor} fontWeight='bold'>￥{total_price?.toFixed(2)}</Text>
                        <Text color={styles.textColorGray} fontSize='30'>{is_group === 1 ? '【团购】': ''}共{quantity}件</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Press>
                <Box size='100% auto' padding='25 0 0 0'>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>订单号</Text>
                    <Text fontSize='28' color={styles.textColor}>{trade_no}</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>收件人</Text>
                    <Text fontSize='28' color={styles.textColor}>{name}</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>联系电话</Text>
                    <Text fontSize='28' color={styles.textColor}>{phone}</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>收货地址</Text>
                    <Flex flex='frec' size='460 auto'><Text fontSize='28' color={styles.textColor}>{address}</Text></Flex>
                  </Flex>
                  {
                    express_no &&
                    <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                      <Text fontSize='28' color={styles.textColorGray}>快递单号</Text>
                      <Press onClick={onExpress}>
                        <Text fontSize='28' color={styles.colorOrange} fontWeight='bold'>{express_no}</Text>
                      </Press>
                    </Flex>
                  }
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>下单时间</Text>
                    <Text fontSize='28' color={styles.textColor}>{dateTime(created_at, 'dateTime')}</Text>
                  </Flex>
                  {
                    isShowPay &&
                    <Press 
                      onClick={(e) => {
                        e.stopPropagation()
                        onPay()
                      }}
                    >
                      <Flex flex='frcc' bgColor={styles.colorOrange} size='100% 80' radius='24'>
                        <Text fontSize='30' color={styles.colorWhite}>去支付</Text>
                      </Flex>
                    </Press>
                  }
                  {
                    trade_status === 15 &&
                    <Press 
                      onClick={(e) => {
                        e.stopPropagation()
                        onRecived()
                      }}
                    >
                      <Flex flex='frcc' bgColor={styles.colorGreen} size='100% 80' radius='24'>
                        <Text fontSize='30' color={styles.colorWhite}>确认收货</Text>
                      </Flex>
                    </Press>
                  }
                  {
                    (trade_status === 20 && star === 0) &&
                    <Press 
                      onClick={(e) => {
                        e.stopPropagation()
                        Taro.navigateTo({url: '/pages/mine/product/AddComment?title=' + title + '&pid=' + product_id})
                      }}
                    >
                      <Flex flex='frcc' bgColor={styles.colorLightGreen} size='100% 80' radius='24'>
                        <Text fontSize='30' color={styles.colorWhite}>去评价</Text>
                      </Flex>
                    </Press>
                  }
                  {
                    (trade_status === 20 && (star || 0) > 0) &&
                    <Flex size='100% auto' flex='frbc'>
                      <Text fontSize='28' color={styles.textColorGray}>已评价</Text>
                      <StarTap type='show' score={star} />
                    </Flex>
                  }
                </Box>
              </Box>
            </Press>
          ),
          'gift_user_recive': (
            <Press>
              <Box size='100% auto' padding='30 30' bgColor={styles.boxColor} margin='0 0 25 0' radius='30'>
                <Box margin='0 0 15 0'>
                  <Flex flex='frsc'>
                    <Image size='60 60' radius='30' margin='0 15 0 0' src={sender_avatar_url || ''} />
                    <Text fontSize='28' color={styles.textColor}>{sender_nickname}</Text>
                  </Flex>
                  <Line size='100% 10' />
                  <Box><Text fontSize='28' color={styles.textColor}>祝：{theme_message}</Text></Box>
                </Box>
                <Line size='100% 20' />
                <Line size='100% 1' bgColor={styles.lineColor} />
                <Line size='100% 20' />
                <Press onClick={onClick}>
                  <Flex size='100% 150' flex='frbc'>
                    <Image size='150 150' radius='12' src={cover_url || ''} />
                    <Flex flex='fcbs' size='430 100%'>
                      <Text color={styles.textColor}>{title}</Text>
                      {
                        {
                          10: <Text fontSize='28' color='#f59042' >{trade_status_name}</Text>, 
                          8: <Text fontSize='28' color='#f59042' >{trade_status_name}</Text>, 
                          15: <Text fontSize='28' color='#2196F3' >{trade_status_name}</Text>, 
                          20: <Text fontSize='28' color='#5ec92c' >{trade_status_name}</Text>, 
                          5: <Text fontSize='28' color='#fc0b03' >{trade_status_name}</Text>, 
                          3: <Text fontSize='28' color='#8c8c8c' >{trade_status_name}</Text>,
                          1: <Text fontSize='28' color='#8c8c8c' >{trade_status_name}</Text>
                        }[gift_trade_status || 3]
                      }
                      <Flex flex='frbc' size='100% 100%'>
                        <Text color={styles.textColor} fontWeight='bold'>￥{((price || 0) * (quantity || 0)).toFixed(2)}</Text>
                        <Text color={styles.textColorGray} fontSize='30'>共{quantity}件</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Press>
                <Box size='100% auto' padding='25 0 0 0'>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>领取单号</Text>
                    <Text fontSize='28' color={styles.textColor}>{picked_no}</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>收件人</Text>
                    <Text fontSize='28' color={styles.textColor}>{name}</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>联系电话</Text>
                    <Text fontSize='28' color={styles.textColor}>{phone}</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>收货地址</Text>
                    <Flex flex='frec' size='460 auto'><Text fontSize='28' color={styles.textColor}>{address}</Text></Flex>
                  </Flex>
                  {
                    express_no &&
                    <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                      <Text fontSize='28' color={styles.textColorGray}>快递单号</Text>
                      <Press onClick={onExpress}>
                        <Text fontSize='28' color={styles.colorOrange} fontWeight='bold'>{express_no}</Text>
                      </Press>
                    </Flex>
                  }
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>领取时间</Text>
                    <Text fontSize='28' color={styles.textColor}>{dateTime(created_at, 'dateTime')}</Text>
                  </Flex>
                  {
                    gift_trade_status === 8 &&
                    <Press 
                      onClick={(e) => {
                        Taro.navigateTo({url: '/pages/gift/GiftSend?gtid=' + gift_trade_id + '&gpid=' + id})
                      }}
                    >
                      <Flex flex='frcc' bgColor={styles.colorRed} size='100% 80' radius='15'>
                        <Text fontSize='30' color={styles.colorWhite}>去确认发货</Text>
                      </Flex>
                    </Press>
                  }
                </Box>
              </Box>
            </Press>
          ),
          'gift_user_buy': (
            <Press>
              <Box size='100% auto' padding='30 30' bgColor={styles.boxColor} radius='30' margin='0 0 25 0'>
                <Press onClick={onClick}>
                  <Flex size='100% 150' flex='frbc'>
                    <Image size='150 150' radius='12' src={cover_url || ''} />
                    <Flex flex='fcbs' size='430 100%'>
                      <Text color={styles.textColor}>{title}</Text>
                      {
                        {
                          10: <Text fontSize='28' color='#f59042' >{trade_status_name}</Text>,
                          15: <Text fontSize='28' color='#2196F3' >{trade_status_name}</Text>,
                          20: <Text fontSize='28' color='#a3ca3f' >{trade_status_name}</Text>,
                          25: <Text fontSize='28' color='#f97910' >{trade_status_name}</Text>,
                          30: <Text fontSize='28' color='#5ec92c' >{trade_status_name}</Text>,
                          5: <Text fontSize='28' color='#fc0b03' >{trade_status_name}</Text>,
                          3: <Text fontSize='28' color='#8c8c8c' >{trade_status_name}</Text>,
                          1: <Text fontSize='28' color='#8c8c8c' >{trade_status_name}</Text>
                        }[trade_status || 3]
                      }
                      <Flex flex='frbc' size='100% 100%'>
                        <Text color={styles.textColor} fontWeight='bold'>￥{total_price?.toFixed(2)}</Text>
                        <Text color={styles.textColorGray} fontSize='30'>共{quantity}件/剩{remain_quantity}件</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Press>
                <Box size='100% auto' padding='25 0 0 0'>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>订单号</Text>
                    <Text fontSize='28' color={styles.textColor}>{trade_no}</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>电子贺卡</Text>
                    <Text fontSize='28' color={styles.textColor}>{theme_title}</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>下单时间</Text>
                    <Text fontSize='28' color={styles.textColor}>{dateTime(created_at, 'dateTime')}</Text>
                  </Flex>
                  <Line size='100% 1' bgColor={styles.lineColor} />
                  <Box size='100% auto' margin='0 0 15 0'>
                    <Box margin='15 0 15 0'><Text fontSize='28' color={styles.textColorGray} >可领取礼物的手机号({picked_phone.length}个)</Text></Box>
                    {
                      picked_phone?.length > 0 &&
                      picked_phone.map((item_p, index) => (
                        <Box margin='5 0 5 0'>
                          <Text fontSize='28' color={styles.textColor}>{item_p}</Text>
                        </Box>
                      ))
                    }
                  </Box>
                  {
                    (trade_status === 25 || trade_status === 30) &&
                    <Press 
                      onClick={(e) => {
                        Taro.navigateTo({url: '/pages/gift/GiftSend?gtid=' + id})
                      }}
                    >
                      <Line size='100% 2' bgColor={styles.lineColor} />
                      <Flex flex='frcc' bgColor={styles.boxColor} size='100% auto' padding='20 0 0 0'>
                        <Text fontSize='30' color={styles.textColor}>查看详情</Text>
                      </Flex>
                    </Press>
                  }
                </Box>
              </Box>
            </Press>
          ),
          'order_share_money': (
            <Press onClick={onClick}>
              <Box size='100% auto' padding='30 30' radius='30' bgColor={styles.boxColor} margin='0 0 25 0'>
                <Flex size='100% auto' flex='frbc'>
                  <Text color={styles.textColor}>{description}</Text>
                </Flex>
                <Box size='100% auto' padding='25 0 0 0'>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>分成</Text>
                    <Text color={styles.colorOrange} fontWeight='bold'>￥{((amount || 0) / 100).toFixed(2)}</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>分成单号</Text>
                    <Text fontSize='28' color={styles.textColor}>{out_order_no}</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>状态</Text>
                    <Text fontSize='28' color={share_status === 2 ? '#5ec92c' : '#f59042'}>{share_status === 2 ? '已分成' : '待分成'}</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frbc' margin='0 0 15 0'>
                    <Text fontSize='28' color={styles.textColorGray}>时间</Text>
                    <Text fontSize='28' color={styles.textColor}>{dateTime(create_at, 'dateTime')}</Text>
                  </Flex>
                </Box>
              </Box>
            </Press>
          )
        }[type]
      }

    </Block>
  )
}

export default OrderItem