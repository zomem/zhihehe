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

function Comment() {
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


  useEffect(() => {
    setInfo(prev => ({
      ...prev,
      loading: true
    }))
    fetchPost('/management/product/comment/list', {
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
  const check = (id: any, type: 0 | 2) => {
    fetchPut('/management/product/comment/check', {
      id: id,
      type: type
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
      width: 90
    },
    {
      title: '评论用户',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 160,
      render: (item: any, record:any) => (
        <div className='frsc'>
          <img style={{width: '32px', height: '32px', borderRadius: '16px', marginRight: '10px'}} src={record.avatar_url} />
          <div>{item}</div>
        </div>
      )
    },
    {
      title: '评分(5星)',
      dataIndex: 'star',
      key: 'star',
      width: 120,
      render: (item: any, record:any) => (
        <div 
          style={{
            fontWeight: 'bold',
            color: item <= 2 ? '#f54949' : '#00bd10'
          }}
        >
          {item}
        </div>
      )
    },
    {
      title: '评论内容',
      dataIndex: 'content',
      key: 'content',
      width: 200,
      render: (item: any, record:any) => (
        <div>{item || '已评价'}</div>
      )
    },
    {
      title: '评论图片',
      dataIndex: 'img_urls',
      key: 'img_urls',
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
      width: 250
    },
    {
      title: '评论时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (item: any) => (<div style={{fontSize: '12px'}}>{dateTime(item, 'dateTime')}</div>)
    },
    {
      title: '商品名',
      dataIndex: 'title',
      key: 'title',
      width: 200
    },
    {
      title: '商品图片',
      dataIndex: 'product_imgs',
      key: 'product_imgs',
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
      width: 250
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
              1: (
                <Tag color="orange">待审核</Tag>
              ),
              2: (
                <Tag color="green">已通过</Tag>
              ),
            }[item]
          }
        </div>
      )
    },
    {
      title: '操作',
      key: 'operation',
      width: 150,
      render: (record: any) => (
        <div className='frsc'>
          <a 
            href='#'
            onClick={() => {
              check(record.id, 2)
            }}
          >{checkType === 1 && '通过'}</a>
          <div style={{width: '10px'}} />
          <Popconfirm
            title='确定删除该条评论吗？'
            onConfirm={() => {
              check(record.id, 0)
            }}
          >
            <a href='#' style={{color: '#f54949'}}>删除</a>
          </Popconfirm>
        </div>
      )
    }
  ]



  return(
    <div>
      <Flex flex='frsc' padding='20'>
        <Select defaultValue={1} style={{ width: 120 }} onChange={(value) => setCheckType(value)}>
          <Option value={1}>待审核</Option>
          <Option value={2}>已通过</Option>
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


export default Comment


