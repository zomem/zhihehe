import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'

import {Table, Form} from 'antd'
import {fetchGet, fetchPost, CONFIG_DATA, fetchPut} from '@/constants/config'


import { dateTime } from "@/utils/timeFormat"

import '../paths.css'


function FeedBack() {

  const dispatch = useDispatch()
  const [refresh, setRefresh] = useState(1)
  const [info, setInfo] = useState({
    list: [],
    loading: true,
    total: 0,
  })
  const [page, setPage] = useState(1)
  const [size, setSize] = useState<number>(20)
  const [form] = Form.useForm()
  const [r, setR] = useState(1) //刷新


  useEffect(() => {
    setInfo(prev => ({
      ...prev,
      loading: true
    }))
    fetchPost('/management/manage/feedback/list', {
      page: page,
      limit: size,
    }, dispatch).then(res => {
      setInfo({
        list: res.data.list,
        loading: false,
        total: res.data.total
      })
    })
  }, [page, size, r])




  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120
    },
    {
      title: '用户ID',
      dataIndex: 'uid',
      key: 'uid',
      width: 150,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '反馈时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 220,
      render: (item: any) => (<div style={{fontSize: '12px'}}>{dateTime(item, 'dateTime')}</div>)
    },
  ]




  return (
    <div >
      <div className='paths_top_con frsc'>
        <div style={{marginLeft: '25px'}}>用户反馈</div>
      </div>
      <div>
        <Table
          rowKey={(record:any)=>record.id}
          columns={columns} 
          dataSource={info.list} 
          pagination={{
            total: info.total,
            current: page,
            onChange: (c) => {
              setPage(c)
            },
            pageSize: size,
            showSizeChanger: true,
            onShowSizeChange: (c, s) => {
              setSize(s)
            }
          }}
          scroll={{y: `calc(100vh - 263px)`}}
        />
      </div>

      
    </div>
  )
}

export default FeedBack