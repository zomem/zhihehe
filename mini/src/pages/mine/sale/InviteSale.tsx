import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Taro, {useShareAppMessage, getCurrentInstance} from '@tarojs/taro'

import { Box, Flex, Image, Press, Text, Block, Line } from '@/components/widget/Components'
import Page from '@/components/widget/Page'
import ColorButton from '@/components/widget/colorButton/colorButton'
import Login from '@/components/widget/Login'

import { CONFIG_DATA, get, post } from '@/constants/fetch'
import onCurrentUser from '@/actions/currentUser'
import { isRole } from '@/utils/authorize'




function InviteSale() {
  const dispatch = useDispatch()
  const {currentUser, styles} = useSelector((state: ReduxState) => state)
  const [info, setInfo] = useState({
    list: [],
  })
  const [codeBase, setCodeBase] = useState('')
  const [isChecking, setIsChecking] = useState(false)

  const [options, setOptions] = useState({
    f_sale_uid: 0,
  })
  const [isOpenLogin, setIsOpenLogin] = useState(false)
  const [fUserInfo, setFUserInfo] = useState({avatar_url: '', nickname: ''})

  const [loading, setLoading] = useState(false)



  // 获取总销售的邀请码
  function getWxCode() {
    get('/common/fsale_wxcode', dispatch).then(res => {
      setCodeBase(res.data.imgBase64)
    })
  }

  
  // 获取销售的信息
  function getFSaleUserInfo (user_id){
    get('/common/user/' + user_id, dispatch).then(res => {
      setFUserInfo(res.data)
    })
  }


  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    let f_sale_uid = parseInt(instance.router?.params.f_sale_uid || '0')
    const scene = instance.router?.params?.scene || 0
    if (scene) {
      const myscene = decodeURIComponent(scene) //scene为场景值
      let listData = myscene.split("&")　　// 截取值
      let tempArr: number[] = []
      for(let i=0; i < listData.length; i++){
        tempArr.push(parseInt(listData[i].substr(listData[i].indexOf("=") + 1)))
      }
      f_sale_uid = tempArr[0] || 0
    }
    if(isRole('salesleader', currentUser.role)){
      setOptions({
        f_sale_uid: currentUser.id
      })
      getFSaleUserInfo(currentUser.id)
      // getWxCode(currentUser.id)
      getWxCode()
    }else{
      setOptions({
        f_sale_uid: f_sale_uid
      })
      getFSaleUserInfo(f_sale_uid)
      // getWxCode(f_sale_uid)
    }
    
    if(f_sale_uid){
      // 说明有fuid
      Taro.setStorageSync('TEMP_FUID', f_sale_uid)
    }

  }, [currentUser.role])



  const joinIn = () => {
    // 用户加入
    post('/zhihehe/sale/join', {
      f_sale_uid: options.f_sale_uid
    }, dispatch).then(res => {
      Taro.showToast({title: res.data.message, icon: 'none'})
      if(res.data.status === 2){
        setIsChecking(true)
      }
      setLoading(false)
    })
  }

  const getCheckStatus = () => {
    get('/zhihehe/sale/join/status', dispatch).then(res => {
      dispatch(onCurrentUser({...currentUser, role: res.data.newRole}))
    })
  }

  useShareAppMessage(res => {
    // 如果没有转发者的id, 则为当前用户id
    let shareUid = options.f_sale_uid
    if (res.from === 'button') {
      return {
        title: currentUser.nickname + '邀请你成为纸禾禾的销售员',
        path: '/pages/mine/sale/InviteSale?f_sale_uid=' + shareUid,
        imageUrl: CONFIG_DATA.FILE_URL + '/default/sale_share.png'
      }
    }
    return {
      title: currentUser.nickname + '邀请你成为纸禾禾的销售员',
      path: '/pages/mine/sale/InviteSale?f_sale_uid=' + shareUid,
      imageUrl: CONFIG_DATA.FILE_URL + '/default/sale_share.png'
    }
  })

  return (
    <Block>
      <Page navTitle='我的销售' >
        {
          isRole('salesleader', currentUser.role) ?
          <Box padding='0 30'>
            <Flex flex='fccc' size='100% 300' padding='0 50'>
              <Text color={styles.textColor}>你已是总销售</Text>
              <Text color={styles.textColor}>邀请其他用户，加入你的团队</Text>
            </Flex>
            <Flex flex='fccc' size='100% auto' margin='0 0 50 0' bgColor={styles.colorWhite} padding='50 0' radius='30'>
              <Image src={'data:image/png;base64,' + codeBase} size='500 500' />
            </Flex>
            <Flex padding='0 30' flex='frcc'>
              <Press openType='share'>
                <ColorButton>
                  立即邀请
                </ColorButton>
              </Press>
            </Flex>
          </Box>
          :
          isRole('salespeople', currentUser.role) ?
          <Box>
            <Flex flex='fccc' size='100% 300' padding='0 50'>
              <Text color={styles.textColor}>你已是销售</Text>
              <Text color={styles.textColor}>邀请其他用户成为销售</Text>
            </Flex>
            <Flex padding='0 30' flex='frcc'>
              <Press openType='share'>
                <ColorButton>
                  邀请他人成为销售
                </ColorButton>
              </Press>
            </Flex>
          </Box>
          :
          isChecking ?
          <Box>
            <Flex flex='fccc' size='100% 300' padding='0 50'>
              <Text color={styles.textColor}>您已申请成为纸禾禾的销售员，请耐心等待审核</Text>
            </Flex>
            <Flex padding='0 30' flex='frcc'>
              <ColorButton
                onClick={() => {
                  // if(!currentUser.id){
                  //   return setIsOpenLogin(true)
                  // }
                  // Taro.showToast({title: '刷新中'})
                  // getCheckStatus()
                  Taro.switchTab({
                    url: '/pages/mine/Mine'
                  })
                }}
              >
                返回
              </ColorButton>
            </Flex>
          </Box>
          :
          <Box>
            <Flex flex='fccc' size='100% 300' padding='0 50'>
              <Text color={styles.textColor}>加入纸禾禾，获取商品销售分成</Text>
            </Flex>
            <Flex padding='0 30' flex='frcc'>
              <ColorButton
                onClick={() => {
                  if(!currentUser.id){
                    return setIsOpenLogin(true)
                  }
                  if(loading){
                    return
                  }
                  setLoading(true)
                  joinIn()
                }}
              >
                立即加入
              </ColorButton>
            </Flex>
          </Box>
        }
      </Page>

      <Login
        type='wechat'
        isOpen={isOpenLogin}
        onCancel={() => setIsOpenLogin(false)}
        onConfirm={() => setIsOpenLogin(false)}
      />
    </Block>
  )
}

export default InviteSale