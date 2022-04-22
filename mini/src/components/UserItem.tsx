import React, {} from 'react'
import {useSelector} from 'react-redux'
import {Flex, Image, Text, Block, Line, Press} from '@/components/widget/Components' 

import {dateTime} from '@/utils/timeFormat'

// import ICON_SELECT from '@/images/icons/rec_gou.svg'
// import ICON_SELECT_NOT from '@/images/icons/rec_gou_gray.svg'

interface OItem {
  id?: number
  avatar_url?: string
  nickname?: number
  created_at?: string
  status?: number
}
interface UserItemProps {
  item: OItem
  onClick?: Function
  type?: 'sale' | 'sale_user'
  noBottom?: boolean
}
function UserItem(props: UserItemProps) {
  const {styles} = useSelector((state: ReduxState) => state)
  const {item, type='sale', onClick=() => {}, noBottom=false} = props
  const {
    id, avatar_url, nickname, created_at, status
  } = item

  return (
    <Block>
      {
        {
          'sale': (
            <Press onClick={onClick} hoverBgColor={styles.hoverColor}>
              <Flex size='100% 200' flex='frbc' padding='8 30'>
                <Image size='128 128' src={avatar_url || ''} radius='64' />
                <Flex flex='fcbs' size='480 100%' padding='20 0'>
                  <Text color={styles.textColor}>{nickname}</Text>
                  <Text fontSize='28' color={status === 2 ? '#5ec92c' : '#f59042'} >{status === 2 ? '已通过' : '待审核'}</Text>
                  <Flex flex='frsc' size='100% auto'>
                    <Text fontSize='28' color={styles.textColorGray}>加入时间：{dateTime(created_at, 'dateTime')}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Press>
          ),
          'sale_user': (
            <Press onClick={onClick} hoverBgColor={styles.hoverColor}>
              <Flex size='100% 200' flex='frbc' padding='18 30'>
                <Image size='128 128' src={avatar_url || ''} radius='64' />
                <Flex flex='fcbs' size='480 100%' padding='20 0'>
                  <Text color={styles.textColor}>{nickname}</Text>
                  <Flex flex='frsc' size='100% auto'>
                    <Text fontSize='28' color={styles.textColorGray}>加入时间：{dateTime(created_at, 'dateTime')}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Press>
          )
        }[type]
      }
      {!noBottom && <Line bgColor={styles.lineColor} />}
    </Block>
  )
}

export default UserItem