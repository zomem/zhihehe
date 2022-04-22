import React, {} from 'react'
import {useSelector} from 'react-redux'
import {Flex, Line, Text, Box} from '@/components/widget/Components'



interface AddressItemProps {
  item?: {
    name?: string
    phone?: string
    address?: string
  }
  type?: 'simple' | 'gift'
}

function AddressItem(props: AddressItemProps) {

  const {styles} = useSelector((state: ReduxState) => state)
  const {item={}, type='simple'} = props
  const {name='', phone='', address=''} = item

  return (
    <Box size='100% auto'>
      {
        {
          'simple': (
            <Flex flex='fcbs' size='100% auto' padding='15 25' radius='30' bgColor={styles.boxColor}>
              <Text fontSize='28' fontWeight='bold' color={styles.textColor}>{address}</Text>
              <Line size='1 15' />
              <Flex flex='frsc' size='100% auto'>
                <Text fontSize='28' color={styles.textColorGray}>{name}</Text>
                <Text fontSize='28' margin='0 0 0 45' color={styles.textColorGray}>{phone}</Text>
              </Flex>
            </Flex>
          ),
          'gift': (
            <Flex flex='fcbs' size='100% auto' padding='15' borderColor='#d6a392' radius='30'>
              <Text fontSize='28' fontWeight='bold' color='#060606'>{address}</Text>
              <Line size='1 15' />
              <Flex flex='frsc' size='100% auto' margin='15 0 0 0'>
                <Text fontSize='28' color='#8c8c8c'>{name}</Text>
                <Text fontSize='28' margin='0 0 0 45' color='#8c8c8c'>{phone}</Text>
              </Flex>
            </Flex>
          )
        }[type]
      }
    </Box>
  )
}

export default AddressItem