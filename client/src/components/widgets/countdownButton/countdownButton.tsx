import React, { useState, useEffect } from 'react'
import { Button, message } from 'antd'

let timeChange: any


interface ICountdownButtonProps {
  isCanClick?: -1 | 0 | 1
  info?: string
  onClick?: Function
  onSend?: Function
  onTimerEnd?: Function
}

const CountdownButton = (props: ICountdownButtonProps) => {
  const {onClick=()=>{}, isCanClick=false, info='', onSend=()=>{}, onTimerEnd=()=>{}} = props
  const [time, setTime] = useState(60)
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [btnContent, setBtnContent] = useState('获取验证码')

  useEffect(() => {
    clearInterval(timeChange)
    return () => clearInterval(timeChange)
  }, [])

  useEffect(() => {
    if (time > 0 && time < 60) {
      setBtnContent(`${time}s后重发`)
    } else {
      clearInterval(timeChange)
      setBtnDisabled(false)
      setTime(60)
      setBtnContent('获取验证码')
      onTimerEnd()
    }
  }, [time])

  useEffect(() => {
    if(isCanClick === 1){
      // 注意，不要使用 setTime(t-1) ： 闭包问题会导致time一直为59
      timeChange = setInterval(() => setTime(t => --t), 1000)
      setBtnDisabled(true)
      onSend()
    }else if(isCanClick === 0){
      message.error(info)
    }
  }, [isCanClick])


  return (
    <Button 
      type='primary'
      disabled={btnDisabled}
      onClick={()=>{onClick()}}
    >
      {btnContent}
    </Button>
  );
};

export default CountdownButton