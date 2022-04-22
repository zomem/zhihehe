import React, {} from 'react'
import {useSelector} from 'react-redux'
import {Box, Block, Flex, Image, Text, Line} from '@/components/widget/Components'

import TRACK_LJ from '@/components/widget/icons/track_lj.svg'
import TRACK_PS from '@/components/widget/icons/track_ps.svg'
import TRACK_QS from '@/components/widget/icons/track_qs.svg'
import TRACK_WC from '@/components/widget/icons/track_wc.svg'
import TRACK_YS from '@/components/widget/icons/track_ys.svg'

import {dateTime} from '@/utils/timeFormat'


// 轨迹节点类型
const EXPRESS_ACTION = {
  100001:	{
    name: '揽件中',
    des: '【揽件成功】',
    icon: TRACK_LJ
  },
  100002:	{
    name: '揽件中',
    des: '【揽件失败】',
    icon: TRACK_LJ
  },
  100003:	{
    name: '揽件中',
    des: '【分配业务员】',
    icon: TRACK_LJ
  },
  200001:	{
    name: '运输中',
    des: '',
    icon: TRACK_YS
  },
  300001:	{
    name: '派送中',
    des: '【开始派送】',
    icon: TRACK_PS
  },
  300002:	{
    name: '派送中',
    des: '【开始派送】',
    icon: TRACK_PS
  },
  300003:	{
    name: '派送中',
    des: '【签收成功】',
    icon: TRACK_PS
  },
  300004:	{
    name: '派送中',
    des: '【签收失败】',
    icon: TRACK_PS
  },
  400001:	{
    name: '异常',
    des: '【订单取消】',
    icon: null
  },
  400002:	{
    name: '异常',
    des: '【订单滞留】',
    icon: null
  }
}



interface Track {
  pathList: any[]
}

// "path_item_list": [
//   {
//     "action_time": 1533052800,
//     "action_type": 100001,
//     "action_msg": "快递员已成功取件"
//   },
//   {
//     "action_time": 1533062800,
//     "action_type": 200001,
//     "action_msg": "快件已到达xxx集散中心，准备发往xxx"
//   },
//   {
//     "action_time": 1533072800,
//     "action_type": 300001,
//     "action_msg": "快递员已出发，联系电话xxxxxx"
//   }
// ]


function Track(props: Track) {

  const {pathList=[]} = props
  const {styles} = useSelector((state: ReduxState) => state)

  return (
    <Box size='100% auto' bgColor={styles.boxColor} padding='20 30'>
      {
        pathList.length > 0 ? 
        <Block>
          {
            pathList.map((item, index) => (
              <Flex flex='frss' size='100% auto' margin='0 0 25 0'>
                <Box size='60 60'>
                  {
                    EXPRESS_ACTION[item.action_type].icon &&
                    <Flex flex='frcc' size='56 56' radius='30' bgColor={pathList.length - 1 === index ? styles.colorOrange : styles.boxColorGray}>
                      <Image src={EXPRESS_ACTION[item.action_type].icon} size='42 42' />
                    </Flex>
                  }
                </Box>
                <Line size='25 1' />
                <Flex flex='fcss' >
                  {
                    EXPRESS_ACTION[item.action_type].name &&
                    <Text fontSize='34' color={pathList.length - 1 === index ? styles.colorOrange : styles.textColorGray}>{EXPRESS_ACTION[item.action_type].name}</Text>
                  }
                  <Box padding='10 15' bgColor={styles.boxColor} radius='12' margin='15 0 10 0'>
                    <Text fontSize='30' color={pathList.length - 1 === index ? styles.colorOrange : styles.textColorGray}>{EXPRESS_ACTION[item.action_type].des}{item.action_msg}</Text>
                  </Box>
                  <Text fontSize='28' color={pathList.length - 1 === index ? styles.colorOrange : styles.textColorGray}>{dateTime(item.action_time * 1000, 'dateTime')}</Text>
                </Flex>
              </Flex>
            ))
          }
        </Block>
        :
        <Flex flex='frss' size='100% auto'>
          <Box size='60 60'>
            <Flex flex='frcc' size='60 60' radius='30' bgColor={styles.colorOrange}>
              <Image src={TRACK_LJ} size='42 42' />
            </Flex>
          </Box>
          <Line size='25 1' />
          <Flex flex='fcss' >
            <Text fontSize='34' color={styles.textColor}>待揽收</Text>
            <Box padding='10 15' bgColor={styles.boxColorGray} radius='12' margin='15 0 10 0'>
              <Text fontSize='30' color={styles.textColorGray}>快递已下单，等待快递员揽收</Text>
            </Box>
            <Text fontSize='28' color={styles.textColorGray}>{dateTime(new Date().getTime(), 'dateTime')}</Text>
          </Flex>
        </Flex>
      }
      
    </Box>
  )
}

export default Track