import React, {} from 'react'
import Taro from '@tarojs/taro'
import {useSelector} from 'react-redux'
import {Box, Block, Flex, Image, Press} from '@/components/widget/Components'

import ICON_STAR2 from '@/components/widget/icons/star2.svg'
import ICON_STAR0 from '@/components/widget/icons/star0.svg'
import ICON_EM1 from '@/components/widget/icons/em1.svg'
import ICON_EM2 from '@/components/widget/icons/em2.svg'
import ICON_EM3 from '@/components/widget/icons/em3.svg'
import ICON_EM4 from '@/components/widget/icons/em4.svg'
import ICON_EM5 from '@/components/widget/icons/em5.svg'

interface StarTapProps {
  onChange?: Function
  score?: number
  type?: 'star' | 'show' | 'show_mini'
}

export default function (props: StarTapProps) {
  const {styles} = useSelector((state: ReduxState) => state)
  const {onChange=() => {}, score=1, type='star'} = props

  const star_num = [1, 2, 3, 4, 5]
  const emObj = {
    1: ICON_EM1,
    2: ICON_EM2,
    3: ICON_EM3,
    4: ICON_EM4,
    5: ICON_EM5,
  }


  return (
    <Block>
      {
        {
          'star': (
            <Flex size='100% 84' flex='frbc'>
              <Flex flex='frsc'>
                {
                  star_num.map((item) => (
                    <Press 
                      key={item}
                      onClick={() => {
                        onChange(item)
                      }}
                    >
                      <Image size='52 52' margin='0 10 0 0' src={score >= item ? ICON_STAR2 : ICON_STAR0} />
                    </Press>
                  ))
                }
              </Flex>
              {
                score > 0 &&
                <Image size='64 64' src={emObj[score]} />
              }
            </Flex>
          ),
          'show': (
            <Flex flex='frsc'>
              {
                star_num.map((item) => (
                  <Image key={item} size='36 36' margin='0 8 0 0' src={score >= item ? ICON_STAR2 : ICON_STAR0} />
                ))
              }
            </Flex>
          ),
          'show_mini': (
            <Flex flex='frsc'>
              {
                star_num.map((item) => (
                  <Image key={item} size='24 24' margin='0 6 0 0' src={score >= item ? ICON_STAR2 : ICON_STAR0} />
                ))
              }
            </Flex>
          )
        }[type]
      }
    </Block>

  )
}