import React from 'react'
import Taro from '@tarojs/taro'
import {useSelector} from 'react-redux'
import Page from '@/components/widget/Page'
import ColorButton from '@/components/widget/colorButton/colorButton'
import {Block, Flex, Image, Text, Line} from '@/components/widget/Components'


import ICON_SUCCESS from '@/images/icons/tip_success.svg'

function Complete() {

  const {styles} = useSelector((state: ReduxState) => state)

  const makeSure = () => {
    Taro.switchTab({url: '/pages/index/Index'})
  }

  return(
    <Page navTitle='支付结果'>
      <Flex flex='fccc' margin='200 0 0 0' size='100% auto'>
        <Image size='190 190' src={ICON_SUCCESS} />
        <Line size='0 50' />
        <Text fontSize='34' color={styles.textColor}>支付成功</Text>
        <Line size='0 70' />
        <ColorButton size='300 90' onClick={makeSure}>
          完成
        </ColorButton>
      </Flex>
    </Page>
  )
}

export default Complete