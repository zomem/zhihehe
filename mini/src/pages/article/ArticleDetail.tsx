import React, {useEffect, useState} from "react"
import {useSelector, useDispatch} from 'react-redux'
import Taro, {getCurrentInstance, useShareAppMessage, useShareTimeline, useDidShow} from '@tarojs/taro'
import {RichText} from '@tarojs/components'

import Page from '@/components/widget/Page'
import ColorButton from '@/components/widget/colorButton/colorButton'
import UserAvatar from '@/components/widget/UserAvatar'
import Login from '@/components/widget/Login'
import {Block, SafeArea, Box, Flex, Line, Text, Button, Press, Image} from '@/components/widget/Components'
import AvatarLineList from "@/components/widget/AvatarLineList"
import ModalQRCode from "@/components/widget/ModalQRCode"

import {CONFIG_DATA, get, post, put} from '@/constants/fetch'
import {dateTime, pastTime, endTime} from '@/utils/timeFormat'
import {isRole} from '@/utils/authorize'
import {base64ToLocal} from '@/utils/filter'

import ICON_SHARE_PRO from '@/images/share_pro.png'
import ICON_SHARE_CODE from '@/images/share_code.png'
import Card from "@/components/widget/Card"
import StarTap from "@/components/widget/StarTap"
import UploadImage from "@/components/widget/UploadImage"
import Loading from "@/components/widget/Loading"


interface Detail {
  id: number
  uid: number
  nickname: string
  avatar_url: string
  title: string
  img_urls: string[]
  html: string
  created_at: string
  updated_at: string
  product_id: number
  product_title: string
  price: number
  product_imgs: string[]
  product_status: number
  quantity: number
  status: number
  des: string
  can_gift: number
  can_group: number
  group_price: number
  group_quantity: number
  group_end: string
  score?: number
  group_count?: number
  score_people?: number
  group_avatar?: string[]
}

function ArticleDetail() {
  const dispatch = useDispatch()
  const {currentUser, styles} = useSelector((state: ReduxState) => state)

  const [loading, setLoading] = useState(false)
  const [isOpenLogin, setIsOpenLogin] = useState(false)
  const [options, setOptions] = useState({
    aid: 0,
    fuid: 0, // 转发的uid
  })
  const [r, setR] = useState(0)

  const [detail, setDetail] = useState<Detail>({
    id: 0,
    uid: 0,
    nickname: '',
    avatar_url: '',
    title: '',
    img_urls: [],
    html: '',
    product_id: 0,
    created_at: '',
    updated_at: '',
    product_title: '',
    price: 0,
    product_imgs: [],
    product_status: 0,
    quantity: 0,
    status: 0,
    des: '',
    can_gift: 0,
    can_group: 0,
    group_price: 0,
    group_quantity: 0,
    group_end: '',
    group_count: 0,
    score: 0,
    score_people: 0,
    group_avatar: []
  })
  const [costInfo, setCostInfo] = useState<any>({})
  const [groupSec, setGroupSec] = useState('截止时间')
  const [isShareGroup, setIsShareGroup] = useState(false)
  const [isShowCode, setIsShowCode] = useState(false)
  const [codePath, setCodePath] = useState('')

  const [commentPage, setCommentPage] = useState(1)
  const [commentInfo, setCommentInfo] = useState<any>({
    list: [],
    have: true,
    loading: true,
  })


  useEffect(() => {
    const instance = getCurrentInstance()
    let aid = parseInt(instance?.router?.params.aid || '0')
    let fuid = parseInt(instance?.router?.params.fuid || '0')
    const scene = instance.router?.params?.scene || 0
    if (scene) {
      const myscene = decodeURIComponent(scene) //scene为场景值
      let listData = myscene.split("&")　　// 截取值
      let tempArr: number[] = []
      for(let i=0; i < listData.length; i++){
        tempArr.push(parseInt(listData[i].substr(listData[i].indexOf("=") + 1)))
      }
      aid = tempArr[0] || 0
      fuid = tempArr[1] || 0
    }
    if(fuid){
      // 说明有fuid
      Taro.setStorageSync('TEMP_FUID', fuid)
    }else{
      // 不存在，则看有没有历史
      fuid = Taro.getStorageSync('TEMP_FUID') || 0
    }
    setOptions({
      aid,
      fuid
    })
  }, [])


  // useDidShow(() => {
  //   setR(prev => prev + 1)
  //   setCommentPage(1)
  // })

  useEffect(() => {
    let inter
    if(options.aid){
      setLoading(true)
      get('/zhihehe/article/detail/' + options.aid, dispatch).then(res => {
        setDetail(res.data)
        if(res.data.group_end){
          inter = setInterval(() => {
            setGroupSec(endTime(res.data.group_end))
          }, 1000)
        }
        setLoading(false)
      })
    }
    return () => {
      clearInterval(inter)
    }
  }, [options.aid, r])

  useEffect(() => {
    if(options.aid && currentUser.id){
      get('/zhihehe/article/detail/cost/' + options.aid, dispatch).then(res => {
        setCostInfo(res.data)
      })
      if(isRole('salespeople', currentUser.role)){
        // 获取销售分享码
        post('/common/sale/product_wxcode/', {
          aid: options.aid,
          fuid: options.fuid
        },dispatch).then(res => {
          base64ToLocal(res.data.imgBase64).then(path => {
            setCodePath(path)
          })
        })
      }
    }
  }, [options.aid, r, currentUser.id, options.fuid, currentUser.role])

  useEffect(() => {
    if(detail.product_id){
      setCommentInfo(prev => ({
        ...prev,
        loading: true
      }))
      get('/zhihehe/comment/list/' + detail.product_id + '/' + commentPage, dispatch).then(res => {
        setCommentInfo(prev => ({
          list: commentPage === 1 ? res.data.list : prev.list.concat(res.data.list),
          have: res.data.have,
          loading: false,
        }))
      })
    }
  }, [detail.product_id, r, commentPage])

  useEffect(() => {
    if(detail.product_id && currentUser.id){
      get('/zhihehe/comment/user_com/' + detail.product_id, dispatch).then(res => {
        if(res.data.id){
          setCommentInfo(prev => ({
            list: [res.data, ...prev.list],
          }))
        }
      })
    }
  }, [detail.product_id, r, currentUser.id])
  
  
  useShareAppMessage(res => {
    // 如果没有转发者的id, 则为当前用户id，如果用户为销售，则为用户id
    let shareUid
    if(isRole('salespeople', currentUser.role)){
      shareUid = currentUser.id
    }else{
      shareUid = options.fuid || currentUser.id
    }

    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: isShareGroup ? `${currentUser.nickname}邀你参加【` + detail.title + '】的团购': detail.title,
        path: '/pages/article/ArticleDetail?aid=' + options.aid + '&fuid=' + shareUid,
        imageUrl: detail.product_imgs[0] || detail.img_urls[0]
      }
    }
    return {
      title: detail.title,
      path: '/pages/article/ArticleDetail?aid=' + options.aid + '&fuid=' + shareUid,
      imageUrl: detail.product_imgs[0] || detail.img_urls[0]
    }
  })

  useShareTimeline(() => {
    let shareUid
    if(isRole('salespeople', currentUser.role)){
      shareUid = currentUser.id
    }else{
      shareUid = options.fuid || currentUser.id
    }
    return {
      title: detail.title,
      query: 'aid=' + options.aid + '&fuid=' + shareUid,
      imageUrl: detail.img_urls[0]
    }
  })


  // 上架，下架操作
  const changeSale = (aid) => {
    put('/zhihehe/article/change/sale', {aid}, dispatch).then(res => {
      if(res.data.status === 2){
        Taro.showToast({title: '操作成功', icon: 'success'})
        setR(r + 1)
      }
    })
  }


  //加入购物车
  // const addShopCart = (pid, fuid, aid) => {
  //   post('/zhihehe/shopCart/add', {pid, fuid, aid}, dispatch).then(res => {
  //     if(res.data.status === 2){
  //       Taro.showToast({title: res.data.message, icon: 'success'})
  //     }else{
  //       Taro.showToast({title: res.data.message, icon: 'none'})
  //     }
  //   })
  // }

  return (
    <Block>
      <Page 
        navTitle={detail.title}
        padding='15'
        onScrollToLower={() => {
          if(!commentInfo.have) return
          if(commentInfo.loading) return
          setCommentPage(prev => prev + 1)
        }}
      >
        <Line size='auto 12' />
        <Card padding='20'>
          <Text fontSize='44' color={styles.textColor}>{detail.title}</Text>
          <Line size='auto 25' />
          <Flex flex='frbc' size='100% auto'>
            <Box size='450 auto'><Text fontSize='28' color={styles.textColorGray}>{detail.des}</Text></Box>
            {
              (detail.score_people || 0) > 0 ?
              <Flex flex='free'>
                <Text fontSize='28' color={styles.textColorGray}>{detail.score_people}人已评</Text>
                <Line size='8 1' />
                <Flex flex='frcc' bgColor={styles.colorGreen} radius='12' padding='2 10'>
                  <Text fontSize='28' color={styles.colorWhite}>{detail.score?.toFixed(1)}</Text>
                </Flex>
              </Flex>
              :
              <Box></Box>
            }
          </Flex>
          <Line size='auto 20' />

          {
            detail.can_group === 1 ? 
            <Block>
              <Flex flex='frsc'>
                <Text fontSize='28' color={styles.textColorGray}>
                  团购价: 
                  <Text fontSize='34' color={styles.colorLightGreen} fontWeight='bold'>
                    ￥{detail.group_price.toFixed(2)}
                    <Text fontSize='22' color={styles.colorOrange}> 省￥{(detail.price - detail.group_price).toFixed(2)}</Text>
                  </Text>
                </Text>
                <Line size='25 1' />
                <Text fontSize='28' color={styles.textColorGray}>剩余: <Text fontSize='34' color={styles.textColor}>{detail.group_quantity}</Text>件</Text>
              </Flex>
              <Line size='auto 20' />
              <Flex flex='frbc'>
                <Flex flex='frec'>
                  {typeof(costInfo.group_f_sale_cost) === 'number' && 
                    <Flex flex='frsc' margin='0 20 20 0'>
                      <Flex flex='frcc' borderColor={styles.colorGreen} padding='0 8' size='auto 30' radius='10'>
                        <Text color={styles.colorGreen} fontSize='20'>团购总销售分成</Text>
                      </Flex>
                      <Text color={styles.colorGreen} fontSize='24'>￥{(costInfo.group_f_sale_cost || 0).toFixed(2)}</Text>
                    </Flex>
                  }
                  {typeof(costInfo.group_sale_cost) === 'number' && 
                    <Flex flex='frsc' margin='0 0 20 0'>
                      <Flex flex='frcc' borderColor={styles.colorGreen} padding='0 8' size='auto 30' radius='10'>
                        <Text color={styles.colorGreen} fontSize='20'>团购销售分成</Text>
                      </Flex>
                      <Text color={styles.colorGreen} fontSize='24'>￥{(costInfo.group_sale_cost || 0).toFixed(2)}</Text>
                    </Flex>
                  }
                </Flex>
              </Flex>
              {/* <Line size='auto 20' /> */}
              <Text fontSize='28' color={styles.colorOrange}>{groupSec}</Text>
              <Line size='auto 20' />
              <Flex flex='frbc' size='100% auto'>
                <Box size='70% auto'>
                  <AvatarLineList
                    allNum={detail.group_count || 10}
                    avatars={detail.group_avatar || []}
                  />
                </Box>
                <Text fontSize='28' color={styles.textColorGray}>{detail.group_count}次跟团</Text>
              </Flex>
              <Line size='auto 16' />
              <Flex flex='frbc'>
                <Flex flex='frsc'>
                  <UserAvatar avatarUrl={CONFIG_DATA.FILE_URL + '/default/logo_avatar.png'} nickname={'纸禾禾'} />
                  <Line size='30 0' />
                </Flex>
                <Flex flex='fres'>
                  <Press openType='share' onClick={() => setIsShareGroup(true)}>
                    <Image size='42 42' src={ICON_SHARE_PRO} />
                  </Press>
                  <Line size='36 1' />
                  <Press 
                    onClick={() => {
                      if(!currentUser.id){
                        return setIsOpenLogin(true)
                      }
                      if(!isRole('salespeople', currentUser.role)){
                        return Taro.showModal({
                          title: '你还不是销售',
                          content: '成为销售，邀请新用户，即可享受单单分成。详情请联系客服',
                          showCancel: false
                        })
                      }
                      setIsShareGroup(true)
                      setIsShowCode(true)
                    }}
                  >
                    <Image size='42 42' src={ICON_SHARE_CODE} />
                  </Press>
                </Flex>
              </Flex>
            </Block>
            :
            <Block>
              <Flex flex='frss'>
                <Text fontSize='28' color={styles.textColorGray}>零售价: <Text fontSize='34' color={styles.colorRed} fontWeight='bold'>￥{detail.price.toFixed(2)}</Text></Text>
                <Line size='25 1' />
                <Text fontSize='28' color={styles.textColorGray}>库存: <Text fontSize='34' color={styles.textColor}>{detail.quantity}</Text>件</Text>
              </Flex>
              <Line size='auto 20' />
              <Flex flex='frbc'>
                <Flex flex='frec'>
                  {typeof(costInfo.f_sale_cost) === 'number' && 
                    <Flex flex='frsc' margin='0 20 20 0'>
                      <Flex flex='frcc' borderColor={styles.colorGreen} padding='0 8' size='auto 30' radius='10'>
                        <Text color={styles.colorGreen} fontSize='20'>总销售分成</Text>
                      </Flex>
                      <Text color={styles.colorGreen} fontSize='24'>￥{(costInfo.f_sale_cost || 0).toFixed(2)}</Text>
                    </Flex>
                  }
                  {typeof(costInfo.sale_cost) === 'number' && 
                    <Flex flex='frsc' margin='0 0 20 0'>
                      <Flex flex='frcc' borderColor={styles.colorGreen} padding='0 8' size='auto 30' radius='10'>
                        <Text color={styles.colorGreen} fontSize='20'>销售分成</Text>
                      </Flex>
                      <Text color={styles.colorGreen} fontSize='24'>￥{(costInfo.sale_cost || 0).toFixed(2)}</Text>
                    </Flex>
                  }
                </Flex>
              </Flex>
              {/* <Line size='auto 20' /> */}
              <Flex flex='frbc'>
                <Flex flex='frsc'>
                  <UserAvatar avatarUrl={CONFIG_DATA.FILE_URL + '/default/logo_avatar.png'} nickname={'纸禾禾'} />
                  <Line size='30 0' />
                </Flex>
                <Flex flex='fres'>
                  <Press openType='share' onClick={() => setIsShareGroup(false)}>
                    <Image size='42 42' src={ICON_SHARE_PRO} />
                  </Press>
                  <Line size='36 1' />
                  <Press 
                    onClick={() => {
                      if(!currentUser.id){
                        return setIsOpenLogin(true)
                      }
                      if(!isRole('salespeople', currentUser.role)){
                        return Taro.showModal({
                          title: '你还不是销售',
                          content: '成为销售，邀请新用户，即可享受单单分成。详情请联系客服',
                          showCancel: false,
                          confirmText: '知道了'
                        })
                      }
                      setIsShareGroup(false)
                      setIsShowCode(true)
                    }}
                  >
                    <Image size='42 42' src={ICON_SHARE_CODE} />
                  </Press>
                </Flex>
              </Flex>
            </Block>
          }
          
        </Card>
        <Line size='auto 20' />



        <Card padding='20'>
          <RichText nodes={detail.html}  />
        </Card>
        <Line size='auto 20' />

        {
          currentUser.id === detail.uid &&
          <Flex flex='frac' size='100% auto' padding='0 30' margin='25 0 50 0'>
            <ColorButton
              size='180 85'
              onClick={() => {
                if(!currentUser.id){
                  return setIsOpenLogin(true)
                }
                changeSale(detail.id)
              }}
            >
              {detail.status === 6 ? '上架' : '下架'}
            </ColorButton>
            <ColorButton
              size='180 85'
              onClick={() => {
                if(!currentUser.id){
                  return setIsOpenLogin(true)
                }
                Taro.navigateTo({
                  url: '/pages/mine/product/AddProduct?taid=' + detail.id + '&atype=online'
                })
              }}
            >
              编辑
            </ColorButton>
          </Flex>
        }

        {
          commentInfo.list.length > 0 &&
          <Card padding="0 20 0 20">
            {
              commentInfo.list.map((item, index) =>(
                <Block key={item.id}>
                  <Box size='100% auto' margin={item.img_urls.length > 0 ? '35 0 0 0' : '35 0 35 0'}>
                    <Flex flex='frbc'>
                      <Flex flex='frsc'>
                        <Image size='64 64' radius='32' src={item.avatar_url} />
                        <Line size='15 1' />
                        <Flex flex='fcbs' size='auto 64'>
                          <Text color={styles.textColor} fontSize={styles.textSizeS}>{item.nickname}</Text>
                          <StarTap type='show_mini' score={item.star} />
                        </Flex>
                      </Flex>
                      {
                        item.status === 2 ?
                        <Text fontSize={styles.textSizeXXS} color={styles.textColorGray}>{pastTime(item.created_at)}</Text>
                        :
                        <Text fontSize={styles.textSizeXXS} color={styles.colorOrange}>审核中</Text>
                      }
                    </Flex>
                    <Line size='100% 15' />
                    <Box size="100% auto" padding="0 12"><Text color={styles.textColor} fontSize={styles.textSizeS}>{item.content || '已评价'}</Text></Box>
                    {
                      item.img_urls.length > 0 &&
                      <Block>
                        <Line size='100% 15' />
                        <UploadImage radius='25' disable imgList={item.img_urls} />
                      </Block>
                    }
                  </Box>
                  {
                    index !== commentInfo.list.length - 1 &&
                    <Line size="100% 1" bgColor={styles.lineColor} />
                  }
                </Block>
              ))
            }
            {
              commentInfo.loading ? <Loading />
              :
              commentInfo.have ? <Loading />
              :
              <Loading title="没有更多了" />
            }
          </Card>
        }



        
        <Line size='auto 120' safe='bottom' />
      </Page>

      <SafeArea safe='bottom' backdrop='20' bgColor={styles.bottomBoxColor} position='fixed' left='0' bottom='0' size='100% 110'>
        <Line size='100% 1' bgColor={styles.lineColor} />
        <Flex flex='frbc' size='100% 100%' padding='0 30'>
          {
            detail.can_group === 1 ?
            <Flex flex='fcbs'>
              <Text fontSize='24' color={styles.textColorGray}>团购价: <Text fontSize='30' color={styles.colorLightGreen} fontWeight='bold'>￥{detail.group_price.toFixed(2)}</Text></Text>
              <Text fontSize='24' color={styles.textColorGray}>剩余: <Text fontSize='30' color={styles.textColor}>{detail.group_quantity}</Text>件</Text>
            </Flex>
            :
            <Flex flex='fcbs'>
              <Text fontSize='24' color={styles.textColorGray}>零售价: <Text fontSize='30' color={styles.colorRed} fontWeight='bold'>￥{detail.price.toFixed(2)}</Text></Text>
              <Text fontSize='24' color={styles.textColorGray}>库存: <Text fontSize='30' color={styles.textColor}>{detail.quantity}</Text>件</Text>
            </Flex>
          }
          {/* <ColorButton
            size='220 95'
            disable={(detail.quantity <= 0 || detail.status === 6)? true : false}
            onClick={() => {
              if(!currentUser.id){
                return setIsOpenLogin(true)
              }
              addShopCart(detail.product_id, options.fuid, options.aid)
            }}
          >
            加入购物车
          </ColorButton> */}
          <Flex flex='frec'>
            {
              detail.can_gift === 1 &&
              <Button
                size='200 80'
                radius='40'
                letterSpacing='normal'
                bgImage='linear-gradient(to right , #ff8ea3, #ff7258)'
                disable={(detail.quantity <= 0 || detail.status === 6)? true : false}
                onClick={() => {
                  if(!currentUser.id){
                    return setIsOpenLogin(true)
                  }
                  Taro.navigateTo({url: '/pages/article/BuyProduct?aid=' + options.aid + '&pid=' + detail.product_id + '&fuid=' + options.fuid + '&open_gift=1'})
                }}
              >
                赠送礼物
              </Button>
            }
            <Line size='20 1' />
            {
              detail.can_group !== 1 &&
              <ColorButton
                size='200 80'
                disable={(detail.quantity <= 0 || detail.status === 6)? true : false}
                onClick={() => {
                  if(!currentUser.id){
                    return setIsOpenLogin(true)
                  }
                  Taro.navigateTo({url: '/pages/article/BuyProduct?aid=' + options.aid + '&pid=' + detail.product_id + '&fuid=' + options.fuid})
                }}
              >
                {
                  loading ? '加载中' :
                  detail.quantity <= 0 ? '已售罄' :
                  detail.status === 6 ? '已下架' : '立即购买'
                }
              </ColorButton>
            }
            
            {
              detail.can_group === 1 &&
              <Button
                size='200 80'
                radius='40'
                letterSpacing='normal'
                bgImage='linear-gradient(to right , #6cc68c, #36a65d)'
                disable={(detail.group_quantity <= 0 || detail.status === 6 || new Date(detail.group_end) < new Date() || groupSec === '已结束')? true : false}
                onClick={() => {
                  if(!currentUser.id){
                    return setIsOpenLogin(true)
                  }
                  Taro.navigateTo({url: '/pages/article/BuyProduct?aid=' + options.aid + '&pid=' + detail.product_id + '&fuid=' + options.fuid + '&open_group=1'})
                }}
              >
                {
                loading ? '加载中' :
                detail.group_quantity <= 0 ? '团购结束' :
                detail.status === 6 ? '已下架' :
                (new Date(detail.group_end) < new Date() || groupSec === '团购结束') ?
                '团购结束' : '去参团'
              }
              </Button>
            }
          </Flex>
        </Flex>
      </SafeArea>

      <ModalQRCode 
        isShow={isShowCode}
        avatar={currentUser.avatar_url}
        nickName={currentUser.nickname}
        des={detail.des}
        title={isShareGroup ? '[团购] ' + detail.title : detail.title}
        codeUrl={codePath}
        topUrl={detail.img_urls[0]}
        price={(isShareGroup ? detail.group_price.toFixed(2) : detail.price.toFixed(2)) + (isShareGroup ? ' [团购价]' : '')}
        onCancel={() => setIsShowCode(false)}
      />


      <Login
        type='wechat'
        isOpen={isOpenLogin}
        onCancel={() => setIsOpenLogin(false)}
        onConfirm={() => setIsOpenLogin(false)}
      />
    </Block>
  )
}

export default ArticleDetail