import React from 'react'
import {Flex, Text} from '@/components/widget/Components'

interface TagProps {
  color?: string
  title?: string
}

export default (props: TagProps) => (
  <Flex flex='frcc' borderColor={props.color} padding='3 8' radius='10'>
    <Text color={props.color} fontSize='20'>{props.title}</Text>
  </Flex>
)