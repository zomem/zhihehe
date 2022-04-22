import React from 'react'
import {useSelector} from 'react-redux'
import {Flex, Text, Press} from '@/components/widget/Components'



interface InputNumberProps{
  type?: 'tap_btn'
  range?: number[]
  value?: number
  onChange?: Function
}

function InputNumber(props: InputNumberProps) {
  const {styles} = useSelector((state: ReduxState) => state)
  const {
    type='tap_btn',
    value=1,
    onChange=()=>{},
    range=[1, 100],
  } = props
  


  return (
    <Flex flex='frbc' size='150 40'>
      <Press 
        onClick={() => {
          if(value <= range[0]){
            return onChange(range[0])
          }
          onChange(value - 1)
        }}
      >
        <Flex flex='frcc' size='40 40' radius='20' bgColor={styles.boxColorGray}>
          <Text fontSize='30' color={styles.colorWhite} lineHeight='0'>-</Text>
        </Flex>
      </Press>
      <Text fontSize='30' fontWeight='bold' color={styles.textColor}>{value}</Text>
      <Press 
        onClick={() => {
          if(value >= range[1]){
            return onChange(range[1])
          }
          onChange(value + 1)
        }}
      >
        <Flex flex='frcc' size='40 40' radius='20' bgColor={styles.colorLightGreen}>
          <Text fontSize='30' color={styles.colorWhite} lineHeight='0'>+</Text>
        </Flex>
      </Press>
    </Flex>
  )
}

export default InputNumber