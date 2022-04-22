import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'

import Card from '@/components/widget/Card'
import Page from '@/components/widget/Page'
import UserItem from '@/components/UserItem'

import { get } from '@/constants/fetch'
import Loading from '@/components/widget/Loading'


function MyUserList() {
  const dispatch = useDispatch()
  const {currentUser} = useSelector((state: ReduxState) => state)
  const [info, setInfo] = useState({
    list: [],
  })

  useEffect(() => {
    get('/zhihehe/sale/saler/user_list', dispatch).then(res => {
      setInfo({
        list: res.data,
      })
    })
  }, [])

  return (
    <Page navTitle='我的用户' padding='20 30'>
      <Card frontTxt='你的用户在以后每次下单时，你都将能得到分成。' afterTxt='如果你的用户也成为了销售，那他将不在是你的用户了。'>
        {
          info.list.length > 0 &&
          info.list.map((item:any, index) => (
            <UserItem noBottom={index === info.list.length - 1 ? true : false} item={item} key={item.id} type='sale_user' />
          ))
        }
      </Card>
      <Loading title='没有更多了' />
    </Page>
  )
}

export default MyUserList