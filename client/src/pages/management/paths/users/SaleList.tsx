import React, {useEffect, useState} from "react"
import {useDispatch} from 'react-redux'
import { Button, Table, Modal, Select, Input, Popover, message, Popconfirm, Tag } from "antd"

import IconsList from '@/components/widgets/iconsList/iconsList'
import ExcIcons from "@/components/widgets/iconsList/excIcons"
import TableDownload from '@/components/widgets/TableDownload'

import {fetchGet, fetchPost, fetchPut} from '@/constants/config'

import {dateTime} from '@/utils/timeFormat'

import '../paths.css'


const { Option } = Select


// 销售员 列表
function SaleList() {
  const dispatch = useDispatch()

  const [page, setPage] = useState(1)
  const [size, setSize] = useState<number>(20)
  const [r, setR] = useState(1) //刷新

  const [info, setInfo] = useState({
    list: [],
    loading: true,
    total: 0,
  })
  const [userinfo, setUserinfo] = useState({
    list: [],
    loading: true,
    total: 0,
  })

  const [showModal, setShowModal] = useState(false)
  const [selectId, setSelectId] = useState(0)
  const [selectName, setSelectName] = useState('')


  useEffect(() => {
    setInfo(prev => ({
      ...prev,
      loading: true
    }))
    fetchPost('/management/manage/sale/list', {
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



  // 通过selectId获取当前销售员下面的用户
  useEffect(() => {
    if(selectId){
      fetchGet('/management/manage/sale/users/' + selectId, dispatch).then(res => {
        setUserinfo({
          list: res.data.list,
          loading: false,
          total: res.data.total
        })
      })
    }
  }, [selectId])

  
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 120
    },
    {
      title: '用户',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
      render: (item: any, record:any) => (
        <div className='frsc'>
          <img style={{width: '32px', height: '32px', borderRadius: '16px', marginRight: '10px'}} src={record.avatar_url} />
          <div>{item}</div>
        </div>
      )
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 70,
      render: (item: number) => (
        <div >
          {
            {
              0: (
                <Tag color="orange">未知</Tag>
              ),
              1: (
                <Tag color="blue">男</Tag>
              ),
              2: (
                <Tag color="red">女</Tag>
              ),
            }[item]
          }
        </div>
      )
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 90,
    },
    {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
      width: 110,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 110,
    },
    {
      title: 'openid',
      dataIndex: 'openid',
      key: 'openid',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 100,
      render: (item: any) => (<div style={{fontSize: '12px'}}>{dateTime(item, 'dateTime')}</div>)
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (record: any) => (
        <div className='frsc'>
          <a 
            onClick={() => {
              setShowModal(true)
              setSelectId(record.id)
              setSelectName(record.nickname)
            }}
          >
            查看用户列表
          </a>
        </div>
      )
    }
  ]


  const userColumns = [
    {
      title: '用户ID',
      dataIndex: 'uid',
      key: 'uid',
      width: 70
    },
    {
      title: '用户',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
      render: (item: any, record:any) => (
        <div className='frsc'>
          <img style={{width: '32px', height: '32px', borderRadius: '16px', marginRight: '10px'}} src={record.avatar_url} />
          <div>{item}</div>
        </div>
      )
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 70,
      render: (item: number) => (
        <div >
          {
            {
              0: (
                <Tag color="orange">未知</Tag>
              ),
              1: (
                <Tag color="blue">男</Tag>
              ),
              2: (
                <Tag color="red">女</Tag>
              ),
            }[item]
          }
        </div>
      )
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 90,
    },
    {
      title: '手机',
      dataIndex: 'phone',
      key: 'phone',
      width: 110,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 110,
    },
    {
      title: '加入时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 100,
      render: (item: any) => (<div style={{fontSize: '12px'}}>{dateTime(item, 'dateTime')}</div>)
    },
  ]


  return(
    <div>
      <div className='paths_top_con frsc'>
        <div style={{marginLeft: '25px'}}>共有{info.total}个销售</div>
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

      <Modal 
        title={`销售${selectName}旗下的用户，共${userinfo.total}位`}
        visible={showModal} 
        onOk={() => {
          setShowModal(false)
          setSelectId(0)
          setSelectName('')
        }}
        onCancel={() => {
          setShowModal(false)
          setSelectId(0)
          setSelectName('')
        }}
        width={980}
      >
        <Table
          rowKey={(record:any)=>record.id}
          columns={userColumns} 
          dataSource={userinfo.list}
          pagination={false}
        />
      </Modal>
    </div>
  )
}


export default SaleList


