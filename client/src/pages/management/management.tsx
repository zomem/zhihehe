import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { Button, Layout, Menu } from 'antd'

import ExcIcons from "@/components/widgets/iconsList/excIcons"
import NotFound from './paths/notFound'
import getPaths from './utils/getPaths'
import onCurrentUser from '@/actions/currentUser'

import './management.css'
import { fetchGet } from '@/constants/config'

import LOGO from '../../images/logo.png'


const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const notFound = <NotFound />



// ，用户信息清空
const initUserInfo = (dispatch: any) => {
  const initUser = {
    id: '',
    nickname: '',
    avatar_url: '',
    gender: '',
    phone: '',
    openid: '',
    session_key: '',
    token: '',
    unionid: '',
    remember: false,
    authority: '',
  }
  dispatch(onCurrentUser(initUser))
}



const Management = () => {
  const dispatch = useDispatch()
  const {currentUser} = useSelector((state:IRootStore) => state)

  const [path, setPath] = useState('')

  const [menu, setMenu] = useState<any>([])  //用户对应的权限模块

  useEffect(() => {
    if(currentUser.id && currentUser.authority && currentUser.openid){
      fetchGet('/management/manage/menu/list', dispatch).then(res => {
        setMenu(res.data)
      })
    }
    if(currentUser.id && !currentUser.openid){
      fetchGet('/management/commonConfig/add/openid', dispatch)
    }
  }, [currentUser.id])

  return (
    <Layout>
      <Header className="header frbc">
        <div className='frsc'>
          {/* <img src={LOGO} className='logo' /> */}
          <div className='management_logo_name'>管理后台</div>
        </div>
        <div className='frec'>
          <div className='management_logo_name' style={{marginRight: '8px'}}>{currentUser.email}</div>
          {
            currentUser.id &&
            <a
              onClick={() => {
                initUserInfo(dispatch)
              }}
            >
              退出
            </a>
          }
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="management_sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={[]}
            defaultOpenKeys={[]}
            style={{ height: '100%'}}
            onSelect={(info) => {
              setPath(info.key)
            }}
          >
            {
              menu.map((item: any) => (
                <SubMenu key={item.path} icon={<ExcIcons name={item.icon_name} />} title={item.name}>
                  {
                    item.sub_list.map((item2: any) => (
                      <Menu.Item key={item2.sub_path}>{item2.sub_name}</Menu.Item>
                    ))
                  }
                </SubMenu>
              ))
            }
          </Menu>
        </Sider>
        <Layout>
          <Content 
            className="management_content"
          >
            {getPaths(currentUser.authority.split(','))[path] || notFound}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default Management



