import React, {useState, useEffect} from "react"
import {useDispatch} from 'react-redux'
import {Input, Tree, Avatar, List, message} from 'antd'
import { UserOutlined, TeamOutlined } from '@ant-design/icons'
import Highlighter from "react-highlight-words"

import {fetchGet, fetchPut} from '@/constants/config'

import LineText from '@/components/widgets/lineText/lineText'

import {SALES_LEADER, SALES_PEOPLE} from '@/constants/constants'

const { Search } = Input


const Authority = () => {
  const dispatch = useDispatch()

  const [searchList, setSearchList] = useState<any>([])
  const [searchKey, setSearchKey] = useState('')
  
  const [tree, setTree] = useState<any>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)


  const [roleTree, setRoleTree] = useState<any>([])
  const [roleCheckedKeys, setRoleCheckedKeys] = useState<React.Key[]>([])

  // 选择的用户信息
  const [selectUser, setSelectUser] = useState<any>({})

  useEffect(() => {
    fetchGet('/management/system/paths/all', dispatch).then(res => {
      setTree(res.data)
    })
    fetchGet('/management/system/role/list', dispatch).then(res => {
      let temp: any = []
      for(let i = 0; i < res.data.length; i++){
        temp.push({
          title: res.data[i].name,
          key: res.data[i].identifier.toString(),
          icon: <TeamOutlined />,
        })
      }
      setRoleTree(temp)
    })
  }, [])



  // 当选择用户变化时, 对应变化权限
  useEffect(() => {
    if(selectUser.id){
      setCheckedKeys(selectUser.authority ? selectUser.authority.split(',') : [])
      setRoleCheckedKeys(selectUser.role ? selectUser.role.split(',') : [])
    }else{
      setCheckedKeys([])
      setRoleCheckedKeys([])
    }
  }, [selectUser.id])


  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheck = (checkedKeysValue:any) => {
    setCheckedKeys(checkedKeysValue)
    // 更新用户权限
    let authority: any = []
    checkedKeysValue.map((item: any) => {
      if(item.includes('/')) authority.push(item)
    })
    if(selectUser.id){
      fetchPut('/management/system/update/user/authority', {
        uid: selectUser.id,
        authority: authority.toString()
      }, dispatch).then(res => {
        searchUsers()
      })
    }
  }

  const onRoleCheck =  (checkedKeysValue:any) => {
    // 更新用户权限
    console.log('check', checkedKeysValue)
    let tempCheck: string[] = []
    if(checkedKeysValue.indexOf(SALES_LEADER) > -1){
      if(checkedKeysValue.indexOf(SALES_PEOPLE) === -1){
        tempCheck = [...checkedKeysValue, SALES_PEOPLE]
      }else{
        tempCheck = [...checkedKeysValue]
      }
    }else{
      tempCheck = [...checkedKeysValue]
    }
    if(selectUser.id){
      fetchPut('/management/system/update/user/role', {
        uid: selectUser.id,
        role: tempCheck.toString()
      }, dispatch).then(res => {
        if(res.data.status === 2){
          setRoleCheckedKeys(tempCheck)
        }else{
          message.error(res.data.message)
        }
        searchUsers()
      })
    }
  }

  function searchUsers () {
    fetchGet('/management/manage/searchUser/' + searchKey, dispatch).then(res => {
      setSearchList(res.data)
    })
  }

  return(
    <div className='frsc'>
      <div className='paths_left_content'>
        <LineText title='用户搜索' />
        <Search 
          placeholder="请输入邮箱、昵称"
          value={searchKey}
          onChange={(e) => {
            if(!e.target.value) {
              setSearchList([])
              setSelectUser({})
            }
            setSearchKey(e.target.value)
          }}
          onSearch={() => {
            if(!searchKey) {
              return
            }
            searchUsers()
          }}
          style={{ width: '100%' }}
        />
        <div style={{marginTop: '15px'}}>
          <List
            split
            itemLayout="horizontal"
            dataSource={searchList}
            renderItem={(item: any) => (
              <div 
                className={selectUser.id === item.id ? 'authority_user_item authority_user_item_select' : 'authority_user_item'}
                onClick={() => {
                  setSelectUser(item)
                }}
              >
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar_url} icon={<UserOutlined />} />}
                    title={
                      <Highlighter
                        highlightClassName="height_light_words"
                        searchWords={[searchKey]}
                        autoEscape={true}
                        textToHighlight={item.nickname || ''}
                      />
                    }
                    description={
                      <Highlighter
                        highlightClassName="height_light_words"
                        searchWords={[searchKey]}
                        autoEscape={true}
                        textToHighlight={item.email || ''}
                      />
                    }
                  />
                </List.Item>
              </div>
            )}
          />
        </div>
      </div>
      <div className='paths_mid_content'>
        <LineText title='管理后台权限' />
        <Tree
          selectable={false}
          checkable
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          treeData={tree}
        />
      </div>
      <div className='paths_mid_right_content'>
        <LineText title='用户所属角色' />
        <Tree
          selectable={false}
          checkable
          showIcon
          onCheck={onRoleCheck}
          checkedKeys={roleCheckedKeys}
          treeData={roleTree}
        />
      </div>
    </div>
  )
}



export default Authority