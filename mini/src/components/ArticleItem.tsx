import React, {} from "react"
import {useSelector} from 'react-redux'
import {Box, Flex, Image, TextEllipsis, Text, Press, Block, Line} from '@/components/widget/Components'

import UserAvatar from '@/components/widget/UserAvatar'
import {Decimal} from "decimal.js"
import {CONFIG_DATA} from '@/constants/fetch'

import {dateTime} from '@/utils/timeFormat'
import ICON_ITEM_CAR from '@/images/icons/item_car.png'

interface Item {
  id?: number
  title?: string
  product_title?: string
  des?: string
  img_urls?: string[]
  created_at?: string
  author?: string
  avatar_url?: string
  nickname?: string
  price?: number
  reason?: string
  sale_cost?: number
  f_sale_cost?: number
  can_gift?: number
  can_group?: number
  quantity?: number
  cat_title?: string

  group_price?: number
  group_quantity?: number,
  group_sale_cost?: number,
  group_f_sale_cost?: number,
  group_end?: string
}

interface ArticleItemProps{
  item: Item
  type?: 'simple' | 'busi' | 'busi_reason' | 'sale_user' | 'group_sale_user'
  onClick?: Function
  radius?: string
  noBottom?: boolean
}

function ArticleItem(props: ArticleItemProps){
  const {item={img_urls: []}, noBottom=false, type='simple', onClick=()=>{}, radius=''} = props
  const {styles} = useSelector((state: ReduxState) => state)

  return (
    <Block>
      {
        {
          'simple': (
            <Press
              onClick={onClick}
            >
              <Box padding='15 30 15 30' size='100% 180' bgColor={styles.boxColor}>
                <Flex flex='frbc' size='100% 100%'>
                  <Image
                    radius='12'
                    size='220 140'
                    src={item.img_urls ? item.img_urls[0] : ''}
                  />
                  <Flex flex='fcbs' size='440 150'>
                    <TextEllipsis line='1' color={styles.textColor}>{item.product_title}</TextEllipsis>
                    <Text fontSize='24' padding='0 0 15 0' color={styles.textColorGray}>{item.des}</Text>
                    <Flex size='100% auto' flex='frbc'>
                      <UserAvatar avatarUrl={CONFIG_DATA.FILE_URL + '/default/logo_avatar.png'} nickname={'纸禾禾'} />
                      <Text color={styles.colorOrange} fontSize='30'>￥{item.price?.toFixed(2)}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            </Press>
          ),
          'sale_user': (
            <Press
              onClick={onClick}
            >
              <Box padding='15 20' size='100% 221' bgColor={styles.boxColor} radius={radius}>
                <Flex flex='frbc' size='100% 100%'>
                  <Box size='190 190' position='relative' radius='12' overflow='hidden'>
                    <Image
                      radius='12'
                      size='190 190'
                      src={item.img_urls ? item.img_urls[0] : ''}
                    />
                    {
                      item.quantity &&
                      (item.quantity <= 10) &&
                      <Flex size='100% 50' radius='0 0 12 12' flex='frcc' position='absolute' left='0' bottom='0' backdrop='20' bgColor='rgba(15, 15, 15, 0.6)'>
                        <Text fontSize={styles.textSizeXXS} color={styles.colorWhite}>仅剩{item.quantity}件</Text>
                      </Flex>
                    }
                    {
                      ((item.quantity || 0) <= 0) &&
                      <Flex size='100% 50' radius='0 0 12 12' flex='frcc' position='absolute' left='0' bottom='0' backdrop='20' bgColor='rgba(15, 15, 15, 0.6)'>
                        <Text fontSize={styles.textSizeXXS} color={styles.colorWhite}>已售罄</Text>
                      </Flex>
                    }
                  </Box>
                  <Flex flex='fcbs' size='470 190'>
                    <TextEllipsis line='1' fontSize='34' color={styles.textColor}>{item.product_title}</TextEllipsis>
                    <TextEllipsis fontSize='24' color={styles.textColorGray}>{item.des}</TextEllipsis>
                    <Flex flex='frbc' size='100% auto'>
                      {/* <Text fontSize='28' color='#7b7b7b'>已售 {(item.id || 1) * 36}</Text> */}
                      <Flex flex='frsc'>
                        <Flex flex='frcc' borderColor={styles.colorGreen} padding='3 8' radius='10'>
                          <Text color={styles.colorGreen} fontSize='20'>{item.cat_title || '推荐'}</Text>
                        </Flex>
                        {item.can_gift === 1 && <Line size='15 1' />}
                        {
                          item.can_gift === 1 &&
                          <Flex flex='frcc' bgColor={styles.colorRed} padding='3 7' radius='10'>
                            <Text color={styles.colorWhite} fontSize='20'>礼</Text>
                          </Flex>
                        }
                        {item.can_group === 1 && <Line size='15 1' />}
                        {
                          item.can_group === 1 &&
                          <Flex flex='frcc' bgColor={styles.colorLightGreen} padding='3 7' radius='10'>
                            <Text color={styles.colorWhite} fontSize='20'>团购中</Text>
                          </Flex>
                        }
                      </Flex>
                      <Flex flex='frsc'>
                        {typeof(item.f_sale_cost) === 'number' && 
                          <Flex flex='frsc'>
                            <Flex flex='frcc' borderColor={styles.colorGreen} size='30 30' radius='10'>
                              <Text color={styles.colorGreen} fontSize='20'>总</Text>
                            </Flex>
                            <Text color={styles.colorGreen} fontSize='24'>￥{item.f_sale_cost || 0}</Text>
                          </Flex>
                        }
                        <Line size='10 1' />
                        {typeof(item.sale_cost) === 'number' && 
                          <Flex flex='frsc'>
                            <Flex flex='frcc' borderColor={styles.colorGreen} size='30 30' radius='10'>
                              <Text color={styles.colorGreen} fontSize='20'>销</Text>
                            </Flex>
                            <Text color={styles.colorGreen} fontSize='24'>￥{item.sale_cost || 0}</Text>
                          </Flex>
                        }
                      </Flex>
                      <Image size='42 42' src={ICON_ITEM_CAR} />
                    </Flex>
                    <Flex size='100% auto' flex='frbc'>
                      <Flex flex='frse'>
                        <Text color={styles.colorRed} fontSize='34'>￥{item.price?.toFixed(2)}</Text>
                        <Text color={styles.textColorLight} fontSize='24' padding='0 0 0 10' textDecoration='line-through'>
                          ￥{new Decimal(item.price || 0).mul(new Decimal(1.2)).toNumber().toFixed(2)}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
              {!noBottom && <Line size='100% 1' bgColor={styles.lineColor} />}
            </Press>
          ),
          'group_sale_user': (
            <Press
              onClick={onClick}
            >
              <Box padding='15 20' size='100% 221' bgColor={styles.boxColor} radius={radius}>
                <Flex flex='frbc' size='100% 100%'>
                  <Box size='190 190' position='relative' radius='12' overflow='hidden'>
                    <Image
                      radius='12'
                      size='190 190'
                      src={item.img_urls ? item.img_urls[0] : ''}
                    />
                    {
                      new Date(item.group_end || '') < new Date() ?
                      <Flex size='100% 50' radius='0 0 12 12' flex='frcc' position='absolute' left='0' bottom='0' backdrop='20' bgColor='rgba(15, 15, 15, 0.6)'>
                        <Text fontSize={styles.textSizeXXS} color={styles.colorWhite}>团购已结束</Text>
                      </Flex>
                      :
                      <Block>
                        {
                          item.group_quantity &&
                          (item.group_quantity <= 10) &&
                          <Flex size='100% 50' radius='0 0 12 12' flex='frcc' position='absolute' left='0' bottom='0' backdrop='20' bgColor='rgba(15, 15, 15, 0.6)'>
                            <Text fontSize={styles.textSizeXXS} color={styles.colorWhite}>团购仅剩{item.group_quantity}件</Text>
                          </Flex>
                        }
                        {
                          ((item.group_quantity || 0) <= 0) &&
                          <Flex size='100% 50' radius='0 0 12 12' flex='frcc' position='absolute' left='0' bottom='0' backdrop='20' bgColor='rgba(15, 15, 15, 0.6)'>
                            <Text fontSize={styles.textSizeXXS} color={styles.colorWhite}>团购已售罄</Text>
                          </Flex>
                        }
                      </Block>
                    }
                  </Box>
                  <Flex flex='fcbs' size='470 190'>
                    <TextEllipsis line='1' fontSize='34' color={styles.textColor}>{item.product_title}</TextEllipsis>
                    <TextEllipsis fontSize='24' color={styles.textColorGray}>{item.des}</TextEllipsis>
                    <Flex flex='frbc' size='100% auto'>
                      {/* <Text fontSize='28' color='#7b7b7b'>已售 {(item.id || 1) * 36}</Text> */}
                      <Flex flex='frsc'>
                        <Flex flex='frcc' borderColor={styles.colorGreen} padding='3 8' radius='10'>
                          <Text color={styles.colorGreen} fontSize='20'>{item.cat_title || '购享推荐'}</Text>
                        </Flex>
                        {item.can_gift === 1 && <Line size='15 1' />}
                        {
                          (item.can_gift === 1 && item.can_group !== 1) &&
                          <Flex flex='frcc' bgColor={styles.colorRed} padding='3 7' radius='10'>
                            <Text color={styles.colorWhite} fontSize='20'>礼</Text>
                          </Flex>
                        }
                        {item.can_group === 1 && <Line size='15 1' />}
                        {
                          item.can_group === 1 &&
                          <Flex flex='frcc' bgColor={styles.colorLightGreen} padding='3 7' radius='10'>
                            <Text color={styles.colorWhite} fontSize='20'>团购中</Text>
                          </Flex>
                        }
                      </Flex>
                      <Flex flex='frsc'>
                        {typeof(item.group_f_sale_cost) === 'number' && 
                          <Flex flex='frsc'>
                            <Flex flex='frcc' borderColor={styles.colorGreen} size='30 30' radius='10'>
                              <Text color={styles.colorGreen} fontSize='20'>总</Text>
                            </Flex>
                            <Text color={styles.colorGreen} fontSize='24'>￥{item.group_f_sale_cost || 0}</Text>
                          </Flex>
                        }
                        <Line size='10 1' />
                        {typeof(item.group_sale_cost) === 'number' && 
                          <Flex flex='frsc'>
                            <Flex flex='frcc' borderColor={styles.colorGreen} size='30 30' radius='10'>
                              <Text color={styles.colorGreen} fontSize='20'>销</Text>
                            </Flex>
                            <Text color={styles.colorGreen} fontSize='24'>￥{item.group_sale_cost || 0}</Text>
                          </Flex>
                        }
                      </Flex>
                      <Image size='42 42' src={ICON_ITEM_CAR} />
                    </Flex>
                    <Flex size='100% auto' flex='frbc'>
                      <Flex flex='frse'>
                        <Text color={styles.colorLightGreen} fontSize='34'>
                          ￥{item.group_price?.toFixed(2)}
                          <Text fontSize='22' color={styles.colorOrange}> 省￥{((item.price || 0) - (item.group_price || 0)).toFixed(2)}</Text>
                        </Text>
                        <Text color={styles.textColorLight} fontSize='24' padding='0 0 0 10' textDecoration='line-through'>
                          ￥{new Decimal(item.price || 0).mul(new Decimal(1.2)).toNumber().toFixed(2)}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
              {!noBottom && <Line size='100% 1' bgColor={styles.lineColor} />}
            </Press>
          ),
          'busi': (
            <Press
              onClick={onClick}
            >
              <Box padding='15 30 15 30' size='100% 180' bgColor={styles.boxColor}>
                <Flex flex='frbc' size='100% 100%'>
                  <Image
                    radius='12'
                    size='220 140'
                    src={item.img_urls ? item.img_urls[0] : ''}
                  />
                  <Flex flex='fcbs' size='440 150'>
                    <TextEllipsis line='1' color={styles.textColor}>{item.product_title}</TextEllipsis>
                    <Text fontSize='24' padding='0 0 15 0' color={styles.textColorGray}>{item.des}</Text>
                    <Flex size='100% auto' flex='frbc'>
                      <Text color={styles.colorOrange} fontSize='30'>￥{item.price?.toFixed(2)}</Text>
                      <Text color={styles.textColorGray} fontSize='28'>{dateTime(item.created_at, 'dateTime')}</Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            </Press>
          ),
          'busi_reason': (
            <Press
              onClick={onClick}
            >
              <Box padding='15 30 15 30' size='100% auto' bgColor={styles.boxColor}>
                <Flex flex='frbc' size='100% 100%'>
                  <Image
                    radius='12'
                    size='220 140'
                    src={item.img_urls ? item.img_urls[0] : ''}
                  />
                  <Flex flex='fcbs' size='440 auto'>
                    <TextEllipsis line='1' color={styles.textColor}>{item.product_title}</TextEllipsis>
                    <Text fontSize='24' padding='0 0 15 0' color={styles.textColorGray}>{item.des}</Text>
                    <Flex size='100% auto' flex='frbc'>
                      <Text color={styles.colorOrange} fontSize='30'>￥{item.price?.toFixed(2)}</Text>
                      <Text color={styles.textColorGray} fontSize='28'>{dateTime(item.created_at, 'dateTime')}</Text>
                    </Flex>
                    <Text fontSize='28' padding='15 0 15 0' color={styles.textColor}>{`【驳回原因】：${item.reason}`}</Text>
                  </Flex>
                </Flex>
              </Box>
            </Press>
          )
        }[type]
      }
      
    </Block>
  )
}


export default ArticleItem