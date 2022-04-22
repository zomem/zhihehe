import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'

import {Button, Drawer, Table, Form, Input, message, Upload, Popconfirm, Popover, Tag} from 'antd'
import {fetchGet, fetchPost, CONFIG_DATA, fetchPut} from '@/constants/config'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


import '../paths.css'


type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

function validatePrimeImage(
  upImage: {
    bg_image: string
    bg_image_url: string
    share_image: string
    share_image_url: string
  }
): { validateStatus: ValidateStatus; errorMsg: string | null } {
  if (upImage.bg_image && upImage.share_image) {
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }
  return {
    validateStatus: 'error',
    errorMsg: '请上传图片',
  };
}

export default () => {

  const dispatch = useDispatch()
  const [showDrawer, setShowDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(1)
  const [infos, setInfos] = useState<any>({
    list: []
  })
  const [upImage, setUpImage] = useState<{
    value: {
      bg_image: string
      bg_image_url: string
      share_image: string
      share_image_url: string
    };
    validateStatus?: ValidateStatus;
    errorMsg?: string | null;
  }>({
    value: {
      bg_image: '',
      bg_image_url: '',
      share_image: '',
      share_image_url: ''
    },
  });


  const [selectId, setSelectId] = useState('')
  
  const [form] = Form.useForm()


  useEffect(() => {
    fetchGet('/management/manage/gift_theme/gift_theme_list', dispatch).then(res => {
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
      message: '',
    })
    setUpImage({
      value: {
        bg_image: '',
        bg_image_url: '',
        share_image: '',
        share_image_url: ''
      }
    })
  }


  const onFinish = (values: any) => {
    console.log('fisnic', values, upImage)
    // 校验图片是否上传
    setUpImage(prev => ({
      ...prev,
      ...validatePrimeImage({
        share_image_url: prev.value.share_image_url,
        share_image: prev.value.share_image,
        bg_image: prev.value.bg_image,
        bg_image_url: prev.value.bg_image_url
      }),
    }))
    if(!upImage.value.bg_image || !upImage.value.share_image) return
    
    setLoading(true)
    if(selectId){
      fetchPut('/management/manage/gift_theme/gift_theme_update', {
        id: selectId,
        title: values.title,
        bg_image: upImage.value.bg_image, 
        share_image: upImage.value.share_image,
        message: values.message,
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
      fetchPost('/management/manage/gift_theme/gift_theme_add', {
        title: values.title,
        bg_image: upImage.value.bg_image, 
        share_image: upImage.value.share_image,
        message: values.message,
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
        message: info.message
      })
      setUpImage({
        value: {
          bg_image: info.bg_image,
          bg_image_url: info.bg_image_url,
          share_image: info.share_image,
          share_image_url: info.share_image_url
        }
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
      title: '贺卡标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: '背景图片',
      dataIndex: 'bg_image_url',
      key: 'bg_image_url',
      width: 120,
      render: (item: any) => (
        <div>
          <Popover key={item} trigger="click" content={<img src={item} style={{width: '280px', height: '280px'}} />} title="预览">
            <img src={item} style={{width: '60px', height: '60px'}} />
          </Popover>
        </div>
      )
    },
    {
      title: '分享图片',
      dataIndex: 'share_image_url',
      key: 'share_image_url',
      width: 120,
      render: (item: any) => (
        <div>
          <Popover key={item} trigger="click" content={<img src={item} style={{width: '280px', height: '280px'}} />} title="预览">
            <img src={item} style={{width: '60px', height: '60px'}} />
          </Popover>
        </div>
      )
    },
    {
      title: '默认贺词',
      dataIndex: 'message',
      key: 'message',
      width: 250,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (item: number) => (
        <div >
          {
            {
              2: (
                <Tag color='green'>上线中</Tag>
              ),
              1: (
                <Tag color="default">已下线</Tag>
              ),
            }[item]
          }
        </div>
      )
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
            title={`确定${record.status === 2 ? '下线' : '上线'}【${record.title}】吗？`}
            onConfirm={() => {
              fetchPut('/management/manage/gift_theme/gift_theme_change', {id: record.id}, dispatch).then(res => {
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
            <a href="#">{record.status === 2 ? '下线' : '上线'}</a>
          </Popconfirm>
        </div>
      )
    }
  ]


  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }


  function beforeUploadmin(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('仅支持 jpg/png 格式的图片')
    }
    const isLt1M = file.size / 1024 / 1024 < 0.20
    if (!isLt1M) {
      message.error('图片必须小于200KB')
    }
    return isJpgOrPng && isLt1M
  }


  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('仅支持 jpg/png 格式的图片')
    }
    const isLt1M = file.size / 1024 / 1024 < 0.85
    if (!isLt1M) {
      message.error('图片必须小于850KB')
    }
    return isJpgOrPng && isLt1M
  }

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setUpImage(prev => ({
        ...validatePrimeImage({
          share_image_url: prev.value.share_image_url,
          share_image: prev.value.share_image,
          bg_image: info.file.response.path,
          bg_image_url: info.file.response.url
        }),
        value: {
          ...prev.value,
          bg_image: info.file.response.path,
          bg_image_url: info.file.response.url
        }
      }))
    }
  };
  const handleChange2 = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setUpImage(prev => ({
        ...validatePrimeImage({
          bg_image_url: prev.value.share_image_url,
          bg_image: prev.value.share_image,
          share_image: info.file.response.path,
          share_image_url: info.file.response.url
        }),
        value: {
          ...prev.value,
          share_image: info.file.response.path,
          share_image_url: info.file.response.url
        }
      }))
    }
  };


  const uploadButton = (
    <div>
      {false ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

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
        title="新增贺卡"
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
            label="贺卡标题"
            name="title"
            rules={[{ required: true, message: '请输入贺卡标题' }]}
          >
            <Input placeholder='请输入贺卡标题' />
          </Form.Item>
          <Form.Item
            label="默认贺词"
            name="message"
            rules={[{ required: true, message: '请输入默认贺词' }]}
          >
            <Input placeholder='请输入默认贺词' />
          </Form.Item>
          

          <Form.Item
            label="背景图片"
            validateStatus={upImage.validateStatus}
            help={upImage.errorMsg}
            getValueFromEvent={normFile}
          >
            <Upload 
              headers={{ 'Authorization': `Bearer ${localStorage.getItem(CONFIG_DATA.ZM_LOGIN_TOKEN) || ''}` }}
              name="file"
              action={CONFIG_DATA.API_URL + '/upload/gift'}
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {upImage.value.bg_image_url ? <img src={upImage.value.bg_image_url} alt="avatar" style={{ width: '100%', height: '100%' }} /> : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item
            label="分享图片"
            validateStatus={upImage.validateStatus}
            help={upImage.errorMsg}
            getValueFromEvent={normFile}
          >
            <Upload 
              headers={{ 'Authorization': `Bearer ${localStorage.getItem(CONFIG_DATA.ZM_LOGIN_TOKEN) || ''}` }}
              name="file"
              action={CONFIG_DATA.API_URL + '/upload/gift'}
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUploadmin}
              onChange={handleChange2}
            >
              {upImage.value.share_image_url ? <img src={upImage.value.share_image_url} alt="avatar" style={{ width: '100%', height: '100%' }} /> : uploadButton}
            </Upload>
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
