import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Box, Flex, Image, Text, Block } from '@/components/widget/Components'
import Page from '@/components/widget/Page'


import { get } from '@/constants/fetch'



function InviteSale() {
  const dispatch = useDispatch()
  const {styles} = useSelector((state: ReduxState) => state)

  const [codeBase, setCodeBase] = useState('')


  // 获取销售的邀请码
  function getWxCode() {
    get('/common/sale_wxcode', dispatch).then(res => {
      setCodeBase(res.data.imgBase64)
    })
  }


  useEffect(() => {
    getWxCode()
  }, [])



  return (
    <Page navTitle='用户邀请码'>
      <Box padding='0 30'>
        <Flex flex='fccc' size='100% 300' padding='0 50'>
          <Text color={styles.textColor}>你可以直接通过分享商品或让用户扫下面的码，进行分享。用户通过你的分享进入，且首次下单成功后，才能成为你的用户。</Text>
          <Text color={styles.colorRed} fontWeight='bold'>成为你的用户后，他以后每次下单，你都将得到分成。</Text>
        </Flex>
        <Flex flex='fccc' size='100% auto' margin='0 0 50 0' bgColor={styles.colorWhite} padding='50 0' radius='30'>
          <Image src={'data:image/png;base64,' + codeBase} size='500 500' />
        </Flex>
        {/* <Flex padding='0 30' flex='frcc'>
          <Press type='none' openType='share'>
            <ColorButton>
              立即邀请
            </ColorButton>
          </Press>
        </Flex> */}
      </Box>
    </Page>
  )
}

export default InviteSale