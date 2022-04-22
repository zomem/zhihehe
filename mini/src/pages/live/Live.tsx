import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Taro from '@tarojs/taro'
import { Box, Image, Press, Flex, Text, Line } from '@/components/widget/Components'
import Page from '@/components/widget/Page'
import Loading from '@/components/widget/Loading'

import {LIVE_STATUS} from '@/constants/constants'
import {get} from '@/constants/fetch'
import { dateTime } from '@/utils/timeFormat'
import ICON_LIVE_ON from '@/images/icons/live_on.svg'
import ICON_LIVE_WATI from '@/images/icons/live_wait.svg'

export default function Live () {
  const dispatch = useDispatch()
  const {styles} = useSelector((state: ReduxState) => state)

  const [info, setInfo] = useState<any>({
    list: [],
    loading: true
  })

  useEffect(() => {
    get('/common/live/room_list', dispatch).then(res => {
      console.log('lllllll', res)
      setInfo({
        list: res.data.room_info,
        loading: false
      })
    })
  }, [])

  return (
    <Page navTitle='直播列表'>
      <Box padding='25' size='100% auto'>
        {
          info.list.map((item) => (
            <Press 
              key={item.roomid}
              onClick={() => {
                let roomId = [item.roomid]
                // let customParams = encodeURIComponent(JSON.stringify({ 
                //   path: 'pages/article/ArticleDetail',
                //   aid: options.aid,
                //   fuid: options.fuid || currentUser.id
                // }))
                Taro.navigateTo({
                    url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`
                })    
              }}
            >
              <Box 
                size='100% auto'
                radius='35'
                bgColor={styles.boxColor}
                overflow='hidden'
                margin='0 0 25 0'
              >
                <Box position='relative' radius='35 35 0 0'>
                  <Image size='100% 280' src={item.feeds_img} position='relative' />
                  {
                    item.live_status >= 103 ?
                    <Flex size='100% 280' radius='35 35 0 0' flex='frac' bgColor='rgba(25,25,25,0.6)' position='absolute' left='0' bottom='0' backdrop='20'>
                      <Text color='#ffffff' fontSize={styles.textSize}>{LIVE_STATUS[item.live_status]}</Text>
                    </Flex>
                    :
                    <Flex size='140 50' radius='0 25 0 0' flex='frcc' bgColor='rgba(25,25,25,0.6)' position='absolute' left='0' bottom='0' backdrop='20'>
                      <Image size='25 25' src={item.live_status === 101 ? ICON_LIVE_ON : ICON_LIVE_WATI} margin='0 8 0 0'/>
                      <Text color='#ffffff' fontSize={styles.textSizeXXS}>{LIVE_STATUS[item.live_status]}</Text>
                    </Flex>
                  }
                </Box>
                <Flex flex='frbc' padding='25' size='100% auto'>
                  <Text fontSize={styles.textSize} color={styles.textColor}>{item.name}</Text>
                </Flex>
                <Flex flex='frbc' padding='0 25 25 25' size='100% auto'>
                  <Text fontSize={styles.textSize} color={styles.textColor}>房间号: {item.roomid}</Text>
                  <Text fontSize={styles.textSizeXS} color={styles.textColorGray}>{item.anchor_name}</Text>
                </Flex>
                <Flex flex='frsc' padding='0 25 25 25' size='100% auto'>
                  <Flex flex='fcbs' size='50% auto'>
                    <Text fontSize={styles.textSizeXS} color={styles.textColorGray}>开播时间</Text>
                    <Text fontSize={styles.textSizeXS} color={styles.textColorGray}>{dateTime(item.start_time * 1000, 'dateTime')}</Text>
                  </Flex>
                  <Flex flex='fcbs' size='50% auto'>
                    <Text fontSize={styles.textSizeXS} color={styles.textColorGray}>结束时间</Text>
                    <Text fontSize={styles.textSizeXS} color={styles.textColorGray}>{dateTime(item.end_time * 1000, 'dateTime')}</Text>
                  </Flex>
                </Flex>
              </Box>
            </Press>
          ))
        }
        {
          info.loading ?
          <Loading />
          :
          <Loading title='没有更多了' />
        }
      </Box>
      <Line safe='bottom' />
    </Page>
  )
}


