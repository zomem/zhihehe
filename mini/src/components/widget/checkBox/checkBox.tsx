import React, {useEffect, useState} from 'react'
import {View, Text, Image} from '@tarojs/components'


import ICON_GOU from '@/images/icons/gou.png'

import {deleteArrObj, isHaveArrObj} from '@/utils/filter'

import './checkBox.scss'

interface ICheckBoxProps {
  list?: IAnswersItem[],
  value?: IAnswersItem[],
  isCir?: boolean
  txtColor?: string,
  onChange?: Function,
  isSingle?: boolean
}

function CheckBox (props: ICheckBoxProps) {

  const {list=[], value=[], txtColor='#3c3c3c', onChange=() => {}, isSingle=false, isCir=false} = props

  const [check, setCheck] = useState(value)

  useEffect(() => {
    onChange(check)
  }, [check])

  

  return(
    <View>
      {
        list.length > 0 &&
        <View>
          {
            list.map((item, index) => (
              <View 
                className='_checkbox_all_line frsc'
                key={item.ans_id}
                onClick={() => {
                  if(isSingle){
                    setCheck([item])
                  }else{
                    if(isHaveArrObj(check, item, 'ans_id')){
                      setCheck(deleteArrObj([...check], item, 'ans_id'))
                    }else{
                      setCheck([...check, item])
                    }
                  }
                }}
              >
                {
                  isHaveArrObj(check, item, 'ans_id') ?
                  <View className={isCir ? 'fccc _checkbox_box_yes_cir' : 'fccc _checkbox_box_yes'}>
                    <Image src={ICON_GOU} className='_checkbox_gou' />
                  </View>
                  :
                  <View className={isCir ? 'fccc _checkbox_box_no_cir' : 'fccc _checkbox_box_no'}></View>
                }
                <Text className='fs14 _checkbox_txt' style={{color: txtColor}}>{item.ans_content}</Text>
              </View>
            ))
          }
        </View>
      }
    </View>
  )
}

export default CheckBox