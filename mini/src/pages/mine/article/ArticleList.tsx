import React, {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import Taro from '@tarojs/taro'

import Page from '@/components/widget/Page'

import ArticleItem from '@/components/ArticleItem'
import Loading from '@/components/widget/Loading'
import TopCatLine from '@/components/widget/topCatLine/topCatLine'
import { Block, Box, Line} from '@/components/widget/Components'

import {get} from '@/constants/fetch'

function ArticleList() {
  const TOP_TITLE = {
    name: ['已发布', '待审核', '未通过', '已下架'],
    type: [20, 10, 5, 6]
  }
  const dispatch = useDispatch()
  const [check, setCheck] = useState({
    page: 1,
    type: 20,
    current: 0
  })
  const [info, setInfo] = useState<{list: any[], have: boolean, loading: boolean}>({
    list: [],
    have: true,
    loading: true
  })

  useEffect(() => {
    setInfo(prev => ({...prev, loading: true, list: []}))
    get('/zhihehe/article/busi_list/' + check.page + '/' + check.type, dispatch).then(res => {
      setInfo(prev => ({
        list: check.page === 1 ? res.data.list : [...prev.list, ...res.data.list],
        have: res.data.have,
        loading: false
      }))
    })
  }, [check.page, check.type])

  return(
    <Page 
      isAlwaysShowNav
      navTitle='商品管理'
      onScrollToLower={() => {
        if(info.loading) return
        if(!info.have) return
        setCheck(prev => ({...prev, page: prev.page + 1}))
      }}
    >
      <TopCatLine
        titleList={TOP_TITLE.name}
        current={check.current}
        onChange={(c) => setCheck({page: 1, type: TOP_TITLE.type[c], current: c})}
      />
      <Line size='1 90' />
      <Box size='100% auto' padding='30 0'>
        {
          info.list.length > 0 &&
          info.list.map((item, index) => (
            <ArticleItem
              type={check.type === 5 ? 'busi_reason' : 'busi'}
              item={item}
              key={item.id}
              onClick={() => {
                if(check.type === 10 || check.type === 5){
                  Taro.navigateTo({
                    url: '/pages/mine/product/AddProduct?taid=' + item.id + '&atype=draft'
                  })
                }else{
                  Taro.navigateTo({
                    url: '/pages/article/ArticleDetail?aid=' + item.id
                  })
                }
              }}
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
      </Box>
    </Page>
  )
}

export default ArticleList