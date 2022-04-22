import React, {useEffect, useState} from "react"
import {useDispatch} from 'react-redux'
import { Button, Table, Modal, Select, Input, Popover, message, Popconfirm, Tag, Drawer, Form, InputNumber } from "antd"

import {Line, Flex, Box} from '@/components/widgets/Components'

import IconsList from '@/components/widgets/iconsList/iconsList'
import ExcIcons from "@/components/widgets/iconsList/excIcons"

import {fetchGet, fetchPost, fetchPut} from '@/constants/config'

import '../paths.css'
import { dateTime } from "@/utils/timeFormat"

const { TextArea } = Input
const { Option } = Select

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus']

function ArticleList() {
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
  const [reason, setReason] = useState('')

  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [content, setContent] = useState<{
    value: string
    validateStatus?: ValidateStatus
    errorMsg?: string | null
  }>({
    value: '',
  })
  const [catKey, setCatKey] = useState<any>({}) 

  useEffect(() => {
    fetchGet('/management/system/product_cat/list', dispatch).then(res => {
      let temp = res.data, obj: any = {}
      for(let i = 0; i < temp.length; i++){
        obj[temp[i].id] = temp[i].title
      }
      setCatKey(obj)
    })
  }, [r])

  useEffect(() => {
    setInfo(prev => ({
      ...prev,
      loading: true
    }))
    fetchPost('/management/manage/article/list', {
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


  //通过审核
  const check = (adid: any, pdid: any, type: 0 | 2, r?: string) => {
    fetchPut('/management/manage/article/examine', {
      adid: adid,
      pdid: pdid,
      type: type,
      reason: r
    }, dispatch).then(res => {
      if(res.data.status === 2){
        message.success(res.data.message)
        setR(r => r + 1)
        setShowModal(false)
        setReason('')
      }else{
        message.error(res.data.messgae)
      }
    }, err => {
      setShowModal(false)
      setReason('')
    })
  }



  const onFinish = (values: any) => {

    setLoading(true)
    
    // 编辑功能，但目前未开发，可能非必要
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  }

  
  const columns = [
    {
      title: '审核id',
      dataIndex: 'id',
      key: 'id',
      width: 90
    },
    {
      title: '商品名称',
      dataIndex: 'product_title',
      key: 'product_title',
      width: 120
    },
    {
      title: '商品简介',
      dataIndex: 'product_des',
      key: 'product_des',
      width: 200
    },
    {
      title: '列表图片',
      dataIndex: 'article_img_urls',
      key: 'article_img_urls',
      width: 150,
      render: (item: any) => (
        <div>
          {
            item.map((item2: any, index2: any) => (
              <Popover key={item2 + index2} trigger="click" content={<img src={item2} style={{width: '280px', height: '280px'}} />} title="预览">
                <img src={item2} style={{width: '60px', height: '60px'}} />
              </Popover>
            ))
          }
        </div>
      )
    },
    {
      title: '文章正文',
      dataIndex: 'article_html',
      key: 'article_html',
      width: 150,
      render: (item: any) => (
        <div>
          <Popover overlayStyle={{width: '430px'}} trigger="click" content={<div dangerouslySetInnerHTML={{__html: item}}></div>} title="内容">
            <a href="#">查看正文内容</a>
          </Popover>
        </div>
      )
    },
    {
      title: '零售信息',
      dataIndex: 'product_price',
      key: 'product_price',
      width: 220,
      render: (item: any, record: any) => (
        <div>
          <div style={{fontWeight: 'bold', color: '#f54949'}}>零售价：￥{item.toFixed(2)}</div>
          <div style={{fontWeight: 'bold', color: '#f54949'}}>剩余数量：{record.product_quantity}</div>
          <div style={{fontWeight: 'bold'}}>成本：￥{record.product_cost}</div>
          <div style={{fontWeight: 'bold'}}>销售分成：￥{record.product_sale_cost}</div>
          <div style={{fontWeight: 'bold'}}>总销售分成：￥{record.product_f_sale_cost}</div>
        </div>
      )
    },
    {
      title: '团购信息',
      dataIndex: 'product_group_price',
      key: 'product_group_price',
      width: 260,
      render: (item: any, record: any) => (
        <div>
          {
            record.product_can_group === 1 ?
            <div>
              <div style={{fontWeight: 'bold', color: '#00bd10'}}>开启团购：是</div>
              <div style={{fontWeight: 'bold', color: '#00bd10'}}>团购价：￥{item ? item.toFixed(2) : '0.00'}</div>
              <div style={{fontWeight: 'bold', color: '#00bd10'}}>剩余数量：{record.product_group_quantity}</div>
              <div style={{fontWeight: 'bold', color: '#00bd10'}}>截止时间：{dateTime(record.product_group_end, 'dateTime')}</div>
            </div>
            :
            <div>
              <div style={{fontWeight: 'bold'}}>开启团购：否</div>
              <div style={{fontWeight: 'bold'}}>团购价：￥{item ? item.toFixed(2) : '0.00'}</div>
              <div style={{fontWeight: 'bold'}}>剩余数量：{record.product_group_quantity}</div>
            </div>
          }
          <div style={{fontWeight: 'bold'}}>成本：￥{record.product_group_cost}</div>
          <div style={{fontWeight: 'bold'}}>销售分成：￥{record.product_group_sale_cost}</div>
          <div style={{fontWeight: 'bold'}}>总销售分成：￥{record.product_group_f_sale_cost}</div>
        </div>
      )
    },
    {
      title: '开启送礼',
      dataIndex: 'product_can_gift',
      key: 'product_can_gift',
      width: 120,
      render: (item: any) => (
        <div >
          {item === 1 ?
            <Tag color="red">是</Tag>
            :
            <Tag color="default">否</Tag>
          }
        </div>
      )
    },
    {
      title: '转发图片',
      dataIndex: 'product_img_urls',
      key: 'product_img_urls',
      render: (item: any) => (
        <div>
          {
            item.map((item2: any, index2: any) => (
              <Popover key={item2 + index2} trigger="click" content={<img src={item2} style={{width: '280px', height: '280px'}} />} title="预览">
                <img src={item2} style={{width: '60px', height: '60px'}} />
              </Popover>
            ))
          }
        </div>
      ),
      width: 150
    },
    {
      title: '商品类别',
      dataIndex: 'product_cat_id',
      key: 'product_cat_id',
      width: 120,
      render: (item: any) => (<div>{catKey[item]}</div>)
    },
    {
      title: '寄件信息',
      dataIndex: 'product_name',
      key: 'product_name',
      width: 260,
      render: (item: any, record: any) => (
        <div>
          <div>{item}</div>
          <div>{record.product_mobile}</div>
          <div style={{fontSize: '12px'}}>
            {record.product_province + record.product_city + record.product_area + record.product_addr}
          </div>
        </div>
      )
    },
    {
      title: '规格',
      dataIndex: 'product_weight',
      key: 'product_weight',
      width: 160,
      render: (item: any, record: any) => (
        <div>
          <div>重量：{item}kg</div>
          <div>长：{record.product_space_x}cm</div>
          <div>宽：{record.product_space_y}cm</div>
          <div>高：{record.product_space_z}cm</div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (item: number) => (
        <div >
          {
            {
              5: (
                <Tag color="red">未通过</Tag>
              ),
              10: (
                <Tag color="orange">待审核</Tag>
              ),
              20: (
                <Tag color="green">已通过</Tag>
              ),
              6: (
                <Tag color="purple">已下架</Tag>
              ),
            }[item]
          }
        </div>
      )
    },
    {
      title: '货源链接',
      dataIndex: 'product_goods_url',
      key: 'product_goods_url',
      width: 230,
      render: (item: string) => (
        <a target='_blank' href={item}>{item}</a>
      )
    },
    {
      title: '未通过原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 220
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      render: (record: any) => (
        <div className='frsc'>
          {/* <div
            onClick={() => setShowDrawer(true)}
          >
            <a href="#">编辑</a>
          </div> */}
          <div style={{width: '10px'}} />
          <Popconfirm
            title='确定通过吗？'
            onConfirm={() => {
              check(record.id, record.pdid, 2)
            }}
          >
            <a href='#'>{(checkType !== 20 && checkType !== 6) && '通过'}</a>
          </Popconfirm>
          <div style={{width: '10px'}} />
          <div
            onClick={() => setShowModal(true)}
          >
            <a href="#" style={{color: '#8a8a8a'}}>{checkType === 10 && '拒绝'}</a>
          </div>
          <Modal 
            title="拒绝原因"
            visible={showModal}
            onOk={() => {
              if(!reason) return message.warning('请输入拒绝原因')
              check(record.id, record.pdid, 0, reason)
            }} 
            onCancel={() => setShowModal(false)}
          >
            <TextArea
              placeholder="请输入拒绝通过的原因"
              value={reason}
              allowClear
              onChange={(e) => {
                setReason(e.target.value)
              }}
            />
          </Modal>
        </div>
      )
    }
  ]



  return(
    <div>
      <Flex flex='frsc' padding='20'>
        <Select defaultValue={10} style={{ width: 120 }} onChange={(value) => setCheckType(value)}>
          <Option value={10}>待审核</Option>
          <Option value={20}>已通过</Option>
          <Option value={5}>未通过</Option>
          <Option value={6}>已下架</Option>
        </Select>
      </Flex>
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


export default ArticleList


