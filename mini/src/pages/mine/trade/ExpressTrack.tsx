import React, { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Box, Block, Flex, Text, Line} from '@/components/widget/Components'

import Page from '@/components/widget/Page'

import Track from '@/components/widget/Track'
import Loading from '@/components/widget/Loading'

import {get} from '@/constants/fetch'
import {EXPRESS_NAME} from '@/constants/constants'

const ExpressTrack = () => {
  const dispatch = useDispatch()

  const [options, setOptions] = useState({
    tradeNo: ''
  })
  const [track, setTrack] = useState<any>({
    
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const instance = getCurrentInstance().router?.params
    const trade_no = instance?.tradeNo || ''
    setOptions({
      tradeNo: trade_no
    })
  }, [])


  useEffect(() => {
    if(options.tradeNo){
      get('/express/delivery/path/' + options.tradeNo, dispatch).then(res => {
        setTrack(res.data)
        setLoading(false)
      })
    }
  }, [options.tradeNo])

  
  

  return (
    <Page navTitle='运单轨迹'>
      {
        track.delivery_id &&
        <Flex flex='frsc' padding='20 30'>
          <Text fontSize='34'>{EXPRESS_NAME[track.delivery_id]}: {track.waybill_id}</Text>
        </Flex>
      }
      { loading && <Loading />}
      { !loading && <Track pathList={track.path_item_list || []} /> }
      <Line size='1 50' safe='bottom' />
    </Page>
  )
}

export default ExpressTrack