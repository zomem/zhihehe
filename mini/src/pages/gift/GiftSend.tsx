import React, {useState, useEffect} from 'react'
import Taro, {getCurrentInstance, useShareAppMessage} from '@tarojs/taro'
import {useDispatch, useSelector} from 'react-redux'
import Page from '@/components/widget/Page'

import {Block, Flex, Image, Text, Line, Button, Box, Press, Input, TextEllipsis} from '@/components/widget/Components'
import { get, post, put } from '@/constants/fetch'


import {EXPRESS_PROVINCE} from '@/constants/constants'
import Login from '@/components/widget/Login'
import AddressItem from '@/components/widget/AddressItem'
import TimerButton from '@/components/TimerButton'
import Modal from '@/components/widget/Modal'
import {isPhone} from '@/utils/veriInfo'

import IMG_GIFT_1 from '@/images/gift/gift1.png'
import IMG_GIFT_2 from '@/images/gift/gift2.png'
import IMG_GIFT_3 from '@/images/gift/gift3.png'
import IMG_PAPER from '@/images/gift/paper.png'
import TIP_GOU from '@/images/icons/tip_success.svg'
import ICON_DELETE from '@/images/delete.png'

const sys = Taro.getSystemInfoSync()
const rtx = 750 / sys.windowWidth
const statusH = sys.statusBarHeight * rtx



  

const StyleButton = {
  size: '282 80',
  radius: '40',
  margin: '15',
  bgImage: 'linear-gradient(to right , #ff8ea3, #ff7258)',
  shadowColor: 'rgba(255, 130, 130, 0.61)',
}
const SaveStyleBtn = {
  size: '182 80',
  radius: '40',
  margin: '15',
  letterSpacing: '0',
  bgImage: 'linear-gradient(to right , #8BC34A, #7CB342)',
  shadowColor: 'rgba(139, 195, 74, 0.61)',
}



function GiftSend() {
  const dispatch = useDispatch()
  const {currentUser, styles} = useSelector((state: ReduxState) => state)

  const [isOpenLogin, setIsOpenLogin] = useState(false)
  const [options, setOptions] = useState({
    gtid: 0,
    gpid: 0,
  })
  const [detail, setDetail] = useState<any>({
    picked_phone: [],
    user_picked: []
  })
  const [addr, setAddr] = useState({
    name: '收件人',
    phone: '',
    address: '请选择收货地址',
    province: '',
    city: '',
    area: '',
    addr: '',
  })
  const [userPhone, setUserPhone] = useState('')  // 用户领取的手机号
  const [code, setCode] = useState('') // 验证码
  const [step, setStep] = useState(-1) // 领取的步骤
  const [gpid, setGpid] = useState(0)
  const [message, setMessage] = useState('') // 用户的留言

  const [isShowModal, setIsShowModal] = useState(false)
  const [addPhone, setAddPhone] = useState('')

  const [isSave, setIsSave] = useState(false)
  const [isNoticed, setIsNoticed] = useState(false)

  const [themeList, setThemeList] = useState<any>([]) // 贺卡列表
  const [themeId, setThemeId] = useState(0)  //贺卡id
  const [showTheme, setShowTheme] = useState(false)

  useEffect(() => {
    const instance = getCurrentInstance()
    const gtid = parseInt(instance.router?.params.gtid || '0')
    const gpid = parseInt(instance.router?.params.gpid || '0')
    setOptions({
      gtid: gtid,
      gpid: gpid,
    })

  }, [])

  useEffect(() => {
    if(options.gtid){
      if(currentUser.id){
        get('/zhihehe/gift/trade/detail/user/' + options.gtid, dispatch).then(res => {
          setDetail(res.data)
          setMessage(res.data.message || res.data.theme_message)
        })
        // 获取贺卡主题
        get('/zhihehe/gift/gift_theme_list', dispatch).then(res => {
          setThemeList(res.data)
        })
      }else{
        get('/zhihehe/gift/trade/detail/' + options.gtid, dispatch).then(res => {
          setDetail(res.data)
          setMessage(res.data.message || res.data.theme_message)
        })
      }
    }
  }, [options.gtid, currentUser.id])

  useEffect(() => {
    if(currentUser.id && options.gtid){
      if(currentUser.id === detail.uid){
        setStep(-1)
      }else{
        if(detail.remain_quantity <= 0){
          setStep(-1)
        }else{
          setStep(1)
        }
        get('/zhihehe/gift/trade/pick_info/' + options.gpid, dispatch).then(res => {
          setGpid(options.gpid)
          if(res.data.gift_trade_status === 8){
            setStep(2)
            if(res.data.phone){
              setAddr({
                name: res.data.name,
                phone: res.data.phone,
                address: res.data.address,
                province: res.data.province,
                city: res.data.city,
                area: res.data.area,
                addr: res.data.addr,
              })
            }
          }
          if(res.data.gift_trade_status === 20){
            setStep(3)
          }
        })
      }
    }
  }, [currentUser.id, detail.uid, options.gpid, detail.remain_quantity])


  // 发送验证码
  const sendSms = () => {
    post('/zhihehe/gift/send_sms', {
      phone: userPhone,
    }, dispatch).then(res => {
      
    })
  }

  // 领取礼物
  const reciveGift = () => {
    post('/zhihehe/gift/recive', {
      gtid: options.gtid,
      verfiyPhone: userPhone,
      code: code
    }, dispatch).then(res => {
      if(res.data.status === 2){
        Taro.showToast({title: res.data.message, icon: 'none'})
        setGpid(res.data.gpid)
        if(res.data.gift_trade_status > 8){
          setStep(3)
        }else{
          setStep(2)
        }
      }else{
        Taro.showToast({title: res.data.message, icon: 'none'})
      }
    })
  }

  // 发货
  const startExpress = () => {
    post('/zhihehe/gift/start/express', {
      ...addr,
      gpid: gpid,
    }, dispatch).then(res => {
      if(res.data.status === 2){
        Taro.showToast({title: res.data.message, icon: 'none'})
        setStep(3)
      }else{
        Taro.showToast({title: res.data.message, icon: 'none'})
      }
    })
  }


  // 更新留言
  const updateMessage = (value) => {
    put('/zhihehe/gift/update_message', {
      id: detail.id,
      message: value
    }, dispatch).then(res => {
      if(res.data.status === 0){
        Taro.showToast({title: res.data.message, icon: 'none'})
      }
    })
  }

  // 添加可领取的手机号
  const addPickPhone = () => {
    if(!isPhone(addPhone)){
      return Taro.showToast({title: '手机号有误', icon: 'none'})
    }
    put('/zhihehe/gift/picked_phone/add', {
      id: detail.id,
      phone: addPhone
    }, dispatch).then(res => {
      if(res.data.status === 2){
        setDetail(prev => ({
          ...prev,
          picked_phone: res.data.pickList,
        }))
        setIsShowModal(false)
        setAddPhone('')
      }
      if(res.data.status === 0){
        Taro.showToast({title: res.data.message, icon: 'none'})
      }
    })
  }
  // 删除可领取手机号
  const delPickPhone = (value) => {
    put('/zhihehe/gift/picked_phone/del', {
      id: detail.id,
      phone: value
    }, dispatch).then(res => {
      if(res.data.status === 2){
        setDetail(prev => ({
          ...prev,
          picked_phone: res.data.pickList,
        }))
      }
      if(res.data.status === 0){
        Taro.showToast({title: res.data.message, icon: 'none'})
      }
    })
  }

  // 更换模板
  const changeTheme = (tid) => {
    put('/zhihehe/gift/gift_theme/change', {
      gtid: detail.id,
      theme_id: tid
    }, dispatch).then(res => {
      setDetail(prev => ({
        ...prev,
        bg_image: res.data.bg_image,
        share_image: res.data.share_image,
        message: res.data.message
      }))
      setMessage(res.data.message)
      setShowTheme(false)
    })
  }


  //更新收礼人的地址信息
  const updateAddress = (addrInfo) => {
    put('/zhihehe/gift/add/address', {
      name: addrInfo.userName,
      phone: addrInfo.telNumber,
      address: addrInfo.provinceName + addrInfo.cityName + addrInfo.countyName + addrInfo.detailInfo,
      province: addrInfo.provinceName,
      city: addrInfo.cityName,
      area: addrInfo.countyName,
      addr: addrInfo.detailInfo,
      gpid: gpid,
    }, dispatch)
  }


  // 发送提醒短信
  const sendSmsNotice = (gt_id) => {
    post('/zhihehe/gift/send/receive_notice', {
      gtid: gt_id
    }, dispatch).then(res => {
      setIsNoticed(true)
      Taro.showToast({title: res.data.message, icon: 'none', duration: 3600})
    })
  }

  useShareAppMessage(res => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: `${currentUser.nickname}送给你了一个【${detail.title}】礼物，快来领取吧！`,
        path: '/pages/gift/GiftSend?gtid=' + options.gtid,
        imageUrl: detail.share_image || ''
      }
    }
    return {
      title: `${currentUser.nickname}送给你了一个【${detail.title}】礼物，快来领取吧！`,
      path: '/pages/gift/GiftSend?gtid=' + options.gtid,
      imageUrl: detail.share_image || ''
    }
  })

  return(
    <Block>
      <Page navTitle='' bgImage={`url('${detail.bg_image}')`}>
        <Image size='245 148' src={IMG_GIFT_1} position='fixed' top={`${320 + statusH}`} left='0' pointerEvents='none' zIndex='20' />
        <Image size='249 440' src={IMG_GIFT_2} position='fixed' top={`${396 + statusH}`} right='0' pointerEvents='none' zIndex='20' />
        <Image size='750 1006' src={IMG_PAPER} position='fixed' top={`${308 + statusH}`} right='0' />
        <Flex flex='frbc' size='200 auto' position='fixed' top={`${396 + statusH}`} right='274' >
          <Flex flex='frcc' bgColor={step >= 1 ? '#d6a392' : '#d6d6d6'} size='42 42' radius='21'><Text fontSize='28' color='#ffffff' >1</Text></Flex>
          <Line size='20 1' bgColor={step >= 2 ? '#d6a392' : '#d6d6d6'} />
          <Flex flex='frcc' bgColor={step >= 2 ? '#d6a392' : '#d6d6d6'} size='42 42' radius='21'><Text fontSize='28' color='#ffffff' >2</Text></Flex>
          <Line size='20 1' bgColor={step >= 3 ? '#d6a392' : '#d6d6d6'} />
          <Flex flex='frcc' bgColor={step >= 3 ? '#d6a392' : '#d6d6d6'} size='42 42' radius='21'><Text fontSize='28' color='#ffffff' >3</Text></Flex>
        </Flex>


        <Box size='600 720' padding='30' position='fixed' top={`${475 + statusH}`} left='72'>
          <Flex flex='frbc' margin='0 0 20 0'>
            <Flex flex='frsc' >
              <Image size='46 46' src={detail.avatar_url || ''} radius='23' />
              <Line size='15 1' />
              <Text fontSize='30' color='#7f7b7b'>{detail.nickname}：</Text>
            </Flex>
            {
              (currentUser.id === detail.uid && detail.remain_quantity > 0) &&
              <Button
                size='140 50'
                letterSpacing='0'
                borderColor='#52901b'
                color='#52901b'
                fontSize='28'
                bgColor='#ffffff'
                radius='25'
                onClick={() => setShowTheme(true)}
              >
                更换模板
              </Button>
            }
          </Flex>
          <Flex flex='frbs' margin='0 0 30 0'>
            <Flex flex='frcc' padding='0 10' borderColor='#ff2e0c' radius='55'><Text fontSize='24' color='#ff2e0c' >祝福</Text></Flex>
            <Box size='445 auto'>
              {
                (currentUser.id === detail.uid && detail.remain_quantity > 0) ?
                <Input 
                  padding='0 20'
                  size='100% 70'
                  radius='40'
                  placeholder='请输入想要对他/她说的话'
                  maxlength='28'
                  value={message}
                  onBlur={(value) => {
                    setMessage(value)
                    updateMessage(value)
                  }}
                />
                :
                <Text fontSize='30' color='#000000'>{detail.message || detail.theme_message}</Text>
              }
            </Box>
          </Flex>
          <Flex flex='frbs' margin='0 0 30 0'>
            <Flex flex='frcc' padding='0 10' borderColor='#2da0dc' radius='55'><Text fontSize='24' color='#2da0dc' >赠礼</Text></Flex>
            <Press onClick={() => {Taro.navigateTo({url: '/pages/article/ArticleDetail?aid=' + detail.article_id})}}>
              <Flex flex='frsc' size='445 86'>
                <Image size='86 86' src={detail.cover_url || ''} radius='16' margin='0 25 0 0' />
                <Flex flex='fcbs' size='334 100%'>
                  <Text fontSize='30' color='#000000'>{detail.title}</Text>
                  <Text fontSize='30' color='#7f7b7b'>{detail.des}</Text>
                </Flex>
              </Flex>
            </Press>
          </Flex>
          <Line size='100% 1' bgColor='#d6a392' />
          <Line size='100% 30' />
          <Flex flex='frbc' >
            <Text fontSize='24' color='#7f7b7b' >可领手机号：</Text>
            <Box size='395 auto' padding='0 0 5 0' overflow='scroll hidden' whiteSpace='nowrap' display='block' >
              {
                detail.picked_phone.length > 0 &&
                detail.picked_phone.map((item, index) => (
                  <Text key={index} fontSize='24' color='#7f7b7b'>{item}{index + 1 === detail.picked_phone.length ? '' : '，'}</Text>
                ))
              }
              {
                currentUser.id === detail.uid && detail.remain_quantity > 0 &&
                <Press onClick={() => setIsShowModal(true)} display='inline-block' >
                  <Text fontSize='24' color='#2da0dc' padding='0 0 0 12'>编辑</Text>
                </Press>
              }
            </Box>
          </Flex>
          {
            currentUser.id === detail.uid &&
            <Flex flex='frbc' >
              <Text fontSize='24' color='#7f7b7b' >已领手机号：</Text>
              <Box size='395 auto' padding='0 0 5 0' overflow='scroll hidden' whiteSpace='nowrap' display='block' >
                {
                  detail.user_picked.length === 0 && <Text fontSize='24' color='#7f7b7b'>暂无</Text>
                }
                {
                  detail.user_picked.length > 0 &&
                  detail.user_picked.map((item, index) => (
                    <Text key={index} fontSize='24' color='#7f7b7b'>{item}({detail.user_picked_status[index]}){index + 1 === detail.user_picked.length ? '' : '，'}</Text>
                  ))
                }
              </Box>
            </Flex>
          }

          {
            !currentUser.id &&
            <Flex size='100% auto' flex='frcc' margin='30 0 30 0'>
              <Button
                {...StyleButton}
                onClick={() => {
                  setIsOpenLogin(true)
                }}
              >
                登录
              </Button>
            </Flex>
          }

          {/* 送礼者和收礼者情况 */}
          {
            currentUser.id === detail.uid ?
            <Box margin='30 0 30 0'>
              {
                detail.remain_quantity > 0 ?
                <Flex size='100% auto' flex='fcbc'>
                  <Flex size='100% auto' flex='frbc'>
                    <Button onClick={() => setIsSave(true)} disable={isSave} {...SaveStyleBtn}>{isSave ? '已存入礼盒' : '存入礼盒'}</Button>
                    <Press openType='share'>
                      <Button {...StyleButton}>立即送礼</Button>
                    </Press>
                  </Flex>
                  <Line size='1 30' />
                  <Flex size='100% auto' flex='frec' padding='0 20 0 0'>
                    <Button
                      size='150 50'
                      letterSpacing='0'
                      borderColor='#52901b'
                      color='#52901b'
                      fontSize='28'
                      bgColor='#ffffff'
                      radius='25'
                      disable={isNoticed}
                      onClick={() => {
                        Taro.showModal({
                          title: `短信提醒收礼说明`,
                          content: `您将使用平台短信系统，提醒未领取礼品的用户收取礼品，内容为“【纸禾禾】尊敬的用户，“${currentUser.nickname}”发送给您的“${detail.title}”尚未确定领取，请尽快在微信小程序中完善信息！祝您生活愉快，万事如意！”。请确认该礼品已由微信小程序转发给了对应的收礼人，并确认对方电话号码是否正确。`,
                          success: (res) => {
                            if(res.confirm){
                              sendSmsNotice(detail.id)
                            }
                          }
                        })
                      }}
                    >
                      提醒收礼
                    </Button>
                  </Flex>
                </Flex>
                :
                <Box size='100% auto'>
                  <Flex size='100% auto' flex='frcc' margin='28 0 28 0' padding='0 20 0 0'>
                    <Image size='46 46' src={TIP_GOU} margin='0 18 0 0' />
                    <Text fontSize='30' color='#000000'>礼物已领取完</Text>
                  </Flex>
                  <Flex size='100% auto' flex='frcc' margin='0 0 28 0'>
                    <Text fontSize='28' color='#999999'>你一共送出{detail.quantity}件礼物，已全部领取完啦</Text>
                  </Flex>
                </Box>
              }
            </Box>
            :
            (detail.remain_quantity <= 0 && step < 1) ?
            <Box margin='30 0 30 0'>
              <Box size='100% auto'>
                <Flex size='100% auto' flex='frcc' margin='28 0 28 0' padding='0 20 0 0'>
                  <Image size='46 46' src={TIP_GOU} margin='0 18 0 0' />
                  <Text fontSize='30' color='#000000'>礼物已领取完</Text>
                </Flex>
                <Flex size='100% auto' flex='frcc' margin='0 0 28 0'>
                  <Text fontSize='28' color='#999999'>共送出{detail.quantity}件礼物，已全部领取完啦</Text>
                </Flex>
                {
                  currentUser.id &&
                  <Flex size='100% auto' flex='frcc'>
                    <Button
                      {...StyleButton}
                      onClick={() => {
                        Taro.navigateTo({url: '/pages/mine/gift/GiftRecive'})
                      }}
                    >
                      我的礼物
                    </Button>
                  </Flex>
                }
              </Box>
            </Box>
            :
            <Box>
              {
                {
                  1: (
                    <Box margin='12 0 0 0'>
                      <Input
                        type='number'
                        size='100% 70'
                        bgColor='#ffffff'
                        placeholder='请输入领取手机号'
                        value={userPhone}
                        onInput={(value) => setUserPhone(value)}
                      />
                      <Flex flex='frbc'>
                        <Input
                          type='number'
                          size='280 70'
                          bgColor='#ffffff'
                          placeholder='请输入验证码'
                          value={code}
                          onInput={(value) => setCode(value)}
                        />
                        {
                          currentUser.id ?
                          <TimerButton
                            size='220 70'
                            radius='35'
                            bgImage='linear-gradient(to right , #37b7e0, #349dff)'
                            disable={!isPhone(userPhone)}
                            onClick={() => {
                              sendSms()
                            }}
                          />
                          :
                          <Button
                            size='220 70'
                            radius='35'
                            letterSpacing='normal'
                            onClick={() => {
                              setIsOpenLogin(true)
                            }}
                          >
                            发送验证码
                          </Button>
                        }
                      </Flex>
                      <Line size='1 28' />
                      <Line size='100% 1' bgColor='#d6a392' />
                      <Line size='1 28' />
                      
                      <Flex size='100% auto' flex='frcc'>
                        <Button
                          {...StyleButton}
                          onClick={() => {
                            if(!currentUser.id){
                              return setIsOpenLogin(true)
                            }
                            if(!userPhone) {
                              return Taro.showToast({title: '手机号不能为空', icon: 'none'})
                            }
                            if(!code) {
                              return Taro.showToast({title: '验证码不能为空', icon: 'none'})
                            }
                            reciveGift()
                          }}
                        >
                          领取礼物
                        </Button>
                      </Flex>
                    </Box>
                  ),
                  2: (
                    <Box size='100% auto'>
                      <Press
                        onClick={async () => {
                          let addrInfo = await Taro.chooseAddress()
                          setAddr({
                            name: addrInfo.userName,
                            phone: addrInfo.telNumber,
                            address: addrInfo.provinceName + addrInfo.cityName + addrInfo.countyName + addrInfo.detailInfo,
                            province: addrInfo.provinceName,
                            city: addrInfo.cityName,
                            area: addrInfo.countyName,
                            addr: addrInfo.detailInfo,
                          })
                          updateAddress(addrInfo)
                        }}
                      >
                        <Flex flex='fccc' size='100% auto' margin='20 0'>
                          <AddressItem item={addr} type='gift' />
                        </Flex>
                      </Press>
                      <Flex size='100% auto' flex='frbc'>
                        <Button onClick={() => setIsSave(true)} disable={isSave} {...SaveStyleBtn}>{isSave ? '已存入礼盒' : '存入礼盒'}</Button>
                        <Button
                          {...StyleButton}
                          onClick={() => {
                            if(!currentUser.id){
                              return setIsOpenLogin(true)
                            }
                            if(!addr.phone){
                              return Taro.showToast({title: '请选择收货信息', icon: 'none'})
                            }
                            startExpress()
                          }}
                        >
                          确认发货
                        </Button>
                      </Flex>
                    </Box>
                  ),
                  3: (
                    <Box size='100% auto'>
                      <Flex size='100% auto' flex='frcc' margin='28 0 28 0' padding='0 20 0 0'>
                        <Image size='46 46' src={TIP_GOU} margin='0 18 0 0' />
                        <Text fontSize='30' color='#000000'>恭喜您，礼物已领取</Text>
                      </Flex>
                      <Flex size='100% auto' flex='frcc' margin='0 0 28 0'>
                        <Text fontSize='28' color='#999999'>礼物正在配送中，请耐心等待</Text>
                      </Flex>
                      <Flex size='100% auto' flex='frcc'>
                        <Button
                          {...StyleButton}
                          onClick={() => {
                            Taro.navigateTo({url: '/pages/mine/gift/GiftRecive'})
                          }}
                        >
                          查看详情
                        </Button>
                      </Flex>
                    </Box>
                  )
                }[step]
              }
            </Box>
          }
        </Box>

        <Image size='750 243' src={IMG_GIFT_3} pointerEvents='none' position='fixed' bottom='0' right='0' zIndex='20' />
      </Page>

      <Login
        type='wechat'
        isOpen={isOpenLogin}
        onCancel={() => setIsOpenLogin(false)}
        onConfirm={() => setIsOpenLogin(false)}
      />

      <Modal
        title='删除/添加可领取手机号'
        isShow={isShowModal}
        confirmTxt='添加'
        onCancel={() => setIsShowModal(false)}
        onConfirm={() => {
          addPickPhone()
        }}
      >
        <Box size='100% auto' padding='25'>
          <Box size='100% 300' overflow='scroll'>
            {
              detail.picked_phone.length > 0 &&
              detail.picked_phone.map((item, index) => (
                <Flex flex='frbc' size='100% 90'>
                  <Text fontSize='34' color={styles.textColor}>{item}</Text>
                  <Press
                    onClick={() => {
                      Taro.showModal({
                        title: '提示',
                        content: `确定删除 ${item} 手机号吗？`,
                        success: (res) => {
                          if(res.confirm){  
                            delPickPhone(item)
                          }
                        }
                      })
                    }}
                  >
                    <Image src={ICON_DELETE} size='42 42' />
                  </Press>
                </Flex>
              ))
            }
          </Box>
          <Input
            type='number'
            radius='15'
            color={styles.textColor}
            bgColor={styles.boxColorGray}
            padding='0 25'
            placeholder='请输入要添加的手机号'
            value={addPhone}
            onInput={(value) => {
              setAddPhone(value)
            }}
          />
        </Box>
      </Modal>

      <Modal
        title='更换模板'
        isShow={showTheme}
        onCancel={() => setShowTheme(false)}
        onConfirm={() => {
          if(!themeId) {
            return Taro.showToast({title: '请选择模板', icon: 'none'})
          }
          changeTheme(themeId)
        }}
      >
        <Box size='100% 600' flexWrap='wrap' display='flex' padding='20 20' overflow='scroll'>
          {
            themeList.length > 0 &&
            themeList.map((item, index) => (
              <Press 
                key={item.id}
                onClick={() => {
                  setThemeId(item.id)
                }}
              >
                <Box 
                  size='216 300'
                  margin={(index + 1) % 2 === 0 ? '0 0 50 0' : '0 50 50 0'}
                  shadowColor={themeId === item.id ? styles.colorOrange : styles.lineColor}
                  radius='12'
                  overflow='hidden'
                >
                  <Image size='216 216' src={item.share_image_url} />
                  <Box size='100% auto' padding='5 10'>
                    <Line size='100% 10' />
                    <TextEllipsis line='2' fontSize='28' color={themeId === item.id ? styles.colorOrange : styles.textColor}>{item.title}</TextEllipsis>
                  </Box>
                </Box>
              </Press>
            ))
          }
        </Box>
      </Modal>
    </Block>
  )
}

export default GiftSend