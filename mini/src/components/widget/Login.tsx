import React, {useState, useMemo, useEffect} from 'react'
import Taro from '@tarojs/taro'
import {useDispatch, useSelector} from 'react-redux'
import onCurrentUser from '@/actions/currentUser'
import {Box, Flex, Text, Image, Block, Line, Press, Button} from '@/components/widget/Components'
import Modal from '@/components/widget/Modal'
import Loading from '@/components/widget/Loading'

import {post} from '@/constants/fetch'


import ICON_STEP1_N from '@/images/icons/step1_n.svg'
import ICON_STEP1_Y from '@/images/icons/step1_y.svg'
import ICON_STEP2_N from '@/images/icons/step2_n.svg'
import ICON_STEP2_Y from '@/images/icons/step2_y.svg'


interface LoginProps {
  isOpen?: boolean
  type?: 'wechat' | 'wechat_phone' 
  onCancel?: () => void
  onConfirm?: () => void
}

interface ModalType {
  name: 'login' | 'get_phone'
  isHavePhone: boolean
  isHaveUser: boolean
}

function Login(props: LoginProps) {

  const {isOpen, onCancel=()=>{}, onConfirm=()=>{}, type='wechat_phone'} = props
  const dispatch = useDispatch()
  const {currentUser, styles} = useSelector((state: ReduxState) => state)

  const [isLoading, setIsLoading] = useState(false)

  //当前登录到哪一步
  const modalType = useMemo<ModalType>(() => {
    
    if(type === 'wechat_phone'){
      if(currentUser.phone && currentUser.id){
        return {
          name: 'login',
          isHavePhone: true,
          isHaveUser: true
        }
      }else if(currentUser.phone){
        return {
          name: 'login',
          isHavePhone: true,
          isHaveUser: false
        }
      }else if(currentUser.id){
        return {
          name: 'get_phone',
          isHavePhone: false,
          isHaveUser: true
        }
      }else{
        return {
          name: 'login',
          isHavePhone: false,
          isHaveUser: false
        }
      }
    }else{
      if(currentUser.id){
        return {
          name: 'login',
          isHavePhone: true,
          isHaveUser: true
        }
      }else{
        return {
          name: 'login',
          isHavePhone: false,
          isHaveUser: false
        }
      }
    }
  }, [currentUser, type])

  // 如果要提前获取code，则每次打开就要获取。
  // useEffect(() => {
  //   if(isOpen){
  //     wx.login({
  //       success: res => setUserCode(res.code)
  //     })
  //   }
  // }, [isOpen])
  

  // 微信登录处理
  const onLoginWechat = async (code, userInfo) => {
    // 将用户信息存到缓存
    let url = '/login/wechat'
    let params = {
      code : code,
      userInfo : userInfo,
    }
    // 传入后台登录
    let res = await post(url, params)
    return res
  }

  //绑定手机
  const onSetPhone = async (param) => {
    let url = '/login/wechat_phone'
    // 传入后台登录
    let res = await post(url, param)
    return res
  }




  //获取session_key
  useEffect(() => {
    if(currentUser.id && !currentUser.phone){
      Taro.checkSession({
        success: () => {
          if(!currentUser.session_key){
            Taro.login().then(async resLogin => {
              let url = '/login/wechat_session_key'
              let params = {
                code : resLogin.code,
              }
              let keyInfo = (await post(url, params)).data
              dispatch(onCurrentUser({openid: keyInfo.openid, session_key: keyInfo.session_key}))
            })
          }
        },
        fail: () => {
          Taro.login().then(async resLogin => {
            let url = '/login/wechat_session_key'
            let params = {
              code : resLogin.code,
            }
            let keyInfo = (await post(url, params)).data
            dispatch(onCurrentUser({openid: keyInfo.openid, session_key: keyInfo.session_key}))
          })
        }
      })
    }
  }, [currentUser.id, currentUser.phone, currentUser.session_key, dispatch])





  // 取消
  const cancel = () => {
    if(isLoading) return
    onCancel()
  }

  // 登录
  const login = async (e) => {
    if(isLoading) return
    setIsLoading(true)
    if(modalType.name === 'login'){
      Taro.getUserProfile({
        desc: '用于完善会员资料',
        fail: (err) => {
          setIsLoading(false)
        },
        success: (userRes) => {
          Taro.login().then(async res => {
            let tempUser = await onLoginWechat(res.code, userRes.userInfo)
            if(tempUser.data.id){
              if(!tempUser.data){
                tempUser.data = {}
              }
              dispatch(onCurrentUser(tempUser.data))
            }
            setIsLoading(false)
            if(type === 'wechat_phone'){
              if(tempUser.data.phone) {
                onConfirm()
              }
            }else{
              onConfirm()
            }
          }, err => setIsLoading(false))
        }
      })

    }
    if(modalType.name === 'get_phone'){
      if(!e.detail.iv || !e.detail.encryptedData){
        setIsLoading(false)
        return
      }
      if(currentUser.openid && currentUser.session_key){
        let tempPhone = await onSetPhone({
          unionid : currentUser.unionid,
          openid : currentUser.openid,
          sessionKey : currentUser.session_key,
          iv : e.detail.iv,
          encryptedData : e.detail.encryptedData
        })

        if(tempPhone.data.id){
          dispatch(onCurrentUser(tempPhone.data))
        }
        setIsLoading(false)
        onConfirm()
      }
    }
  }



  return(
    <Modal 
      isShow={isOpen}
      isHaveCancel={false}
      isHaveConfirm={false}
      title='登录注册'
      onCancel={cancel}
    >
      <Flex size='100% auto' flex={type === 'wechat_phone' ? 'frbc' : 'frcc'} >
        <Flex size='200 120' flex='fcbc'>
          <Image src={modalType.isHaveUser ? ICON_STEP1_Y : ICON_STEP1_N} size='56 56' />
          <Text color={modalType.isHaveUser ? styles.colorGreen : styles.textColorGray}>微信授权</Text>
        </Flex>
        {
          type === 'wechat_phone' && 
          <Block>
            <Line size='42 4' bgColor={styles.colorGreen} />
            <Flex size='200 120' flex='fcbc'>
              <Image src={modalType.isHavePhone ? ICON_STEP2_Y : ICON_STEP2_N} size='56 56' />
              <Text color={modalType.isHavePhone ? styles.colorGreen : styles.textColorGray}>绑定手机号</Text>
            </Flex>
          </Block>
        }
      </Flex>
      <Flex size='100% auto' margin='50 0 0 0' flex='frac'>
        <Button letterSpacing='normal' onClick={cancel} size='180 80' radius='40' bgColor={styles.boxColorGray}>取消</Button>
        {
          modalType.name === 'get_phone' ?
          <Press onGetPhoneNumber={(e) => {login(e)}} openType='getPhoneNumber'>
            <Button letterSpacing='normal' size='260 80' radius='40' bgColor={styles.colorGreen} loading={isLoading}>绑定手机号</Button>
          </Press>
          :
          <Press onClick={login}>
            <Button letterSpacing='normal' size='260 80' radius='40' bgColor={styles.colorGreen} loading={isLoading}>微信授权</Button>
          </Press>
        }
      </Flex>
    </Modal>
  )
}

export default Login