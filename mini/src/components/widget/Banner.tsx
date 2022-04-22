import React, {useState} from 'react'

import useNavTabInfo from '@/hooks/useNavTabInfo'

import {Box, Flex, Image, Swiper} from '@/components/widget/Components'

import ICON_SWIPER_S from './icons/swiper_s.svg'
import ICON_SWIPER_N from './icons/swiper_n.svg'



interface BannerProps {
  path?: string
  list?: any[]
  type?: 'default'
}

function Banner(props: BannerProps) {

  const {
    list=[], 
    type='default'
  } = props
  const navInfo = useNavTabInfo()

  const [current, setCurrent] = useState(0)

  return(
    <Box position='relative' size='100% 100%'>
      <Swiper
        radius='22'
        childList={
          list.map((item, index) => (
            <Box size='100% 100%' padding='0 10 0 10' radius='22' key={index} overflow='hidden'>
              <Image size='100% 100%' radius='22' src={item} />
            </Box>
          ))
        }
        current={current}
        onChange={(num) => {
          setCurrent(num)
        }}
      />
      <Flex position='absolute' right='54' bottom='28' flex='frsc'>
        {
          list.map((item2, index2) => (
            <Image
              radius='0'
              key={index2 + '1000'} 
              src={current === index2 ? ICON_SWIPER_S : ICON_SWIPER_N}
              size='28 28'
              margin='0 10 0 0'
            />
          ))
        }
      </Flex>
    </Box>
  )
}


export default Banner