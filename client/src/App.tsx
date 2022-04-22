import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN';

import onCurrentUser from '@/actions/currentUser'
import {CONFIG_DATA, fetchGet} from '@/constants/config'

import Home from '@/pages/home/home'
import Mine from '@/pages/mine/mine'
import Login from '@/components/widgets/login/login'
import Management from '@/pages/management/management'

import './App.css'

import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

function App() {
  const dispatch = useDispatch()
  const {currentUser} = useSelector((state: IRootStore) => state)
  const [isOpenLogin, setIsOpenLogin] = useState(false)

  useEffect(() => {
    // 在入口文件这里，优先获取用户信息
    async function webSilent() {
      const initUser = {
        id: '',
        nickname: '',
        avatar_url: '',
        gender: '',
        phone: '',
        openid: '',
        session_key: '',
        language: '',
        city: '',
        province: '',
        country: '',
        email: '',
        unionid: '',
        token: '',
        remember: false,
        authority: ''
      }

      
      let token = localStorage.getItem(CONFIG_DATA.ZM_LOGIN_TOKEN)
      let remember = localStorage.getItem(CONFIG_DATA.ZM_LOGIN_REMEMBER)
      if(token){
        let userInfo = (await fetchGet('/login/web_silent/' + token)).data
        userInfo.remember = remember === '1' ? true : false
        dispatch(onCurrentUser(userInfo.id ? userInfo : initUser))
      }else{
        initUser.remember = remember === '1' ? true : false
        dispatch(onCurrentUser(initUser))
      }
    }
    webSilent()
  }, [])

  useEffect(() => {
    if(!currentUser.id){
      setIsOpenLogin(true)
    }
  }, [currentUser.id])

  return (
    <ConfigProvider locale={zhCN}>      
      <Router>
        <Switch>
          <Route path="/mine">
            <Mine />
          </Route>
          <Route path="/zhihehe/management">
            <Management />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <Login 
          isOpen={isOpenLogin}
          onCancel={() => setIsOpenLogin(false)}
          onConfirm={() => setIsOpenLogin(false)}
        />
      </Router>
    </ConfigProvider>
  );
}

export default App;
