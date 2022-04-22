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



function ShareList() {
  const dispatch = useDispatch()

  const [page, setPage] = useState(1)
  const [size, setSize] = useState<number>(20)
  const [r, setR] = useState(1) //刷新

  const [info, setInfo] = useState({
    list: [],
    loading: true,
    total: 0,
  })
  const [checkType, setCheckType] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [expressNo, setExpressNo] = useState('')


  useEffect(() => {
    setInfo(prev => ({
      ...prev,
      loading: true
    }))
    fetchPost('/management/manage/share/list', {
      page: page,
      limit: size,
      type: checkType
    }, dispatch).then(res => {
      setInfo({
        list: res.data.list,
        loading: false,
        total: res.data.total
      })
    })
  }, [page, size, r, checkType])



  
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 90
    },
    {
      title: '分成者',
      dataIndex: 'account',
      key: 'account',
      width: 160,
      render: (item: any, record:any) => (
        <div>
          {
            record.share_nickname ?
            <div className='frsc'>
              <img style={{width: '32px', height: '32px', borderRadius: '16px', marginRight: '10px'}} src={record.share_avatar} />
              <div>{record.share_nickname}</div>
            </div>
            :
            <div>{item}</div>
          }
        </div>
      )
    },
    {
      title: '分成者类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (item: any) => (
        <div>
          {item === 'PERSONAL_OPENID' ? '个人微信' : item === 'QUOTER_OPENID' ? '报价员微信' : '商户号'}
        </div>
      )
    },
    {
      title: '分成（元）',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (item: any, record: any) => (
        <div style={{fontWeight: 'bold', color: record.share_status === 2 ? '#0dba13' : '#f54949'}}>
          ￥{(item / 100).toFixed(2)}
        </div>
      )
    },
    {
      title: '分成描述',
      dataIndex: 'description',
      key: 'description',
      width: 250,
    },
    {
      title: '是否团购',
      dataIndex: 'is_group',
      key: 'is_group',
      width: 100,
      render: (item: number) => (
        <div >
          {item === 1 ?
            <Tag color="blue">是</Tag>
            :
            <Tag color="default">否</Tag>
          }
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'share_status',
      key: 'share_status',
      width: 80,
      render: (item: number) => (
        <div >
          {
            {
              1: (
                <Tag color="red">待分成</Tag>
              ),
              2: (
                <Tag color="green">已分成</Tag>
              ),
            }[item]
          }
        </div>
      )
    },
    {
      title: '分成订单号',
      dataIndex: 'out_order_no',
      key: 'out_order_no',
      width: 200,
      render: (item: any) => (<div style={{fontSize: '12px'}}>{item}</div>)
    },
    {
      title: '微信交易号',
      dataIndex: 'transaction_id',
      key: 'transaction_id',
      width: 250,
      render: (item: any) => (<div style={{fontSize: '12px'}}>{item}</div>)
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'create_at',
      width: 160,
      render: (item: any) => (<div style={{fontSize: '12px'}}>{dateTime(item, 'dateTime')}</div>)
    },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      render: (record: any) => (
        <div className='frsc'>
          <Popconfirm
            title='确定发货吗？'
            onConfirm={() => {
             
            }}
          >
            <a href="#" >{checkType === 10 && '发货'}</a>
          </Popconfirm>

          <Modal 
            title="快递单号"
            visible={showModal}
            onOk={() => {
              if(!expressNo) return message.warning('请输入快递单号')
              // sendOut(record.id, record.express_no)
            }} 
            onCancel={() => setShowModal(false)}
          >
            <Input
              placeholder="请输入快递单号"
              value={expressNo}
              allowClear
              onChange={(e) => {
                setExpressNo(e.target.value)
              }}
            />
          </Modal>
        </div>
      )
    }
  ]



  return(
    <div>
      <div className='paths_top_con frsc'>
        <Select defaultValue={1} style={{ width: 120 }} onChange={(value) => setCheckType(value)}>
          <Option value={1}>待分成</Option>
          <Option value={2}>已分成</Option>
        </Select>
        <div style={{marginLeft: '25px'}}>合计{info.total}条</div>
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


export default ShareList


