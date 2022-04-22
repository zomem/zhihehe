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



export default () => {
  const dispatch = useDispatch()

  const [page, setPage] = useState(1)
  const [size, setSize] = useState<number>(20)
  const [r, setR] = useState(1) //刷新

  const [info, setInfo] = useState({
    list: [],
    loading: true,
    total: 0,
  })
  const [checkType, setCheckType] = useState(10)

  useEffect(() => {
    setInfo(prev => ({
      ...prev,
      loading: true
    }))
    fetchPost('/management/manage/gift/gift_picked_list', {
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


  
  // 已完成
  const sendOut = (gpid:number, express_no:string) => {
    fetchPut('/management/manage/gift/picked_send_out', {
      gpid: gpid,
    }, dispatch).then(res => {
      if(res.data.status === 2){
        message.success(res.data.message)
        setR(r => r + 1)
      }else{
        message.error(res.data.messgae)
      }
    }, err => {
    })
  }



  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      width: 120
    },
    {
      title: '领取单号',
      dataIndex: 'picked_no',
      key: 'picked_no',
      width: 200,
      render: (item: any) => (<div style={{fontSize: '12px'}}>{item}</div>)
    },
    {
      title: '领取人',
      dataIndex: 'user_nickname',
      key: 'user_nickname',
      width: 160,
      render: (item: any, record:any) => (
        <div className='frsc'>
          <img style={{width: '32px', height: '32px', borderRadius: '16px', marginRight: '10px'}} src={record.user_avatar} />
          <div>{item}</div>
        </div>
      )
    },
    {
      title: '礼品名称',
      dataIndex: 'title',
      key: 'title',
      width: 120,
    },
    {
      title: '礼品图片',
      dataIndex: 'cover_url',
      key: 'cover_url',
      width: 120,
      render: (item: any) => (
        <div>
          <Popover key={item} trigger="click" content={<img src={item} style={{width: '280px', height: '280px'}} />} title="预览">
            <img src={item} style={{width: '60px', height: '60px'}} />
          </Popover>
        </div>
      )
    },
    {
      title: '验证的手机',
      dataIndex: 'verify_phone',
      key: 'verify_phone',
      width: 200,
      render: (item: any, record: any) => (
        <div>
          <div>{item}</div>
        </div>
      )
    },
    {
      title: '收件信息',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (item: any, record: any) => (
        <div>
          <div>{item}</div>
          <div>{record.phone}</div>
          <div style={{fontSize: '12px'}}>{record.address}</div>
        </div>
      )
    },
    {
      title: '运单号',
      dataIndex: 'express_no',
      key: 'express_no',
      width: 190,
      render: (item: any) => (<div style={{fontWeight: 'bold'}}>{item}</div>)
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (item: any) => (<div>￥{item}</div>)
    },
    {
      title: '领取数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: '合计',
      dataIndex: 'total_price',
      key: 'total_price',
      width: 120,
      render: (item: any) => (<div style={{fontWeight: 'bold', color: '#f54949'}}>￥{item}</div>)
    },
    {
      title: '报价员',
      dataIndex: 'business_nickname',
      key: 'business_nickname',
      width: 160,
      render: (item: any, record:any) => (
        <div className='frsc'>
          <img style={{width: '32px', height: '32px', borderRadius: '16px', marginRight: '10px'}} src={record.business_avatar} />
          <div>{item}</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'gift_trade_status',
      key: 'gift_trade_status',
      width: 100,
      render: (item: number) => (
        <div >
          {
            {
              5: (
                <Tag color="red">待支付</Tag>
              ),
              8: (
                <Tag color="red">待确认发货</Tag>
              ),
              10: (
                <Tag color="gold">待发货</Tag>
              ),
              15: (
                <Tag color="blue">待收货</Tag>
              ),
              20: (
                <Tag color="lime">已完成</Tag>
              ),
              3: (
                <Tag color="default">已取消</Tag>
              ),
            }[item]
          }
        </div>
      )
    },
    {
      title: '领取时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (item: any) => (<div style={{fontSize: '12px'}}>{dateTime(item, 'dateTime')}</div>)
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 120,
      render: (item: any) => (<div style={{fontSize: '12px'}}>{dateTime(item, 'dateTime')}</div>)
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (record: any) => (
        <div className='frsc'>
          <Popconfirm
            title='确定发货吗？'
            onConfirm={() => {
              sendOut(record.id, '')
            }}
          >
            <a href="#" >{checkType === 10 && '发货'}</a>
          </Popconfirm>
        </div>
      )
    }
  ]


  return(
    <div>
      <div className='paths_top_con frsc'>
        <Select defaultValue={10} style={{ width: 120 }} onChange={(value) => setCheckType(value)}>
          <Option value={20}>已完成</Option>
          <Option value={15}>待收货</Option>
          <Option value={10}>待发货</Option>
          <Option value={8}>待确认发货</Option>
        </Select>
        <div style={{marginLeft: '25px'}}>合计{info.total}条</div>
        <div style={{marginLeft: '25px'}}>
          <TableDownload
            execlTitle={`订单_${dateTime(new Date().toString(), 'dateTime')}`}
            selectedUrl={'/management/manage/trade/list'}
            body={{isExcel: 1, type: checkType}}
          />
        </div>
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

