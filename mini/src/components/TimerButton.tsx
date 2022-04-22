import react, {useEffect, useRef, useState} from 'react'
import {Button} from '@/components/widget/Components'


interface TimerButton {
  onClick?: Function
  time?: number
  title?: string
  size?: string
  bgColor?: string
  bgImage?: string
  radius?: string
  disable?: boolean
}

export default (props: TimerButton) => {
  const {onClick=() => {}, time=60, title='发送验证码', size, bgColor, bgImage, radius, disable=false} = props

  const [count, setCount] = useState<number>(time)
  const [isTimer, setIsTimer] = useState<boolean>(false)
  const intervalId = useRef<any>()

  useEffect(() => {
    if(count <= 0){
      setIsTimer(false)
      setCount(time)
      clearInterval(intervalId.current)
    }
  }, [count])

  return (
    <Button
      size={size}
      bgColor={bgColor}
      bgImage={bgImage}
      radius={radius}
      letterSpacing='normal'
      disable={isTimer || disable}
      onClick={() => {
        setIsTimer(true)
        intervalId.current = setInterval(() => {
          setCount(prev => prev - 1)
        }, 1000)
        onClick()
      }}
    >
      {isTimer ? `${count}秒后重发` : title}
    </Button>
  )
}