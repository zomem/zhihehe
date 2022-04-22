import React, {useEffect, useState} from "react"
import {useDispatch, useSelector} from 'react-redux'
import BraftEditor from 'braft-editor'
import {Button, Upload, Table, DatePicker, Select, Input, Popover, message, Popconfirm, Tag, Drawer, InputNumber, Switch} from "antd"
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'

import {Line, Flex, Box, Text} from '@/components/widgets/Components'

import IconsList from '@/components/widgets/iconsList/iconsList'
import ExcIcons from "@/components/widgets/iconsList/excIcons"
// 引入编辑器样式

import {fetchGet, fetchPost, CONFIG_DATA, fetchPut, fetchUpload} from '@/constants/config'
import {isPhone, isPrice} from '@/utils/veriInfo'
import {salePrice} from '@/utils/filter'
import useStyles from "@/hooks/useStyles"
import {dateTime} from '@/utils/timeFormat'
import {braftHtmlCorrect, braftHtmlCorrectRe} from '@/utils/utils'

import 'braft-editor/dist/index.css'
import '../paths.css'

const { TextArea } = Input
const { Option } = Select



interface EditProps {
  dpid: number
  goods_url: string
  title: string
  des: string
  img_urls: string[]
  img_paths: string[]
  quantity: string
  cost: string
  sale_cost: string
  f_sale_cost: string
  name: string
  mobile: string
  company: string
  province: string
  city: string
  area: string
  addr: string
  weight: number
  space_x: number
  space_y: number
  space_z: number
  cat_id: number
  can_gift: number
  can_group: number
  group_end: string
  group_quantity: string
  group_cost: string
  group_sale_cost: string
  group_f_sale_cost: string
  daid: number
  a_img_urls: string[]
  a_img_paths: string[]
  a_html: any
}


const initEdit = {
  dpid: 0,
  title: '',
  goods_url: '',
  des: '',
  img_urls: [],
  img_paths: [],
  quantity: '',
  cost: '',
  sale_cost: '',
  f_sale_cost: '',

  name: '',
  mobile: '',
  company: '',
  province: '',
  city: '',
  area: '',
  addr: '',
  weight: 1,
  space_x: 15,
  space_y: 15,
  space_z: 15,
  cat_id: 0,
  can_gift: 0,

  can_group: 0,
  group_end: new Date().toUTCString(),
  group_quantity: '',
  group_cost: '',
  group_sale_cost: '',
  group_f_sale_cost: '',

  daid: 0,
  a_img_urls: [],
  a_img_paths: [],
  a_html: BraftEditor.createEditorState(null),
}
function ArticleList() {
  const dispatch = useDispatch()
  const {currentUser} = useSelector((state: IRootStore) => state)
  const [styles, setStyles] = useState<UseStyle>({})

  const [page, setPage] = useState(1)
  const [size, setSize] = useState<number>(20)
  const [r, setR] = useState(1) //刷新
  const [showDrawer, setShowDrawer] = useState(false)

  const [info, setInfo] = useState({
    list: [],
    loading: true,
    total: 0,
  })
  const [checkType, setCheckType] = useState(10)

  const [loading, setLoading] = useState(false)
  

  const [catKey, setCatKey] = useState<any>({}) 

  const [selectInfo, setSelectInfo] = useState<{id: number,type:'online' | 'draft'}>({
    id: 0,
    type: 'draft'
  })
  const [edit, setEdit] = useState<EditProps>(initEdit)
  const [percent, setPercent] = useState<number>(1.20)  //获取售价百分比
  const [productCat, setProductCat] = useState<any>([])

  const [addressObjs, setAddressObjs] = useState<any>({
    province: [],
    city: [],
    area: [],
  })

  useStyles((values) => {
    setStyles(values)
  })


  // 我发布的商品列表
  useEffect(() => {
    setInfo(prev => ({
      ...prev,
      loading: true
    }))
    fetchPost('/management/product/busi_list', {
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

  useEffect(() => {
    fetchGet('/management/product/price/percent', dispatch).then(res => {
      setPercent(res.data.percent || 1.20)
    })
    fetchGet('/management/product/product_cat/list', dispatch).then(res => {
      setProductCat(res.data)
    })
  }, [])
  
  useEffect(() => {
    fetchGet('/management/system/product_cat/list', dispatch).then(res => {
      let temp = res.data, obj: any = {}
      for(let i = 0; i < temp.length; i++){
        obj[temp[i].id] = temp[i].title
      }
      setCatKey(obj)
    })
  }, [r])



  // 首先获取省份列表
  useEffect(() => {
    fetchGet('/common/address/list/1/0', dispatch).then(res => {
      setAddressObjs((prev: any) => ({
        ...prev,
        province: res.data
      }))
    })
  }, [])
  // 选择省市后，获取市列表
  const onCityList = (id: string) => {
    fetchGet('/common/address/list/2/' + id, dispatch).then(res => {
      setAddressObjs((prev: any) => ({
        ...prev,
        city: res.data
      }))
    })
  }
  // 选择省市后，获取区
  const onAreaList = (id: string) => {
    fetchGet('/common/address/list/3/' + id, dispatch).then(res => {
      setAddressObjs((prev: any) => ({
        ...prev,
        area: res.data
      }))
    })
  }


  // 如果selectId存在，则添加编辑信息
  useEffect(() => {
    if(selectInfo.id){
      fetchPost('/management/product/edit_init', {
        taid: selectInfo.id,
        atype: selectInfo.type
      }, dispatch).then(res => {
        setEdit({
          dpid: res.data.dpid,
          title: res.data.title,
          goods_url: res.data.goods_url,
          des: res.data.des,
          img_urls: res.data.img_urls,
          img_paths: res.data.img_paths,
          quantity: res.data.quantity.toString(),
          cost: res.data.cost.toString(),
          sale_cost: res.data.sale_cost.toString(),
          f_sale_cost: res.data.f_sale_cost.toString(),
          name: res.data.name,
          mobile: res.data.mobile,
          company: res.data.company,
          province: res.data.province,
          city: res.data.city,
          area: res.data.area,
          addr: res.data.addr,
          weight: res.data.weight || 1,
          space_x: res.data.space_x || 15,
          space_y: res.data.space_y || 15,
          space_z: res.data.space_z || 15,
          cat_id: res.data.cat_id,
          can_gift: res.data.can_gift,

          can_group: res.data.can_group || 0,
          group_end: res.data.group_end ? dateTime(res.data.group_end, 'dateTime') as string : new Date().toUTCString(),
          group_quantity: res.data.group_quantity ? res.data.group_quantity.toString() : '0',
          group_cost: res.data.group_cost ? res.data.group_cost.toString() : '0',
          group_sale_cost: res.data.group_sale_cost ? res.data.group_sale_cost.toString() : '0',
          group_f_sale_cost: res.data.group_f_sale_cost ? res.data.group_f_sale_cost.toString() : '0',
          
          daid: res.data.daid,
          a_img_urls: res.data.a_img_urls,
          a_img_paths: res.data.a_img_paths,
          a_html: BraftEditor.createEditorState(braftHtmlCorrectRe(res.data.a_html)),
        })
      })
    }
  }, [selectInfo.id, selectInfo.type])



  const onFinish = () => {
    
    // 编辑功能，但目前未开发，可能非必要

    if(!edit.title){
      return message.error('请输入商品名称')
    }
    if(!edit.des){
      return message.error('请输入商品简介')
    }
    if(edit.cat_id <= 0){
      return message.error('请选择商品分类')
    }
    if(!edit.cost){
      return message.error('请输入成本')
    }
    if(!edit.sale_cost){
      return message.error('请输入销售分成')
    }
    if(!edit.f_sale_cost){
      return message.error('请输入总销售分成')
    }
    if(!edit.quantity){
      return message.error('请输入数量')
    }


    if(edit.can_group === 1){
      if(!edit.group_cost){
        return message.error('请输入团购成本')
      }
      if(!edit.group_sale_cost){
        return message.error('请输入团购销售分成')
      }
      if(!edit.group_f_sale_cost){
        return message.error('请输入团购总销售分成')
      }
      if(!edit.group_quantity){
        return message.error('请输入团购数量')
      }
      if(!isPrice(edit.group_cost) || !isPrice(edit.group_sale_cost) || !isPrice(edit.group_f_sale_cost)){
        return message.error('上面的价格有格式错误')
      }
      if(!edit.group_end){
        return message.error('请输入团购截止时间')
      }
    }


    if(edit.a_img_paths.length === 0){
      return message.error('请上传封面图')
    }
    if(edit.img_paths.length === 0){
      return message.error('请上传分享图片')
    }
    if(edit.a_html.toRAW(true).blocks.length <= 1){
      return message.error('请输入详情内容，且不得少于一行')
    }

    if(edit.mobile){
      if(!isPhone(edit.mobile)){
        return message.error('寄件人手机号有误')
      }
      if(!edit.addr){
        return message.error('寄件地址不能为空')
      }
    }

    if(loading) return
    setLoading(true)
    fetchPost('/management/product/add', {
      ...edit,
      img_paths: edit.img_paths.toString()
    }, dispatch).then(res => {
      if(res.data.status === 2){
        fetchPost('/management/product/article/add', {
          daid: edit.daid,
          html: braftHtmlCorrect(edit.a_html.toHTML()),
          product_draft_id: res.data.id,
          img_paths: edit.a_img_paths.toString()
        }, dispatch).then(res2 => {
          setLoading(false)
          if(res2.data.status === 2){
            setShowDrawer(false)
            setEdit(initEdit)
            setSelectInfo({
              id: 0,
              type: 'draft'
            })
            setR(prev => prev + 1)
            message.success(res2.data.message)
          }else{
            message.success(res2.data.message)
          }
        }, err => {setLoading(false)})
      }else{
        message.error(res.data.message)
        setLoading(false)
      }
    }, err => {setLoading(false)})


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
      title: '未通过原因',
      dataIndex: 'reason',
      key: 'reason',
      width: 220
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
      title: '操作',
      key: 'operation',
      width: 150,
      render: (record: any) => (
        <div className='frsc'>
          <div
            onClick={() => {
              setSelectInfo({
                id: record.id,
                type: (checkType === 20 || checkType === 6) ? 'online' : 'draft'
              })
              setShowDrawer(true)
            }}
          >
            <a href="#">编辑</a>
          </div>
          <div style={{width: '10px'}} />
          <div
           onClick={() => {
            changeSale(record.id)
           }}
          >
            <a href='#'>{checkType === 20 ? '下架' : checkType === 6 ? '上架' : ''}</a>
          </div>
        </div>
      )
    }
  ]

  function beforeUploadmin(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('仅支持 jpg/png 格式的图片')
    }
    const isLt1M = file.size / 1024 / 1024 < 0.20
    if (!isLt1M) {
      message.error('图片必须小于200KB')
    }
    return isJpgOrPng && isLt1M
  }


  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setEdit(prev => ({
        ...prev,
        a_img_urls: [info.file.response.url],
        a_img_paths: [info.file.response.path]
      }))
    }
  }
  const handleChange2 = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      setEdit(prev => ({
        ...prev,
        img_urls: [info.file.response.url],
        img_paths: [info.file.response.path]
      }))
    }
  }

  const uploadButton = (
    <div>
      {false ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  )


  // 富文本的文件上传
  const myUploadFn = (param: any) => {
    fetchUpload('/upload/mana/article', param.file, dispatch).then(res => {
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: res.data.url,
        meta: {
          title: '内容图片',
          alt: '商品内容图片',
          style: {width: '100%'},
          loop: true, // 指定音视频是否循环播放
          controls: true, // 指定音视频是否显示控制栏
        }
      })
    })
  }
  
  // 上架，下架操作
  const changeSale = (aid: number) => {
    fetchPut('/management/product/change/sale', {aid}, dispatch).then(res => {
      if(res.data.status === 2){
        message.success('操作成功')
        setR(r + 1)
      }
    })
  }


  return(
    <div>
      <Flex flex='frsc' padding='20'>
        <Button 
          type="primary"
          onClick={() => {
            setShowDrawer(true)
            setEdit(initEdit)
            setSelectInfo({
              id: 0,
              type: 'draft'
            })
          }} 
        >
          新增
        </Button>
        <Line size='20 1' />
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


      <Drawer
        title="新增页面"
        placement="right"
        closable={false}
        width={680}
        onClose={() => {
          setShowDrawer(false)
        }}
        visible={showDrawer}
      >
        <Flex flex='frbc' size='100% auto' margin='0 0 20 0'>
          <Flex flex='fcbs' size='100% auto'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>货源链接</Text>
            </Box>
            <Input 
              placeholder='请输入货源链接'
              value={edit.goods_url}
              onChange={(e) => {
                setEdit(prev => ({
                  ...prev,
                  goods_url: e.target.value
                }))
              }}
            />
          </Flex>
        </Flex>
        <Flex flex='frbc' size='100% auto' margin='0 0 20 0'>
          <Flex flex='fcbs' size='45% auto'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>商品名</Text>
            </Box>
            <Input 
              placeholder='请输入商品名称'
              value={edit.title}
              onChange={(e) => {
                setEdit(prev => ({
                  ...prev,
                  title: e.target.value
                }))
              }}
            />
          </Flex>
          <Flex flex='frbc' size='45% auto'>
            <Text fontSize={styles.textSmall} color={styles.textColorMain}>开启送礼</Text>
            {/* <Switch
              checked={edit.can_gift === 1 ? true : false}
              onChange={(value) => {
                setEdit(prev => ({
                  ...prev,
                  can_gift: value ? 1 : 0
                }))
              }}
            /> */}
          </Flex>
        </Flex>

        <Flex flex='frbc' size='100% auto' margin='0 0 20 0'>
          <Flex flex='fcbs' size='45% auto'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>商品简介</Text>
            </Box>
            <Input 
              placeholder='请输入商品简介'
              value={edit.des}
              onChange={(e) => {
                setEdit(prev => ({
                  ...prev,
                  des: e.target.value
                }))
              }}
            />
          </Flex>
          <Flex flex='fcbs' size='45% auto'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>商品分类</Text>
            </Box>
            <Select
              value={edit.cat_id}
              style={{ width: 160 }}
              onChange={(value) => {
                setEdit(prev => ({
                  ...prev,
                  cat_id: value
                }))
              }}
            >
              {
                productCat.map((item: any) => (
                  <Option value={item.id} key={item.id}>{item.title}</Option>
                ))
              }
            </Select>
          </Flex>
        </Flex>


        <Flex flex='frbc' size='100% auto' margin='0 0 20 0'>
          <Flex flex='fcbs' size='25% auto'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>报价员成本(元)</Text>
            </Box>
            <InputNumber 
              style={{ width: '100%' }}
              defaultValue='0'
              min="0"
              max="10000"
              step="0.01"
              value={edit.cost}
              formatter={value => `￥ ${value}`}
              onChange={(value) => {
                setEdit(prev => ({
                  ...prev,
                  cost: `${value}`
                }))
              }}
            />
          </Flex>
          <Flex flex='fcbs' size='25% auto'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>总销售分成(元)</Text>
            </Box>
            <InputNumber 
              style={{ width: '100%' }}
              defaultValue='0'
              min="0"
              max="10000"
              step="0.01"
              value={edit.f_sale_cost}
              formatter={value => `￥ ${value}`}
              onChange={(value) => {
                setEdit(prev => ({
                  ...prev,
                  f_sale_cost: `${value}`
                }))
              }}
            />
          </Flex>
          <Flex flex='fcbs' size='25% auto'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>销售分成(元)</Text>
            </Box>
            <InputNumber 
              style={{ width: '100%' }}
              defaultValue='0'
              min="0"
              max="10000"
              step="0.01"
              value={edit.sale_cost}
              formatter={value => `￥ ${value}`}
              onChange={(value) => {
                setEdit(prev => ({
                  ...prev,
                  sale_cost: `${value}`
                }))
              }}
            />
          </Flex>
        </Flex>


        <Flex flex='frsc' size='100% auto' margin='0 0 20 0'>
          <Flex flex='fcbs' size='25% auto' margin='0 77 0 0'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>数量</Text>
            </Box>
            <InputNumber 
              style={{ width: '100%' }}
              defaultValue='0'
              min="0"
              max="1000"
              step="1"
              value={edit.quantity}
              formatter={value => `${value} 件`}
              onChange={(value) => {
                setEdit(prev => ({
                  ...prev,
                  quantity: `${value}`
                }))
              }}
            />
          </Flex>
          <Flex flex='fcbs' size='25% auto'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>售价(元)</Text>
            </Box>
            <Box size='auto 32'>
              <Text fontSize={styles.textNormal} color={styles.red} fontWeight='bold'>
                ￥{salePrice(parseFloat(edit.cost || '0'), parseFloat(edit.f_sale_cost || '0'), parseFloat(edit.sale_cost || '0'), percent).toFixed(2)}
              </Text>
            </Box>
          </Flex>
        </Flex>


        <Flex flex='frec' size='100% auto' margin='0 0 20 0'>
          <Flex flex='frbc' size='45% auto'>
            <Text fontSize={styles.textSmall} color={styles.textColorMain}>开启团购</Text>
            <Switch
              checked={edit.can_group === 1 ? true : false}
              onChange={(value) => {
                setEdit(prev => ({
                  ...prev,
                  can_group: value ? 1 : 0
                }))
              }}
            />
          </Flex>
        </Flex>
        {
          edit.can_group === 1 &&
          <Box >
            <Flex flex='frbc' size='100% auto' margin='0 0 20 0'>
              <Flex flex='fcbs' size='25% auto'>
                <Box margin='0 0 5 0'>
                  <Text fontSize={styles.textSmall} color={styles.textGray}>团购报价员成本(元)</Text>
                </Box>
                <InputNumber 
                  style={{ width: '100%' }}
                  defaultValue='0'
                  min="0"
                  max="10000"
                  step="0.01"
                  value={edit.group_cost}
                  formatter={value => `￥ ${value}`}
                  onChange={(value) => {
                    setEdit(prev => ({
                      ...prev,
                      group_cost: `${value}`
                    }))
                  }}
                />
              </Flex>
              <Flex flex='fcbs' size='25% auto'>
                <Box margin='0 0 5 0'>
                  <Text fontSize={styles.textSmall} color={styles.textGray}>团购总销售分成(元)</Text>
                </Box>
                <InputNumber 
                  style={{ width: '100%' }}
                  defaultValue='0'
                  min="0"
                  max="10000"
                  step="0.01"
                  value={edit.group_f_sale_cost}
                  formatter={value => `￥ ${value}`}
                  onChange={(value) => {
                    setEdit(prev => ({
                      ...prev,
                      group_f_sale_cost: `${value}`
                    }))
                  }}
                />
              </Flex>
              <Flex flex='fcbs' size='25% auto'>
                <Box margin='0 0 5 0'>
                  <Text fontSize={styles.textSmall} color={styles.textGray}>团购销售分成(元)</Text>
                </Box>
                <InputNumber 
                  style={{ width: '100%' }}
                  defaultValue='0'
                  min="0"
                  max="10000"
                  step="0.01"
                  value={edit.group_sale_cost}
                  formatter={value => `￥ ${value}`}
                  onChange={(value) => {
                    setEdit(prev => ({
                      ...prev,
                      group_sale_cost: `${value}`
                    }))
                  }}
                />
              </Flex>
            </Flex>


            <Flex flex='frsc' size='100% auto' margin='0 0 20 0'>
              <Flex flex='fcbs' size='25% auto' margin='0 77 0 0'>
                <Box margin='0 0 5 0'>
                  <Text fontSize={styles.textSmall} color={styles.textGray}>团购数量</Text>
                </Box>
                <InputNumber 
                  style={{ width: '100%' }}
                  defaultValue='0'
                  min="0"
                  max="1000"
                  step="1"
                  value={edit.group_quantity}
                  formatter={value => `${value} 件`}
                  onChange={(value) => {
                    setEdit(prev => ({
                      ...prev,
                      group_quantity: `${value}`
                    }))
                  }}
                />
              </Flex>
              <Flex flex='fcbs' size='32% auto' margin='0 30 0 0'>
                <Box margin='0 0 5 0'>
                  <Text fontSize={styles.textSmall} color={styles.textGray}>团购结束时间</Text>
                </Box>
                <DatePicker
                  showTime
                  value={moment(edit.group_end)}
                  onOk={(value) => {
                    setEdit(prev => ({
                      ...prev,
                      group_end: dateTime(value.toString(), 'dateTime') || ''
                    }))
                  }}
                />
              </Flex>
              <Flex flex='fcbs' size='25% auto'>
                <Box margin='0 0 5 0'>
                  <Text fontSize={styles.textSmall} color={styles.textGray}>团购售价(元)</Text>
                </Box>
                <Box size='auto 32'>
                  <Text fontSize={styles.textNormal} color={styles.red} fontWeight='bold'>
                    ￥{salePrice(parseFloat(edit.group_cost || '0'), parseFloat(edit.group_f_sale_cost || '0'), parseFloat(edit.group_sale_cost || '0'), percent).toFixed(2)}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Box>
        }



        <Flex flex='frsc' size='100% auto' margin='0 0 20 0'>
          <Flex flex='fcbs' size='25% auto' margin='0 77 0 0'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>列表封面图</Text>
            </Box>
            <Upload 
              headers={{ 'Authorization': `Bearer ${localStorage.getItem(CONFIG_DATA.ZM_LOGIN_TOKEN) || ''}` }}
              name="file"
              action={CONFIG_DATA.API_URL + '/upload/mana/article'}
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUploadmin}
              onChange={handleChange}
            >
              {edit.a_img_urls.length > 0 ? <img src={edit.a_img_urls[0]} alt="avatar" style={{ width: '100%', height: '100%' }} /> : uploadButton}
            </Upload>
          </Flex>
          <Flex flex='fcbs' size='25% auto'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>转发图片</Text>
            </Box>
            <Upload 
              headers={{ 'Authorization': `Bearer ${localStorage.getItem(CONFIG_DATA.ZM_LOGIN_TOKEN) || ''}` }}
              name="file"
              action={CONFIG_DATA.API_URL + '/upload/mana/product'}
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUploadmin}
              onChange={handleChange2}
            >
              {edit.img_urls.length > 0 ? <img src={edit.img_urls[0]} alt="avatar" style={{ width: '100%', height: '100%' }} /> : uploadButton}
            </Upload>
          </Flex>
        </Flex>


        <Box margin='0 0 20 0'>
          <Box margin='0 0 5 0'>
            <Text fontSize={styles.textSmall} color={styles.textGray}>内容详情</Text>
          </Box>
          <Box borderColor={styles.editorBorder}>
            <BraftEditor
              value={edit.a_html}
              media={{
                uploadFn: myUploadFn,
                validateFn: (file) => {
                  const isLt1M = file.size / 1024 / 1024 < 0.85
                  if (!isLt1M) {
                    message.error('图片必须小于850KB')
                  }
                  return isLt1M
                }
              }}
              onChange={(value) => {
                setEdit(prev => ({
                  ...prev,
                  a_html: value
                }))
              }}
            />
          </Box>
        </Box>

        <Line size='100% 1' bgColor={styles.line} />
        
        <Box size='100% auto' margin='20 0 20 0'>
          <Box margin='0 0 5 0'>
            <Text fontSize={styles.textSmall} color={styles.textGray}>请选择寄件地址</Text>
          </Box>
          <Flex flex='frbc' size='100% auto'>
            <Flex flex='fcbs' size='45% auto'>
              <Box margin='0 0 5 0'>
                <Text fontSize={styles.textSmall} color={styles.textGray}></Text>
              </Box>
              <Select
                value={edit.province}
                style={{ width: 160 }}
                onChange={(value) => {
                  setEdit(prev => ({
                    ...prev,
                    city: '',
                    area: '',
                    province: value
                  }))
                  let id = ''
                  for(let i = 0; i < addressObjs.province.length; i++){
                    if(addressObjs.province[i].name === value){
                      id = addressObjs.province[i].id
                      break
                    }
                  }
                  setAddressObjs((prev: any) => ({
                    ...prev,
                    city: [],
                    area: []
                  }))
                  onCityList(id)
                }}
              >
                {
                  addressObjs.province.map((item: any) => (
                    <Option value={item.name} key={item.id}>{item.name}</Option>
                  ))
                }
              </Select>
            </Flex>
            <Flex flex='fcbs' size='45% auto'>
              <Box margin='0 0 5 0'>
                <Text fontSize={styles.textSmall} color={styles.textGray}></Text>
              </Box>
              <Select
                value={edit.city}
                style={{ width: 160 }}
                onChange={(value) => {
                  setEdit(prev => ({
                    ...prev,
                    area: '',
                    city: value
                  }))
                  let id = ''
                  for(let i = 0; i < addressObjs.city.length; i++){
                    if(addressObjs.city[i].name === value){
                      id = addressObjs.city[i].id
                      break
                    }
                  }
                  onAreaList(id)
                  setAddressObjs((prev: any) => ({
                    ...prev,
                    area: []
                  }))
                }}
              >
                {
                  addressObjs.city.map((item: any) => (
                    <Option value={item.name} key={item.id}>{item.name}</Option>
                  ))
                }
              </Select>
            </Flex>
            <Flex flex='fcbs' size='45% auto'>
              <Box margin='0 0 5 0'>
                <Text fontSize={styles.textSmall} color={styles.textGray}></Text>
              </Box>
              <Select
                value={edit.area}
                style={{ width: 160 }}
                onChange={(value) => {
                  setEdit(prev => ({
                    ...prev,
                    area: value
                  }))
                  let id = ''
                  for(let i = 0; i < addressObjs.area.length; i++){
                    if(addressObjs.area[i].name === value){
                      id = addressObjs.area[i].id
                      break
                    }
                  }
                }}
              >
                {
                  addressObjs.area.map((item: any) => (
                    <Option value={item.name} key={item.id}>{item.name}</Option>
                  ))
                }
              </Select>
            </Flex>
          </Flex>
        </Box>

        <Flex flex='frbc' size='100% auto' margin='0 0 20 0'>
          <Flex flex='fcbs' size='75% auto'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>详情地址</Text>
            </Box>
            <Input 
              placeholder='请输入详情地址'
              value={edit.addr}
              onChange={(e) => {
                setEdit(prev => ({
                  ...prev,
                  addr: e.target.value,
                }))
              }}
            />
          </Flex>
        </Flex>
        <Flex flex='frsc' size='100% auto' margin='0 0 20 0'>
          <Flex flex='fcbs' size='35% auto' margin='0 77 0 0'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>寄件人姓名</Text>
            </Box>
            <Input 
              placeholder='请输入寄件人姓名'
              value={edit.name}
              onChange={(e) => {
                setEdit(prev => ({
                  ...prev,
                  name: e.target.value
                }))
              }}
            />
          </Flex>
          <Flex flex='fcbs' size='45% auto'>
            <Box margin='0 0 5 0'>
              <Text fontSize={styles.textSmall} color={styles.textGray}>寄件人电话<Text fontSize={styles.textSmall} color={styles.red}>(不填则不自动呼叫快递员)</Text></Text>
            </Box>
            <Input 
              placeholder='请输入寄件人电话'
              value={edit.mobile}
              onChange={(e) => {
                setEdit(prev => ({
                  ...prev,
                  mobile: e.target.value
                }))
              }}
            />
          </Flex>
        </Flex>


        <Flex flex='frec' size='100% 80'>
          <Button 
            onClick={() => {
              setShowDrawer(false)
            }}
          >
            取消
          </Button>
          <Line size='30 1' />
          <Button 
            type='primary'
            onClick={() => {
              onFinish()
            }}
          >
            {selectInfo.id ? '更新' : '新增'}
          </Button>
          <Line size='30 1' />
        </Flex>
        
      </Drawer>
    </div>
  )
}


export default ArticleList


