import React, {useEffect, useState} from "react"
import {useDispatch} from 'react-redux'
import { Button, Table, Drawer, Form, Input, InputNumber, Modal, AutoComplete, message, Popconfirm } from "antd"

import IconsList from '@/components/widgets/iconsList/iconsList'
import ExcIcons from "@/components/widgets/iconsList/excIcons"

import {fetchGet, fetchPost} from '@/constants/config'

import '../paths.css'



type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus']

function validatePrimeNumber(name: string,): { validateStatus: ValidateStatus; errorMsg: string | null } {
  if (name) {
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }
  return {
    validateStatus: 'error',
    errorMsg: '请输入父模块名',
  };
}

function Paths() {
  const dispatch = useDispatch()
  const [size, setSize] = useState<number>(20)
  const [showDrawer, setShowDrawer] = useState(false)
  const [isOpenIcons, setIsOpenIcons] = useState(false)

  const [refresh, setRefresh] = useState(1)

  //展开的列表的父path
  const [expandPath, setExpandPath] = useState('')


  const [info, setInfo] = useState({
    list: [],
    loading: true
  })
  const [nameList, setNameList] = useState<any>([])  //已有的父模块名
  const [subInfo, setSubInfo] =  useState<any>({
    list: [],
    loading: true
  })


  const [iconName, setIconName] = useState('SettingOutlined')
  const [form] = Form.useForm()
  const [name, setName] = useState<{
    value: string
    validateStatus?: ValidateStatus
    errorMsg?: string | null
  }>({
    value: '',
  })
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    let tempPath = '', tempIcon = ''
    for(let i in nameList){
      if(nameList[i].value === name.value){
        tempPath = nameList[i].path
        tempIcon = nameList[i].icon
      }
    }
    if(tempPath){
      form.setFieldsValue({
        path: tempPath
      })
      setIconName(tempIcon)
    }
  }, [name.value, nameList])

  useEffect(() => {
    fetchGet('/management/system/paths/list', dispatch).then(res => {
      setInfo({
        loading: false,
        list: res.data
      })
      let temp: any = []
      for(let item in res.data){
        temp.push({
          value: res.data[item].name,
          path: res.data[item].path,
          icon: res.data[item].icon_name
        })
      }
      setNameList(temp)
    })
  }, [refresh])

  // 展开的列表
  useEffect(() => {
    if(expandPath){
      fetchGet('/management/system/sub_paths/list/' + expandPath, dispatch).then(res => {
        setSubInfo((prev: any) => ({
          ...prev,
          loading: false,
          [`${expandPath}`]: res.data
        }))
      })
    }
  }, [refresh, expandPath])



  const onShowDrawer = () => {
    setShowDrawer(true)
  }
  const onCloseDrawer = () => {
    setShowDrawer(false)
  }

  const onFinish = (values: any) => {
    if(!name.value) {
      return message.error('请输入父模块名')
    }
    setLoading(true)
    fetchPost('/management/system/paths/add', {
      icon: iconName,
      path: values.path,
      sub_path: values.sub_path,
      name: name.value,
      sub_name: values.sub_name,
      sort_num: values.sort_num,
    }, dispatch).then(res => {
      if(res.data.status === 2){
        message.success(res.data.message)
        setShowDrawer(false)
        setExpandPath(values.path)
        setRefresh(prev => prev + 1)
      }else{
        message.error('操作失败')
      }
      setLoading(false)
    })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }





  const expandedRowRender = (tempPath: string) => {
    const subColumns = [
      {
        title: '',
        dataIndex: 'space',
        key: 'space',
        width: 80
      },
      {
        title: '排序',
        dataIndex: 'sort_num',
        key: 'sort_num',
        width: 80
      },
      {
        title: '子模块名',
        dataIndex: 'sub_name',
        key: 'sub_name',
        width: 150,
      },
      {
        title: '子模块路径',
        dataIndex: 'sub_path',
        key: 'sub_path',
        width: 150,
      },
      {
        title: '操作',
        key: 'operation',
        render: (record: any) => (
          <Popconfirm
            title="确定删除该子模块吗？"
            onConfirm={() => {
              fetchPost('/management/system/paths/delete', {id: record.id}, dispatch).then(res => {
                if(res.data.status === 2){
                  message.success(res.data.message)
                  setRefresh(prev => prev + 1)
                  setExpandPath(record.path)
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
        )
      }
    ]

    return (
      <Table
        rowKey={(record:any) => record.id}
        columns={subColumns}
        dataSource={subInfo[tempPath]}
        pagination={false}
      />
    )
  }




  const columns = [
    {
      title: '排序',
      dataIndex: 'sort_num',
      key: 'sort_num',
      width: 80
    },
    {
      title: '图标',
      dataIndex: 'icon_name',
      key: 'icon_name',
      width: 80,
      render: (item: any) => (
        <ExcIcons name={item} />
      )
    },
    {
      title: '父模块名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '父模块目录',
      dataIndex: 'path',
      key: 'path',
      width: 150,
    },
    {
      title: '操作',
      key: 'operation',
      render: (record: any) => (
        <Popconfirm
          title="确定删除该父模块吗？"
          onConfirm={() => {
            fetchPost('/management/system/paths/delete', {id: record.id}, dispatch).then(res => {
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
      )
    }
  ]




  return(
    <div>
      <div className='paths_top_con'>
        <Button type="primary" onClick={onShowDrawer}>
          新增
        </Button>
      </div>
      <div>
        <Table
          rowKey={(record:any)=>record.id}
          columns={columns} 
          dataSource={info.list} 
          expandable={{ 
            expandedRowRender: (record) => expandedRowRender(record.path),
            onExpand: (expanded, record) => {
              setExpandPath(record.path)
            }
          }}
          pagination={{ 
            pageSize: size,
            showSizeChanger: true,
            onShowSizeChange: (c, s) => {
              setSize(s)
            }
          }}
          scroll={{y: `calc(100vh - 263px)`}}
        />
      </div>

      <Drawer
        title="新增页面"
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
            label="父模块图标"
          >
            <div className='frsc'>
              <ExcIcons name={iconName} />
              <div style={{width: '20px'}} />
              <Button onClick={() => setIsOpenIcons(true)}>选择</Button>
            </div>
          </Form.Item>

          <Form.Item
            label="父模块名"
            help={name.errorMsg}
            validateStatus={name.validateStatus}
            required
          >
            <Input.Group>
              <AutoComplete
                onChange={(value) => {
                  setName({
                    ...validatePrimeNumber(value),
                    value,
                  })
                }}
                onSelect={(value) => {
                  setName({
                    ...validatePrimeNumber(value),
                    value,
                  })
                }}
                style={{width: '100%'}}
                placeholder="如：系统管理"
                options={nameList}
              />
            </Input.Group>
          </Form.Item>


          <Form.Item
            label="父模块目录"
            name="path"
            rules={[{ required: true, message: '请输入父模块目录' }]}
          >
            <Input placeholder='如：system' />
          </Form.Item>



          <Form.Item
            label="子模块名"
            name="sub_name"
            rules={[{ required: true, message: '请输入子模块名' }]}
          >
            <Input placeholder='如：页面管理' />
          </Form.Item>

          <Form.Item
            label="子模块路径"
            name="sub_path"
            rules={[{ required: true, message: '请输入子模块路径' }]}
          >
            <Input placeholder='如：system/paths' />
          </Form.Item>

          <Form.Item
            label="排序"
            name="sort_num"
            rules={[{ required: false, message: '请输入子模块路径' }]}
          >
            <InputNumber min={1} max={999} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Drawer>


      <Modal
        width={680}
        visible={isOpenIcons}
        footer={null}
        onCancel={() => setIsOpenIcons(false)}
      >
        <IconsList
          select={iconName}
          onClick={(name) => setIconName(name)}
        />
      </Modal>
    </div>
  )
}



export default Paths