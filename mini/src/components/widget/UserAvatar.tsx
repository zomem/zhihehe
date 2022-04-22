import React, {} from 'react'
import {useSelector} from 'react-redux'
import {Flex, Image, Text} from '@/components/widget/Components'

interface UserAvatarProps {
  nickname?: string
  avatarUrl?: string
}

function UserAvatar(props: UserAvatarProps) {

  const {nickname, avatarUrl} = props
  const {styles} = useSelector((state: ReduxState) => state)

  return (
    <Flex flex='frsc'>
      <Image size='46 46' radius='23' margin='0 13 0 0' src={avatarUrl || ''} />
      <Text color={styles.textColor} fontSize='28'>{nickname || '匿名'}</Text>
    </Flex>
  )
}

export default UserAvatar