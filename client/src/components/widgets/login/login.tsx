import React, {useState} from "react"
import { Form, Input, Button, Checkbox, Modal, message } from 'antd'
import { MailOutlined, LockOutlined, ProfileOutlined } from '@ant-design/icons'
import {useDispatch} from 'react-redux'

import CountdownButton from '@/components/widgets/countdownButton/countdownButton'

import {isEmail} from '@/utils/veriInfo'
import {fetchPost} from '@/constants/config'
import onCurrentUser from '@/actions/currentUser'

import './login.css'

interface ILoginProps {
  isOpen: boolean
  onCancel?: Function
  onConfirm?: Function
}

function Login(props: ILoginProps) {
  const dispatch = useDispatch()
  const {isOpen=false, onCancel=()=>{}, onConfirm=()=>{}} = props

  const [status, setStatus] = useState(1)   //1为登录，2为注册, 3为更改密码
  const [loading, setLoading] = useState(false)

  const [rememberMe, setRememberMe] = useState(false)

  const [form] = Form.useForm()
  const [isCanClick, setIsCanClick] = useState<-1 | 0 | 1>(-1)

  const onFinish = async (values: any) => {
    if(status === 1){
      //登录
      if(!isEmail(values.email)){
        message.warning('邮箱格式不正确')
        return
      }
      if(!values.password){
        message.warning('密码不能为空')
        return
      }
      let tempLogin = (await fetchPost('/login/email', {
        email: values.email,
        password: values.password,
      }, dispatch)).data
      if(tempLogin.status === 2){
        dispatch(onCurrentUser({...tempLogin.userInfo, remember: values.remember}))
        onConfirm()
      }else{
        message.error(tempLogin.message)
      }
    }else{
      if(values.password.length < 6){
        message.warning('密码不能少于6位')
        return
      }
      if(values.emailCode.length !== 6){
        message.warning('验证码长度为6位')
        return
      }
      let tempData = (await fetchPost('/register/email', {
        email: values.email,
        password: values.password,
        code: values.emailCode,
        type: status === 3 ? 2 : 1
      }, dispatch)).data
      if(tempData.status === 2){
        message.success(tempData.message)
        setStatus(1)
        onConfirm()
      }else{
        message.error(tempData.message)
      }
    }
  }


  return (
    <div>
      <Modal
        width={320}
        title={status === 1 ? '登录' : status === 2 ? '注册' : '更改密码'}
        visible={isOpen}
        onCancel={() => {onCancel()}}
        okText={status === 1 ? '登录' : status === 2 ? '注册' : '更改密码'}
        cancelText='取消'
        footer={[
          <Button
            key="submit"
            onClick={() => {
              if(status === 1){
                form.resetFields()
                setStatus(2)
                setIsCanClick(-1)
              }else{
                form.resetFields()
                setStatus(1)
                setIsCanClick(-1)
              }
            }}
          >
            {status === 1 ? '去注册' : '去登录'}
          </Button>,
          <Button
            key="link"
            type="primary"
            loading={loading}
            onClick={() => {
              form.submit()
            }}
          >
            {status === 1 ? '登录' : status === 2 ? '注册' : '更改密码'}
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: false }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: '' }]}
          >
            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={status === 3 ? '新密码' : '密码'}
            />
          </Form.Item>
          {
            (status === 2 || status === 3) &&
            <Form.Item
              name="emailCode"
              rules={[{ required: true, message: '' }]}
            >
              <div className='frbc'>
                <Input prefix={<ProfileOutlined className="site-form-item-icon" />} placeholder="邮箱验证码" />
                <div style={{width: '50px'}} />
                <CountdownButton
                  info='邮箱不能为空'
                  isCanClick={isCanClick}
                  onClick={() => {
                    if(isEmail(form.getFieldValue('email'))){
                      setIsCanClick(1)
                    }else{
                      setIsCanClick(0)
                    }
                  }}
                  onSend={async () => {
                    setLoading(true)
                    let tempEmail = form.getFieldValue('email')
                    let temp = (await fetchPost('/register/email/code', {
                      email: tempEmail,
                      type: status === 3 ? 2 : 1,
                    }, dispatch)).data
                    setLoading(false)
                    if(temp.status === 2){
                      message.success(temp.message)
                    }else{
                      setIsCanClick(-1)
                      message.warning(temp.message)
                    }
                  }}
                  onTimerEnd={() => setIsCanClick(-1)}
                />
              </div>
            </Form.Item>
          }
          {
            status == 1 &&
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <a className="login-form-forgot" onClick={() => setStatus(3)}>
                忘记密码？
              </a>
            </Form.Item>
          }
        </Form>
      </Modal>
    </div>
  )
}


export default Login