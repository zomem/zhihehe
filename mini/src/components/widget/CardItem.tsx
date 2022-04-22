import React, {ReactNode, useEffect, useState, useMemo} from "react"
import {useSelector} from 'react-redux'
import Taro from "@tarojs/taro"
import {Switch, Flex, Press, Text, Line, Image, Animate, Box} from '@/components/widget/Components'


interface CardItemProps {
  children?: ReactNode
  value?: any
  onClick?: Function
  type?: 'right' | 'icon_right' | 'check' | 'switch' | 'check_one' | 'button' | 'block'
  noBottom?: boolean
  noHover?: boolean
  rightText?: string
  size?: string
  padding?: string
}


const checkAnimate = Taro.createAnimation({
  transformOrigin: "50% 50%",
  duration: 150,
  timingFunction: "linear",
  delay: 0
})






export default (props: CardItemProps) => {
  const {styles} = useSelector((state: ReduxState) => state)
  const {value, children, onClick=()=>{}, noBottom=false, noHover=false, type='block', rightText, size='100% 96', padding='0 0 0 25'} = props
  
  const [checkAni, setCheckAni] = useState<Animate>({actions: []})
  
  const size2 = useMemo(() => {
    const [w, h] = size.split(' ')
     // 加线，的高
    return `${w} ${h === 'auto' ? h : (+h - 1).toString()}`
  }, [size])

  useEffect(() => {
    if(type === 'check' || type === 'check_one'){
      if(value){
        checkAnimate.opacity(1).step()
      }else{
        checkAnimate.opacity(0).step()
      }
      setCheckAni(checkAnimate.export())
    }
  }, [value])

  return (
    <Press
      hoverBgColor={(type === 'switch' || noHover) ? '' : styles.hoverColor}
      onClick={() => {
        if(type === 'switch') return
        onClick(value)
        if(type === 'check'){
          if(value){
            checkAnimate.opacity(0).step()
          }else{
            checkAnimate.opacity(1).step()
          }
          setCheckAni(checkAnimate.export())
        }
      }}
    >
      {
        {
          'block': (
            <Flex flex='frcc' size={size} padding={padding}>
              <Flex flex='frsc' size='100% 100%'>
                <Flex flex='fcbs' size={size}>
                  <Flex flex='frbc' size={size2}>
                    {children}
                  </Flex>
                  {noBottom ? <Line size='100% 1'/> : <Line size='100% 1' bgColor={styles.lineColor} />}
                </Flex>
              </Flex>
            </Flex>
          ),
          'icon_right': (
            <Flex flex='frcc' size={size} padding={padding}>
              <Flex flex='frsc' size='100% 100%'>
                <Flex flex='frsc' margin='0 20 0 0'>
                  <Image size='38 38' src={styles.iconNavHome} />
                </Flex>
                <Flex flex='fcbs' size={size}>
                  <Flex flex='frbc' size={size2}>
                    <Text color={styles.textColor} fontSize={styles.textSize}>{children}</Text>
                    <Flex flex='frec'>
                      {rightText && <Text color={styles.textColorLight} fontSize={styles.textSize}>{rightText}</Text>}
                      <Image size='32 32' margin='0 20 0 15' src={styles.iconRight} />
                    </Flex>
                  </Flex>
                  {noBottom ? <Line size='100% 1'/> : <Line size='100% 1' bgColor={styles.lineColor} />}
                </Flex>
              </Flex>
            </Flex>
          ),
          'right': (
            <Flex flex='frcc' size={size} padding={padding}>
              <Flex flex='frsc' size='100% 100%'>
                <Flex flex='fcbs' size={size}>
                  <Flex flex='frbc' size={size2}>
                    <Text color={styles.textColor} fontSize={styles.textSize}>{children}</Text>
                    <Flex flex='frec'>
                      {rightText && <Text color={styles.textColorLight} fontSize={styles.textSize}>{rightText}</Text>}
                      <Image size='32 32' margin='0 20 0 15' src={styles.iconRight} />
                    </Flex>
                  </Flex>
                  {noBottom ? <Line size='100% 1'/> : <Line size='100% 1' bgColor={styles.lineColor} />}
                </Flex>
              </Flex>
            </Flex>
          ),
          'button': (
            <Flex flex='frcc' size={size} padding={padding}>
              <Flex flex='frsc' size='100% 100%'>
                <Flex flex='fcbs' size={size}>
                  <Flex flex='frsc' size={size2}>
                    <Text color={styles.themeColor} fontSize={styles.textSize}>{children}</Text>
                  </Flex>
                  {noBottom ? <Line size='100% 1'/> : <Line size='100% 1' bgColor={styles.lineColor} />}
                </Flex>
              </Flex>
            </Flex>
          ),
          'switch': (
            <Flex flex='frcc' size={size} padding={padding}>
              <Flex flex='frsc' size='100% 100%'>
                <Flex flex='fcbs' size={size}>
                  <Flex flex='frbc' size={size2}>
                    <Text color={styles.textColor} fontSize={styles.textSize}>{children}</Text>
                    <Box margin='0 20 0 0'><Switch onChange={(value) => onClick(value)} /></Box>
                  </Flex>
                  {noBottom ? <Line size='100% 1'/> : <Line size='100% 1' bgColor={styles.lineColor} />}
                </Flex>
              </Flex>
            </Flex>
          ),
          'check': (
            <Flex flex='frcc' size={size} padding={padding}>
              <Flex flex='frsc' size='100% 100%'>
                <Flex flex='frsc' margin='0 20 0 0'>
                  <Animate animation={checkAni}><Image size='38 38' src={styles.iconChecked} /></Animate>
                </Flex>
                <Flex flex='fcbs' size={size}>
                  <Flex flex='frsc' size={size2}>
                    {children}
                  </Flex>
                  {noBottom ? <Line size='100% 1'/> : <Line size='100% 1' bgColor={styles.lineColor} />}
                </Flex>
              </Flex>
            </Flex>
          ),
          'check_one': (
            <Flex flex='frcc' size={size} padding={padding}>
              <Flex flex='frsc' size='100% 100%'>
                <Flex flex='fcbs' size={size}>
                  <Flex flex='frbc' size={size2}>
                    {children}
                    <Flex flex='frsc' margin='0 20 0 0'>
                      <Animate animation={checkAni}><Image size='38 38' src={styles.iconChecked} /></Animate>
                    </Flex>
                  </Flex>
                  {noBottom ? <Line size='100% 1'/> : <Line size='100% 1' bgColor={styles.lineColor} />}
                </Flex>
              </Flex>
            </Flex>
          )
        }[type]
      }
    </Press>
  )
}