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



function TradeList() {
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

  const [showModal, setShowModal] = useState(false)
  const [expressNo, setExpressNo] = useState('')
  const [selectId, setSelectId] = useState(0)


  useEffect(() => {
    setInfo(prev => ({
      ...prev,
      loading: true
    }))
    fetchPost('/management/manage/trade/list', {
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


  //通过审核  expressNo
  const sendOut = (tid:number, express_no:string) => {
    fetchPut('/management/manage/trade/send_out', {
      tid: tid,
      express_no: express_no,
    }, dispatch).then(res => {
      if(res.data.status === 2){
        message.success(res.data.message)
        setR(r => r + 1)
        setShowModal(false)
        setExpressNo('')
      }else{
        message.error(res.data.messgae)
        setExpressNo('')
      }
    }, err => {
      setShowModal(false)
      setExpressNo('')
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
      title: '订单号',
      dataIndex: 'trade_no',
      key: 'trade_no',
      width: 200,
      render: (item: any) => (<div style={{fontSize: '12px'}}>{item}</div>)
    },
    {
      title: '买家',
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
      title: '商品名称',
      dataIndex: 'title',
      key: 'title',
      width: 120,
    },
    {
      title: '商品图片',
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
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (item: any) => (<div>￥{item}</div>)
    },
    {
      title: '购买数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
    },
    {
      title: '合计',
      dataIndex: 'total_price',
      key: 'total_price',
      width: 120,
      render: (item: any) => (<div style={{fontWeight: 'bold', color: '#f54949'}}>￥{item}</div>)
    },
    {
      title: '运单号',
      dataIndex: 'express_no',
      key: 'express_no',
      width: 190,
      render: (item: any) => (<div style={{fontWeight: 'bold'}}>{item}</div>)
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
      dataIndex: 'trade_status',
      key: 'trade_status',
      width: 80,
      render: (item: number) => (
        <div >
          {
            {
              5: (
                <Tag color="red">待支付</Tag>
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
              1: (
                <Tag color="default">已退货</Tag>
              ),
            }[item]
          }
        </div>
      )
    },
    {
      title: '订单时间',
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
      title: '货源链接',
      dataIndex: 'goods_url',
      key: 'goods_url',
      width: 230,
      render: (item: string) => (
        <a target='_blank' href={item}>{item}</a>
      )
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (record: any) => (
        <div className='frsc'>
          <a 
            href="#" 
            onClick={() => {
              setSelectId(record.id)
              setShowModal(true)
            }}
          >
            {checkType === 10 && '发货'}
          </a>
          {/* <Popconfirm
            title='确定已完成吗？'
            onConfirm={() => {
              
            }}
          >
            <a href="#" >{checkType === 15 && '完成'}</a>
          </Popconfirm> */}

          <Modal 
            title="快递单号"
            visible={showModal}
            onOk={() => {
              if(!expressNo) return message.warning('请输入快递单号')
              if(selectId === 0) return message.warning('请选择订单')
              sendOut(selectId, expressNo)
            }} 
            onCancel={() => {
              setSelectId(0)
              setShowModal(false)
            }}
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
        <Select defaultValue={10} style={{ width: 120 }} onChange={(value) => setCheckType(value)}>
          <Option value={10}>待发货</Option>
          <Option value={15}>待收货</Option>
          <Option value={20}>已完成</Option>
          <Option value={5}>待支付</Option>
          <Option value={3}>已取消</Option>
          <Option value={1}>已退货</Option>
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


export default TradeList


