import React, {useEffect, useState, Fragment} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Taro, {navigateTo, useReady, useShareAppMessage, useShareTimeline, getCurrentInstance} from '@tarojs/taro'

import Page from '@/components/widget/Page'
import ArticleItem from '@/components/ArticleItem'
import ChangeTab from '@/components/ChangeTab'

import {get} from '@/constants/fetch'
import { Box, Block, Image, Text, Line, Press, Flex } from '@/components/widget/Components'

import {CONFIG_DATA} from '@/constants/fetch'
import onProductCatList from '@/actions/productCat'
import {isRole} from '@/utils/authorize'
import Loading from '@/components/widget/Loading'
import {onGiftNotice} from '@/actions/gift'

import ICON_LIVE from '@/images/icons/live.png'

const sys = Taro.getSystemInfoSync()
const rx = 750 / sys.windowWidth

function Index() {
  const dispatch = useDispatch()
  const {currentUser, productCat, gift, styles} = useSelector((state: ReduxState) => state)
  const {giftNotice} = gift

  const [r, setR] = useState(0)
  const [page, setPage] = useState(1)
  const [info, setInfo] = useState({
    list: Taro.getStorageSync('PRODUCT_LIST') || [],
    loading: false,
    have: true
  })
  const [infoBefor, setInfoBefor] = useState(() => {
    let temp = Taro.getStorageSync('PRODUCT_LIST') || []
    temp.splice(6, temp.length - 6)
    return {
      list: temp || [],
      loading: false,
      have: true
    }
  })
  const [options, setOptions] = useState({
    fuid: 0, // 转发的uid
  })
  const [current, setCurrent] = useState(0)

  const [mounted, setMounted] = useState(false)

  useReady(() => {
    Taro.nextTick(() => {
      setMounted(true)
    })
  })

  useEffect(() => {
    // 查寻有礼物未结束数量
    if(currentUser.id){
      onGiftNotice()(dispatch)
    }
  }, [currentUser.id])

  useEffect(() => {
    if(giftNotice.recive_num || giftNotice.send_num){
      Taro.setTabBarBadge({
        index: 2,
        text: `${giftNotice.recive_num + giftNotice.send_num}`
      })
    }
  }, [giftNotice.recive_num, giftNotice.send_num])



  useEffect(() => {
    const instance = getCurrentInstance()
    let fuid = parseInt(instance?.router?.params.fuid || '0')
    const scene = instance.router?.params?.scene || 0
    if (scene) {
      const myscene = decodeURIComponent(scene) //scene为场景值
      let listData = myscene.split("&")　　// 截取值
      let tempArr: number[] = []
      for(let i=0; i < listData.length; i++){
        tempArr.push(parseInt(listData[i].substr(listData[i].indexOf("=") + 1)))
      }
      fuid = tempArr[0] || 0
    }
    if(fuid){
      // 说明有fuid
      Taro.setStorageSync('TEMP_FUID', fuid)
    }else{
      // 不存在，则看有没有历史
      fuid = Taro.getStorageSync('TEMP_FUID') || 0
    }
    setOptions({
      fuid
    })
    onProductCatList()(dispatch)
  }, [])

  useEffect(() => {
    setInfo(prev => ({
      ...prev,
      loading: true
    }))
    const catList = [{id: 0, title: '推荐'}, ...productCat.list]
    if(page > 0){
      if(currentUser.id){
        get('/zhihehe/article/list/saler/' + page + '/' + catList[current].id, dispatch).then(res => {
          if(!res.data.list){
            get('/zhihehe/article/list/' + page + '/' + catList[current].id, dispatch).then(res => {
              if(page === 1 && current === 0){
                Taro.setStorageSync('PRODUCT_LIST', res.data.list)
              }
              setInfo(prev => ({
                list: page === 1 ? res.data.list : [...prev.list, ...res.data.list],
                have: res.data.have,
                loading: false
              }))
            })
          }else{
            if(page === 1 && current === 0){
              Taro.setStorageSync('PRODUCT_LIST', res.data.list)
            }
            setInfo(prev => ({
              list: page === 1 ? res.data.list : [...prev.list, ...res.data.list],
              have: res.data.have,
              loading: false
            }))
          }
        })
      }else{
        get('/zhihehe/article/list/' + page + '/' + catList[current].id, dispatch).then(res => {
          if(page === 1){
            Taro.setStorageSync('PRODUCT_LIST', res.data.list)
          }
          setInfo(prev => ({
            list: page === 1 ? res.data.list : [...prev.list, ...res.data.list],
            have: res.data.have,
            loading: false
          }))
        })
      }
    }
  }, [page, r, currentUser.id, current, productCat.list])

  const onNavToArticle = (id) => {
    navigateTo({
      url: '/pages/article/ArticleDetail?aid=' + id
    })
  }

  // useDidShow(() => {
  //   setR(r + 1)
  //   setPage(1)
  // })
  


  
  useShareAppMessage(res => {
    // 如果没有转发者的id, 则为当前用户id
    let shareUid
    if(isRole('salespeople', currentUser.role)){
      shareUid = currentUser.id
    }else{
      shareUid = options.fuid || currentUser.id
    }

    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: '纸禾禾',
        path: '/pages/index/Index?fuid=' + shareUid,
        imageUrl: CONFIG_DATA.FILE_URL + '/default/index_mini_share.png'
      }
    }
    return {
      title: '纸禾禾',
      path: '/pages/index/Index?fuid=' + shareUid,
      imageUrl: CONFIG_DATA.FILE_URL + '/default/index_mini_share.png'
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
      title: '纸禾禾',
      query: 'fuid=' + shareUid,
      imageUrl: CONFIG_DATA.FILE_URL + '/default/index_mini_share.png'
    }
  })


  

  return (
    <Block>
      {/* <Box position='fixed' right='0' top='200' zIndex='200'>
        <Press
          hoverBgColor={styles.hoverColor}
          onClick={() => {
            Taro.navigateTo({url: '/pages/live/Live'})
          }}
        >
          <Flex radius='82 0 0 82' flex='frcc' padding='10 15' size='100% 100%' backdrop='20' bgColor={styles.boxColorGrayBlur}>
            <Image size='42 42' src={ICON_LIVE} margin='0 10 0 0' />
            <Text color={styles.textColor} fontSize={styles.textSizeXS}>看直播</Text>
          </Flex>
        </Press>
      </Box> */}
      <Page
        lowerThreshold='450'
        type='tabpage'
        navTitle='纸禾禾'
        isContentStartUnder
        bgImage={styles.pageBgImage}
        onScrollToUpper={() => {
          if(info.loading) return
          setR(r + 1)
          setPage(1)
        }}
        onScrollToLower={() => {
          if(info.loading) return
          if(!info.have) return
          setPage(page + 1)
        }}
      >
        <Box size='100% 502' >
          <Image src={styles.iconHomeBanner} size='100% 502' />
        </Box>
        <Box size='100% auto' minHeight={`${sys.windowHeight * rx - 502}`} padding='0 15' margin='-60 0 0 0' bgColor={styles.pageBgColor} position='relative' zIndex='0'>
          <Box size='100% 60' bgColor={styles.boxHomeColor} position='absolute' left='0' top='0' zIndex='-1' />
          <ChangeTab
            list={[{id: 0, title: '推荐'}, ...productCat.list]}
            isScroll={productCat.list.length > 2 ? true : false}
            itemWidth='100'
            current={current}
            onChange={(index) => {
              if(current === index) return
              setCurrent(index)
              setInfo({
                list: [],
                loading: false,
                have: true
              })
            }}
          />
          <Line size='1 15' />
          {
            mounted ?
            <Fragment >
              {
                info.list.length > 0 &&
                info.list.map((item:any, index) => (
                  <ArticleItem
                    noBottom={index === info.list.length - 1 ? true : false}
                    type={item.can_group === 1 ? 'group_sale_user' : 'sale_user'}
                    item={item}
                    onClick={() => onNavToArticle(item.id)}
                    radius={index === 0 ? '30 30 0 0' : index === info.list.length - 1 ? '0 0 30 30' : '0'}
                  />
                ))
              }
              {
                info.loading ?
                <Loading />
                :
                info.have ?
                <Loading />
                :
                <Loading title='没有更多了' />
              }
            </Fragment>
            :
            <Fragment >
              {
                infoBefor.list.length > 0 &&
                infoBefor.list.map((item:any, index) => (
                  <ArticleItem
                    noBottom={index === infoBefor.list.length - 1 ? true : false}
                    type={item.can_group === 1 ? 'group_sale_user' : 'sale_user'}
                    item={item}
                    onClick={() => onNavToArticle(item.id)}
                    radius={index === 0 ? '30 30 0 0' : index === infoBefor.list.length - 1 ? '0 0 30 30' : '0'}
                  />
                ))
              }
            </Fragment>
          }
        </Box>
      </Page>
    </Block>
  )
}

export default Index

