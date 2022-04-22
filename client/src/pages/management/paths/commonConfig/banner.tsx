import React, {useEffect, useState} from "react"
import {useDispatch} from 'react-redux'
import {Button, Drawer, Form, Input, message, Upload} from 'antd'
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons'

import {fetchGet, fetchPost, CONFIG_DATA} from '@/constants/config'


import '../paths.css'

function Banner() {
  const dispatch = useDispatch()
  const [infos, setInfos] = useState({
    list: []
  })
  const [showDrawer, setShowDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(1)
  
  const [form] = Form.useForm()
  const [imgs, setImgs] = useState<{
    show: string[]
    imgPaths: string[]
  }>({
    show: [],       // 显示用的banner
    imgPaths: []    // 上传的图片的路径
  }) 


  useEffect(() => {
    
  }, [refresh])


  const clearInput = () => {
    form.setFieldsValue({
      imgUrls: [],
      path_urls: '',
      name: '',
      page: '',
      color: '',
    })
    setImgs({
      show: [],
      imgPaths: []
    })
    
  }

  const onShowDrawer = () => {
    setShowDrawer(true)
  }
  const onCloseDrawer = () => {
    setShowDrawer(false)
  }

  const onFinish = (values: any) => {
    console.log('上传', values)
    if(imgs.imgPaths.length === 0){
      return message.error('请上传Banner图')
    }
    setLoading(true)
    fetchPost('/management/commonConfig/banner/add', {
      img_urls: imgs.imgPaths.toString(),
      path_urls: values.path_urls.replace(/\n/g, ','),
      name: values.name,
      page: values.page,
      color: values.color || '',
    }, dispatch).then(res => {
      if(res.data.status === 2){
        message.success(res.data.message)
        setShowDrawer(false)
        setRefresh(prev => prev + 1)
        clearInput()
      }else{
        message.error('操作失败')
      }
      setLoading(false)
    })
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }




  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  )



  return (
    <div>
      <div className='paths_top_con'>
        <Button type="primary" onClick={onShowDrawer}>
          新增
        </Button>
      </div>
      <div className='' style={{height: 'calc(100vh - 263px)'}}>

      </div>


      <Drawer
        title="新增Banner"
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
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入banner名称' }]}
          >
            <Input placeholder='请输入banner名称' />
          </Form.Item>

          <Form.Item
            label="页面"
            name="page"
            rules={[{ required: true, message: '请输入banner所在页面' }]}
          >
            <Input placeholder='哪个页面的banner' />
          </Form.Item>

          <Form.Item
            label="主色"
            name="color"
            rules={[{ required: false, message: '请输入banner的主色色值' }]}
          >
            <Input placeholder='请输入banner的主色色值' />
          </Form.Item>

          <Form.Item label="Banner">
            <Form.Item name="imgUrls" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
              <Upload
                name="file"
                listType="picture-card"
                headers={{
                  'Authorization': `Bearer ${localStorage.getItem(CONFIG_DATA.ZM_LOGIN_TOKEN) || ''}`
                }}
                action={CONFIG_DATA.API_URL + '/upload/banner'}
                onChange={() => {
                  const uploadImg = form.getFieldValue('imgUrls')
                  console.log('uuuuuuuuuuuuuuuuu', uploadImg)
                  let tempShow: string[] = [], tempPaths: string[] = []
                  if(uploadImg){
                    if(uploadImg.length > 0){
                      for(let i = 0; i < uploadImg.length; i++){
                        if(uploadImg[i].response){
                          tempShow.push(uploadImg[i].response.url)
                          tempPaths.push(uploadImg[i].response.path)
                        }
                      }
                    }
                  }
                  setImgs({
                    show: tempShow,
                    imgPaths: tempPaths
                  })
                }}
              >
                { imgs.show.length < 6 && uploadButton }
              </Upload>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="跳转路径"
            name="path_urls"
            rules={[{ required: true, message: '请输入banner的主色色值' }]}
          >
            <Input.TextArea autoSize placeholder='请输入跳转路径，以换行分隔' />
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


export default Banner