import React, {useState, useEffect} from "react"
import {useDispatch} from 'react-redux'
import {Input, message, InputNumber} from 'antd'

import {fetchGet, fetchPut} from '@/constants/config'

import useStyles from '@/hooks/useStyles'
import {Block, Box, Image} from '@/components/widgets/Components'
import LineText from '@/components/widgets/lineText/lineText'
import '../paths.css'




const { Search } = Input


// PRICE_PERCENT

interface InfosItem {
  id: number
  key: 'PRICE_PERCENT'
  title: string
  description: string
  value: string
  status: number
}

export default () => {
  const dispatch = useDispatch()
  const [styles, setStyles] = useState<UseStyle>({})

  const [infos, setInfos] = useState<InfosItem[]>([{id: 0, title: '', key: 'PRICE_PERCENT', description: '', value: '', status: 0}])


  useStyles((value) => {
    setStyles(value)
  })

  useEffect(() => {
    fetchGet('/management/system/constants/list', dispatch).then(res => {
      setInfos(res.data)
    })
  }, [])


  // 更新 PRICE_PERCENT
  const changePricePercent = (id: number, value: any) => {
    fetchPut('/management/system/constants/chagne', {
      id: id,
      value: value
    }, dispatch).then(res => {
      if(res.data.status === 0){
        message.error(res.data.message)
      }
    })
  }


  return(
    <div>
      <div className='paths_top_con'>
        {
          infos.map((item, index) => (
            <div key={item.id}>
              {
                {
                  'PRICE_PERCENT': (
                    <div>
                      <LineText title={item.title} />
                      <InputNumber
                        min='1.00'
                        max='2.00'
                        step='0.01'
                        defaultValue={item.value}
                        onChange={(value) => {
                          changePricePercent(item.id, value)
                        }}
                      />
                      <div className='text_gray' style={{margin: '20px 0'}}>❈ {item.description}</div>
                    </div>
                  )
                }[item.key]
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}


