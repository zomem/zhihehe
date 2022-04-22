import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'

import {Button, Drawer, Table, Form, Input, message, InputNumber, Popconfirm} from 'antd'
import {fetchGet, fetchPost, CONFIG_DATA, fetchPut} from '@/constants/config'



import '../paths.css'


function Role() {

  const dispatch = useDispatch()
  const [showDrawer, setShowDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(1)
  const [infos, setInfos] = useState({
    list: []
  })

  const [selectId, setSelectId] = useState('')
  
  const [form] = Form.useForm()


  useEffect(() => {
    fetchGet('/management/system/role/list', dispatch).then(res => {
      setInfos({
        list: res.data
      })
    })
  }, [refresh])


  const onShowDrawer = () => {
    setShowDrawer(true)
  }
  const onCloseDrawer = () => {
    setShowDrawer(false)
    setSelectId('')
  }

  
  const clearInput = () => {
    form.setFieldsValue({
      name: '',
      identifier: null,
      api_paths: ''
    })
  }


  const onFinish = (values: any) => {
    setLoading(true)
    if(selectId){
      fetchPut('/management/system/role/update', {
        id: selectId,
        name: values.name,
        identifier: values.identifier,
        api_paths: values.api_paths ? values.api_paths.replace(/\n/g, ',') : ''
      }, dispatch).then(res => {
        if(res.data.status === 2){
          message.success(res.data.message)
          onCloseDrawer()
          setRefresh(prev => prev + 1)
          clearInput()
        }else{
          message.error(res.data.message || '操作失败')
        }
        setLoading(false)
      })
    }else{
      fetchPost('/management/system/role/add', {
        name: values.name,
        identifier: values.identifier,
        api_paths: values.api_paths ? values.api_paths.replace(/\n/g, ',') : ''
      }, dispatch).then(res => {
        if(res.data.status === 2){
          message.success(res.data.message)
          onCloseDrawer()
          setRefresh(prev => prev + 1)
          clearInput()
        }else{
          message.error(res.data.message || '操作失败')
        }
        setLoading(false)
      })
    }
    
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }


  useEffect(() => {
    if(selectId){
      fetchGet('/management/system/role/info/' + selectId, dispatch).then(res => {
        form.setFieldsValue({
          name: res.data.name,
          identifier: res.data.identifier,
          api_paths: res.data.api_paths ? res.data.api_paths.replace(/,/g, '\n') : ''
        })
      })
    }
  }, [selectId])


  const columns = [
    {
      title: '角色名',
      dataIndex: 'name',
      key: 'name',
      width: 120
    },
    {
      title: '角色编号',
      dataIndex: 'identifier',
      key: 'identifier',
      width: 150,
    },
    {
      title: 'api权限',
      dataIndex: 'api_paths',
      key: 'api_paths',
      width: 250,
    },
    {
      title: '已授权用户',
      dataIndex: 'user_info',
      key: 'user_info',
    },
    {
      title: '操作',
      width: 150,
      key: 'operation',
      render: (record: any) => (
        <div className='frsc'>
          <div
            style={{paddingRight: '12px'}}
            onClick={() => {
              setSelectId(record.id)
              onShowDrawer()
            }}
          >
            <a href='#'>编辑</a>
          </div>
          <Popconfirm
            title={`确定删除【${record.name}】吗？`}
            onConfirm={() => {
              fetchPost('/management/system/role/del', {id: record.id}, dispatch).then(res => {
                if(res.data.status === 2){
                  message.success(res.data.message)
                  setRefresh(prev => prev + 1)
                }else{
                  message.error(res.data.message)
                }
              })
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </div>
      )
    }
  ]




  return (
    <div >
      <div className='paths_top_con'>
        <Button type="primary" onClick={onShowDrawer}>
          新增
        </Button>
      </div>
      <div>
        <Table
          rowKey={(record:any)=>record.id}
          columns={columns}
          dataSource={infos.list}
          scroll={{y: `calc(100vh - 263px)`}}
        />
      </div>

      <Drawer
        title="新增角色"
        placement="right"
        closable={false}
        width={430}
        onClose={onCloseDrawer}
        visible={showDrawer}
      >
        <Form
          name="path"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="角色名"
            name="name"
            rules={[{ required: true, message: '请输入角色名' }]}
          >
            <Input placeholder='请输入角色名' />
          </Form.Item>

          <Form.Item
            label="角色编号"
            name="identifier"
            rules={[{ required: true, message: '请输入角色编号' }]}
          >
            <InputNumber min={1000} max={9999} />
          </Form.Item>

          
          <Form.Item
            label="api权限"
            name="api_paths"
            rules={[{ required: false, message: '请输入该角色可调用的api权限' }]}
          >
            <Input.TextArea autoSize placeholder='请输入该角色可调用的api权限，以换行分隔，如：/users/list。/表示所有权限' />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}

export default Role