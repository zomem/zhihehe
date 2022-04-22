import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'

import {Button, Drawer, Table, Form, Input, message, InputNumber, Popconfirm} from 'antd'
import {fetchGet, fetchPost, CONFIG_DATA, fetchPut} from '@/constants/config'



import '../paths.css'


function ProductCat() {

  const dispatch = useDispatch()
  const [showDrawer, setShowDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(1)
  const [infos, setInfos] = useState<any>({
    list: []
  })

  const [selectId, setSelectId] = useState('')
  
  const [form] = Form.useForm()


  useEffect(() => {
    fetchGet('/management/system/product_cat/list', dispatch).then(res => {
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
      title: '',
      rank_num: 50,
    })
  }


  const onFinish = (values: any) => {
    setLoading(true)
    if(selectId){
      fetchPut('/management/system/product_cat/update', {
        id: selectId,
        title: values.title,
        rank_num: values.rank_num
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
      fetchPost('/management/system/product_cat/add', {
        title: values.title,
        rank_num: values.rank_num
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
      let info: any = {}
      for(let i = 0; i < infos.list.length; i++){
        if(infos.list[i].id === selectId){
          info = infos.list[i]
          break
        }
      }
      form.setFieldsValue({
        title: info.title,
        rank_num: info.rank_num
      })
    }else{
      clearInput()
    }
  }, [selectId, infos.list])


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120
    },
    {
      title: '类别名',
      dataIndex: 'title',
      key: 'title',
      width: 250,
    },
    {
      title: '排序',
      dataIndex: 'rank_num',
      key: 'rank_num',
      width: 150,
    },
    {
      title: '操作',
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
            title={`确定删除【${record.title}】吗？`}
            onConfirm={() => {
              fetchPut('/management/system/product_cat/del', {id: record.id}, dispatch).then(res => {
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
        title="新增商品分类"
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
            label="类别名"
            name="title"
            rules={[{ required: true, message: '请输入类别名' }]}
          >
            <Input placeholder='请输入类别名' />
          </Form.Item>

          <Form.Item
            label="排序"
            name="rank_num"
            rules={[{ required: true, message: '请输入排序号' }]}
          >
            <InputNumber min={1} max={9999} />
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

export default ProductCat