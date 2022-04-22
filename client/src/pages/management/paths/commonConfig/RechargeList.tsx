import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'

import {Button, Drawer, Table, Form, Input, message, InputNumber, Popconfirm} from 'antd'
import {fetchGet, fetchPost, CONFIG_DATA, fetchPut} from '@/constants/config'



import '../paths.css'


function RechargeList() {

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
    fetchGet('/management/commonConfig/recharge/list', dispatch).then(res => {
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
      price: 100.00,
      pay_price: 90.00,
    })
  }


  const onFinish = (values: any) => {
    setLoading(true)
    if(selectId){
      // fetchPut('/', {
      //   id: selectId,
      //   price: values.price,
      //   pay_price: values.pay_price
      // }, dispatch).then(res => {
      //   if(res.data.status === 2){
      //     message.success(res.data.message)
      //     onCloseDrawer()
      //     setRefresh(prev => prev + 1)
      //     clearInput()
      //   }else{
      //     message.error(res.data.message || '操作失败')
      //   }
      //   setLoading(false)
      // })
    }else{
      fetchPost('/management/commonConfig/recharge/add', {
        price: values.price,
        pay_price: values.pay_price
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
      title: '充值金额',
      dataIndex: 'price',
      key: 'price',
      width: 250,
      render: (item: any) => (<div style={{fontWeight: 'bold', color: '#0dba13'}}>￥{item.toFixed(2)}</div>)
    },
    {
      title: '实际支付',
      dataIndex: 'pay_price',
      key: 'pay_price',
      width: 250,
      render: (item: any) => (<div style={{fontWeight: 'bold', color: '#f54949'}}>￥{item.toFixed(2)}</div>)
    },
    {
      title: '操作',
      key: 'operation',
      render: (record: any) => (
        <div className='frsc'>
          <Popconfirm
            title={`确定删除吗？`}
            onConfirm={() => {
              fetchPut('/management/commonConfig/recharge/del', {id: record.id}, dispatch).then(res => {
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
        title="新增充值类型"
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
            label="充值金额"
            name="price"
            rules={[{ required: true, message: '请输入充值金额' }]}
          >
            <InputNumber min={0.01} max={9999} step={0.01} />
          </Form.Item>

          <Form.Item
            label="实际支付"
            name="pay_price"
            rules={[{ required: true, message: '请输入实际支付金额' }]}
          >
            <InputNumber min={0.01} max={9999} step={0.01} />
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

export default RechargeList