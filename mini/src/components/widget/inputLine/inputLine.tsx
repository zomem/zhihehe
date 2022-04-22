import React, {useMemo} from 'react'
import {View, Image, Input, Picker, Text} from '@tarojs/components'
import Taro from '@tarojs/taro'

import ICON_RIGHT_ARROR from '@/images/icons/arror_right.png'
import ICON_CAMERA from '@/images/icons/camera.png'

import {INPUT_LINE_GENDER_ARRAY} from '@/constants/constants'

import './inputLine.scss'

type TInputLine = 'input' | 'avatar' | 'gender' | 'phone' | 'birth' | 'addr'

interface IProps {
  type?: 'address' | 'birthday' | 'company_name' | 'email' | 'fax' | 'headimgurl' | 'homepage' | 'house_tel' | 'identity' | 'job' | 'live_now' | 'member_tel' | 'member_name' | 'qq' | 'wx'
  title?: string
  value?: string
  txtLength?: number
  disable?: boolean
  placeholder?: string
  isRequired?: boolean
  onChange?: Function
}

function InputLine (props: IProps) {

  const { 
    title, 
    value='',
    type='',
    txtLength=140,
    placeholder, 
    onChange=() => {}, 
    isRequired=false,
    disable=false
  } = props

  const inputType = useMemo<TInputLine>(() => {
    switch (type){
      case 'address':
        return 'input'
      case 'birthday':
        return 'birth'
      case 'company_name':
        return 'input'
      case 'email':
        return 'input'
      case 'fax':
        return 'input'
      case 'headimgurl':
        return 'avatar'
      case 'homepage':
        return 'input'
      case 'house_tel':
        return 'input'
      case 'identity':
        return 'input'
      case 'job':
        return 'input'
      case 'live_now':
        return 'addr'
      case 'member_tel':
        return 'phone'
      case 'member_name':
        return 'input'
      case 'qq':
        return 'input'
      case 'wx':
        return 'input'
      default:
        return 'input'
    }
  }, [type])


  return (
    <View>
      {
        {
          'input': (
            <View className='_input_line_con frbc' >
              <View className='_input_line_left frsc'>
                <Text className='fc3c fs15'>{title}</Text>
                {isRequired && <Text className='fcff2 fs15'>*</Text>}
              </View>
              <View className='_input_line_right'>
                <Input 
                  className='_input_line_input fc3b fs15' 
                  placeholderClass='fcc9'
                  placeholder={placeholder}
                  disabled={disable}
                  maxlength={txtLength}
                  value={value}
                  onInput={(e) => {
                    onChange(e.detail.value)
                  }}
                />
              </View>
            </View>
          ),
          'avatar': (
            <View className='_input_line_con_a frbc' >
              <View className='_input_line_left frsc'>
                <Text className='fc3c fs15'>{title}</Text>
                {isRequired && <Text className='fcff2 fs15'>*</Text>}
              </View>
              <View className='_input_line_right frec'>
                <View 
                  className='_input_line_right_image'
                  onClick={() => {
                    Taro.chooseImage({
                      count: 1,
                      sizeType: ['compressed'],
                      sourceType: ['album', 'camera'],
                      success: (res) => {
                        onChange(res.tempFilePaths[0])
                      }
                    })
                  }}
                >
                  <Image className='_input_line_right_avatar' src={value || ''} mode='aspectFill' />
                  <View className='_input_line_right_ai fccc'>
                    <Image className='_input_line_right_aii' src={ICON_CAMERA} />
                  </View>
                </View>
              </View>
            </View>
          ),
          'gender': (
            <View className='_input_line_con frbc' >
              <View className='_input_line_left frsc'>
                <Text className='fc3c fs15'>{title}</Text>
                {isRequired && <Text className='fcff2 fs15'>*</Text>}
              </View>

              <View className='_input_line_right frec'>
                <Picker
                  className='_input_line_right_picker'
                  value={INPUT_LINE_GENDER_ARRAY.indexOf(value)}
                  mode='selector'
                  range={INPUT_LINE_GENDER_ARRAY}
                  onChange={(e) => {
                    onChange(INPUT_LINE_GENDER_ARRAY[e.detail.value])
                  }}
                >
                  <View 
                    className={
                      INPUT_LINE_GENDER_ARRAY.indexOf(value) > -1 ? 
                      '_input_line_right_picker fc3b fs15 frec':
                      '_input_line_right_picker fcc9 fs15 frec'
                    }
                  >
                    {INPUT_LINE_GENDER_ARRAY.indexOf(value) > -1 ? value : placeholder}
                  </View>
                </Picker>

                <View className='frec fc15 fc3c'>
                  <Image className='_input_line_right_arror' src={ICON_RIGHT_ARROR} />
                </View>
              </View>
            </View>
          ),
          'phone': (
            <View className='_input_line_con frbc' >
              <View className='_input_line_left frsc'>
                <Text className='fc3c fs15'>{title}</Text>
                {isRequired && <Text className='fcff2 fs15'>*</Text>}
              </View>

              <View className='_input_line_right frec'>
                  <View 
                    className={
                      value ? 
                      '_input_line_right_picker fc3b fs15 frec':
                      '_input_line_right_picker fcc9 fs15 frec'
                    }
                  >
                    {value ? value : placeholder}
                  </View>
                <View className='frec fc15 fc3c'>
                  <Image className='_input_line_right_arror' src={ICON_RIGHT_ARROR} />
                </View>
              </View>
            </View>
          ),
          'birth': (
            <View className='_input_line_con frbc' >
              <View className='_input_line_left frsc'>
                <Text className='fc3c fs15'>{title}</Text>
                {isRequired && <Text className='fcff2 fs15'>*</Text>}
              </View>

              <View className='_input_line_right frec'>
                <Picker
                  className='_input_line_right_picker'
                  value={value}
                  mode='date'
                  onChange={(e) => {
                    onChange(e.detail.value)
                  }}
                >
                  <View 
                    className={
                      value ? 
                      '_input_line_right_picker fc3b fs15 frec':
                      '_input_line_right_picker fcc9 fs15 frec'
                    }
                  >
                    {value ? value : placeholder}
                  </View>
                </Picker>

                <View className='frec fc15 fc3c'>
                  <Image className='_input_line_right_arror' src={ICON_RIGHT_ARROR} />
                </View>
              </View>
            </View>
          ),
          'addr': (
            <View className='_input_line_con frbc' >
              <View className='_input_line_left frsc'>
                <Text className='fc3c fs15'>{title}</Text>
                {isRequired && <Text className='fcff2 fs15'>*</Text>}
              </View>

              <View className='_input_line_right frec'>
                <Picker
                  className='_input_line_right_picker'
                  value={value ? value.split(',') : []}
                  mode='region'
                  onChange={(e) => {
                    onChange(e.detail.value.toString())
                  }}
                >
                  <View 
                    className={
                      value ? 
                      '_input_line_right_picker fc3b fs15 frec':
                      '_input_line_right_picker fcc9 fs15 frec'
                    }
                  >
                    {value ? value : placeholder}
                  </View>
                </Picker>

                <View className='frec fc15 fc3c'>
                  <Image className='_input_line_right_arror' src={ICON_RIGHT_ARROR} />
                </View>
              </View>
            </View>
          ),
        }[inputType]
      }
    </View>
    
  )
}

export default InputLine