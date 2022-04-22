import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Taro from '@tarojs/taro'
import {Picker, Switch} from '@tarojs/components'

import Page from '@/components/widget/Page'
import ColorButton from '@/components/widget/colorButton/colorButton'
import RichEditor from '@/components/widget/RichEditor'

import AddressItem from '@/components/widget/AddressItem'

import {Box, Flex, Block, Input, Text, Line, Press} from '@/components/widget/Components'
import UploadImg from '@/components/widget/uploadImg/uploadImg'

import {get, post} from '@/constants/fetch'
import onProductCatList from '@/actions/productCat'
import {salePrice} from '@/utils/filter'
import {isPhone, isPrice} from '@/utils/veriInfo'
import {dateTime} from '@/utils/timeFormat'
import {isRole} from '@/utils/authorize'




function getCatNameById (list, id, key) {
  let temp
  for(let i = 0; i < list.length; i++){
    if(list[i].id === id){
      temp = list[i][key]
      break
    }
  }
  return temp
}


function AddProduct() {

  const dispatch = useDispatch()
  const {productCat, currentUser, styles} = useSelector((state: ReduxState) => state)
  
  const [edit, setEdit] = useState({
    dpid: 0,
    title: '',
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
    weight: 0,
    space_x: 0,
    space_y: 0,
    space_z: 0,
    cat_id: 0,
    can_gift: 0,

    can_group: 0,
    group_end: '',
    group_quantity: '',
    group_cost: '',
    group_sale_cost: '',
    group_f_sale_cost: '',

    daid: 0,
    a_img_urls: [],
    a_img_paths: [],
    a_html: '',
  })
  const [loading, setLoading] = useState(false)
  const [percent, setPercent] = useState(1.20)  //获取售价百分比
  const [options, setOptions] = useState({
    taid: 0,
    atype: ''
  })

  useEffect(() => {
    const instance = Taro.getCurrentInstance()
    const taid = parseInt(instance.router?.params.taid || '0')
    const atype = instance.router?.params.atype || ''
    setOptions({
      taid,
      atype
    })
    onProductCatList()(dispatch)
  }, [])

  useEffect(() => {
    if(options.taid){
      post('/zhihehe/article/edit_init', {
        taid: options.taid,
        atype: options.atype
      }, dispatch).then(res => {
        setEdit({
          dpid: res.data.dpid,
          title: res.data.title,
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
          weight: res.data.weight || 0,
          space_x: res.data.space_x || 0,
          space_y: res.data.space_y || 0,
          space_z: res.data.space_z || 0,
          cat_id: res.data.cat_id,
          can_gift: res.data.can_gift || 0,

          can_group: res.data.can_group || 0,
          group_end: res.data.group_end ? dateTime(res.data.group_end, 'dateTime') as string : '',
          group_quantity: res.data.group_quantity ? res.data.group_quantity.toString() : 0,
          group_cost: res.data.group_cost ? res.data.group_cost.toString() : 0,
          group_sale_cost: res.data.group_sale_cost ? res.data.group_sale_cost.toString() : 0,
          group_f_sale_cost: res.data.group_f_sale_cost ? res.data.group_f_sale_cost.toString() : 0,
          
          daid: res.data.daid,
          a_img_urls: res.data.a_img_urls,
          a_img_paths: res.data.a_img_paths,
          a_html: res.data.a_html,
        })
      })
    }
  }, [options.taid])

  useEffect(() => {
    get('/zhihehe/product/price/percent', dispatch).then(res => {
      setPercent(res.data.percent || 1.20)
    })
  }, [])
  


  const onSend = () => {
    if(!edit.title){
      return Taro.showToast({title: '请输入商品名称', icon: 'none'})
    }
    if(!edit.des){
      return Taro.showToast({title: '请输入商品简介', icon: 'none'})
    }
    if(edit.cat_id <= 0){
      return Taro.showToast({title: '请选择商品分类', icon: 'none'})
    }
    if(edit.img_paths.length === 0){
      return Taro.showToast({title: '请上传分享图片', icon: 'none'})
    }
    if(!edit.cost){
      return Taro.showToast({title: '请输入成本', icon: 'none'})
    }
    if(!edit.sale_cost){
      return Taro.showToast({title: '请输入销售分成', icon: 'none'})
    }
    if(!edit.f_sale_cost){
      return Taro.showToast({title: '请输入总销售分成', icon: 'none'})
    }
    if(!edit.quantity){
      return Taro.showToast({title: '请输入数量', icon: 'none'})
    }
    if(!isPrice(edit.cost) || !isPrice(edit.sale_cost) || !isPrice(edit.f_sale_cost)){
      return Taro.showToast({title: '上面的价格有格式错误', icon: 'none'})
    }

    if(edit.can_group === 1){
      if(!edit.group_cost){
        return Taro.showToast({title: '请输入团购成本', icon: 'none'})
      }
      if(!edit.group_sale_cost){
        return Taro.showToast({title: '请输入团购销售分成', icon: 'none'})
      }
      if(!edit.group_f_sale_cost){
        return Taro.showToast({title: '请输入团购总销售分成', icon: 'none'})
      }
      if(!edit.group_quantity){
        return Taro.showToast({title: '请输入团购数量', icon: 'none'})
      }
      if(!isPrice(edit.group_cost) || !isPrice(edit.group_sale_cost) || !isPrice(edit.group_f_sale_cost)){
        return Taro.showToast({title: '上面的价格有格式错误', icon: 'none'})
      }
      if(!edit.group_end){
        return Taro.showToast({title: '请输入团购截止时间', icon: 'none'})
      }
    }

    
    if(edit.a_img_paths.length === 0){
      return Taro.showToast({title: '请输入封面图', icon: 'none'})
    }
    if(!edit.a_html){
      return Taro.showToast({title: '请输入文章详情', icon: 'none'})
    }


    // if(!edit.mobile){
    //   return Taro.showToast({title: '寄件人手机号有误', icon: 'none'})
    // }
    // if(!edit.addr){
    //   return Taro.showToast({title: '发件地址不能为空', icon: 'none'})
    // }
    // if(!edit.weight || !edit.space_x || !edit.space_y || !edit.space_z){
    //   return Taro.showToast({title: '物品信息不能为空', icon: 'none'})
    // }

    if(loading) return
    setLoading(true)
    post('/zhihehe/product/add', {
      ...edit,
      img_paths: edit.img_paths.toString()
    }, dispatch).then(res => {
      if(res.data.status === 2){
        post('/zhihehe/article/add', {
          daid: edit.daid,
          html: edit.a_html,
          product_draft_id: res.data.id,
          img_paths: edit.a_img_paths.toString()
        }, dispatch).then(res2 => {
          if(res2.data.status === 2){
            Taro.showToast({
              title: res2.data.message,
              icon: 'none'
            })
            setTimeout(() => {
              setLoading(false)
              Taro.switchTab({url: '/pages/mine/Mine'})
            }, 1500)
          }else{
            setLoading(false)
          }
        }, err => {setLoading(false)})
      }else{
        Taro.showToast({
          title: res.data.message,
          icon: 'none'
        })
        setLoading(false)
      }
    }, err => {setLoading(false)})
  }


  if(!isRole('quoter', currentUser.role)){
    return (
      <Page navTitle='发布'>
        <Flex flex='frcc'>
          <Text fontSize='36'>你是怎么进来的？</Text>
        </Flex>
      </Page>
    )
  }

  return (
    <Page navTitle='发布'>
      <Box padding='0 25'>
        {/* <Flex flex='frbc' size='100% auto'>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>开启送礼</Text></Box>
          <Switch 
            checked={edit.can_gift === 1 ? true : false}
            onChange={(e) => {
              setEdit(prev => ({
                ...prev,
                can_gift: e.detail.value ? 1 : 0
              }))
            }}
          />
        </Flex>
        <Line size='100% 20' /> */}

        <Box>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>商品名</Text></Box>
          <Input
            padding='0 25'
            bgColor={styles.boxColor}
            color={styles.textColor}
            placeholder='请输入商品名称' 
            value={edit.title}
            onInput={(value) => {
              setEdit(prev => ({
                ...prev,
                title: value
              }))
            }} 
          />
        </Box>
        <Box>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>商品简介</Text></Box>
          <Input
            padding='0 25'
            bgColor={styles.boxColor}
            color={styles.textColor}
            placeholder='请输入商品简介'
            value={edit.des}
            onInput={(value) => {
              setEdit(prev => ({
                ...prev,
                des: value
              }))
            }} 
          />
        </Box>
        <Box>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>商品分类</Text></Box>
          <Picker
            onChange={(e) => {
              let cid = productCat.list[+e.detail.value].id
              setEdit(prev => ({
                ...prev,
                cat_id: cid
              }))
            }}
            value={edit.cat_id}
            range={productCat.list}
            rangeKey='title'
          >
            <Text fontSize='30' color='#36a65d'>
              {getCatNameById(productCat.list, edit.cat_id, 'title') || '请选择分类'}
            </Text>
          </Picker>
        </Box>
        <Box>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>转发图片</Text></Box>
          <UploadImg
            maxKb={200}
            compressed={false}
            uploadUrl={'/upload/product'}
            num={1}
            imgList={edit.img_urls}
            pathList={edit.img_paths}
            onChange={(imgs, paths) => {
              setEdit(prev => ({
                ...prev,
                img_urls: imgs,
                img_paths: paths
              }))
            }}
          />
        </Box>

        <Flex flex='frbc'>
          <Box size='350 auto'>
            <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>成本(元)</Text></Box>
            <Input
              padding='0 25'
              bgColor={styles.boxColor}
              color={styles.textColor}
              type='digit'
              size='335 auto'
              placeholder='请输入成本' 
              value={edit.cost}
              onInput={(value) => {
                setEdit(prev => ({
                  ...prev,
                  cost: value
                }))
              }} 
            />
          </Box>
          <Box size='350 auto' margin='0 0 0 15'>
            <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>总销售分成(元)</Text></Box>
            <Input
              padding='0 25'
              bgColor={styles.boxColor}
              color={styles.textColor}
              type='digit'
              size='335 auto'
              placeholder='请输入总销售分成' 
              value={edit.f_sale_cost}
              onInput={(value) => {
                setEdit(prev => ({
                  ...prev,
                  f_sale_cost: value
                }))
              }} 
            />
          </Box>
        </Flex>
        
        <Flex flex='frbc'>
          <Box size='350 auto'>
            <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>销售分成(元)</Text></Box>
            <Input
              padding='0 25'
              bgColor={styles.boxColor}
              color={styles.textColor}
              type='digit'
              size='335 auto'
              placeholder='请输入销售分成' 
              value={edit.sale_cost}
              onInput={(value) => {
                setEdit(prev => ({
                  ...prev,
                  sale_cost: value
                }))
              }} 
            />
          </Box>
          <Box size='350 auto'>
            <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>售价(元)</Text></Box>
            <Flex size='335 86' flex='frsc'>
              <Text fontSize='34' fontWeight='bold' color='#36a65d'>
                ￥{salePrice(parseFloat(edit.cost || '0'), parseFloat(edit.f_sale_cost || '0'), parseFloat(edit.sale_cost || '0'), percent).toFixed(2)}
              </Text>
            </Flex>
          </Box>
        </Flex>


        <Box size='350 auto'>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>数量</Text></Box>
          <Input
            padding='0 25'
            bgColor={styles.boxColor}
            color={styles.textColor}
            type='number'
            size='335 auto'
            placeholder='请输入数量'
            value={edit.quantity}
            onInput={(value) => {
              setEdit(prev => ({
                ...prev,
                quantity: value
              }))
            }} 
          />
        </Box>

        


        <Line size='100% 20' />
        <Flex flex='frbc' size='100% auto'>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>开启团购</Text></Box>
          <Switch 
            checked={edit.can_group === 1 ? true : false}
            onChange={(e) => {
              setEdit(prev => ({
                ...prev,
                can_group: e.detail.value ? 1 : 0
              }))
            }}
          />
        </Flex>
        {
          edit.can_group === 1 &&
          <Box size='100% auto' bgColor={styles.boxColor} radius='30' padding='25'>
            <Flex flex='frbc'>
              <Box size='325 auto'>
                <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>团购成本(元)</Text></Box>
                <Input
                  padding='0 25'
                  bgColor={styles.boxColorGray}
                  color={styles.textColor}
                  type='digit'
                  size='300 auto'
                  placeholder='请输入团购成本' 
                  value={edit.group_cost}
                  onInput={(value) => {
                    setEdit(prev => ({
                      ...prev,
                      group_cost: value
                    }))
                  }} 
                />
              </Box>
              <Box size='325 auto' margin='0 0 0 15'>
                <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>团购总销售分成(元)</Text></Box>
                <Input
                  padding='0 25'
                  bgColor={styles.boxColorGray}
                  color={styles.textColor}
                  type='digit'
                  size='300 auto'
                  placeholder='请输入团购总销售分成' 
                  value={edit.group_f_sale_cost}
                  onInput={(value) => {
                    setEdit(prev => ({
                      ...prev,
                      group_f_sale_cost: value
                    }))
                  }} 
                />
              </Box>
            </Flex>
            
            <Flex flex='frbc'>
              <Box size='325 auto'>
                <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>团购销售分成(元)</Text></Box>
                <Input
                  padding='0 25'
                  bgColor={styles.boxColorGray}
                  color={styles.textColor}
                  type='digit'
                  size='300 auto'
                  placeholder='请输入团购销售分成' 
                  value={edit.group_sale_cost}
                  onInput={(value) => {
                    setEdit(prev => ({
                      ...prev,
                      group_sale_cost: value
                    }))
                  }} 
                />
              </Box>
              <Box size='325 auto'>
                <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>团购售价(元)</Text></Box>
                <Flex size='300 86' flex='frsc'>
                  <Text fontSize='34' fontWeight='bold' color='#ff7310'>
                    ￥{salePrice(parseFloat(edit.group_cost || '0'), parseFloat(edit.group_f_sale_cost || '0'), parseFloat(edit.group_sale_cost || '0'), percent).toFixed(2)}
                  </Text>
                </Flex>
              </Box>
            </Flex>


            <Flex flex='frbc'>
              <Box size='325 auto'>
                <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>团购数量</Text></Box>
                <Input
                  padding='0 25'
                  bgColor={styles.boxColorGray}
                  color={styles.textColor}
                  type='number'
                  size='300 auto'
                  placeholder='请输入团购数量'
                  value={edit.group_quantity}
                  onInput={(value) => {
                    setEdit(prev => ({
                      ...prev,
                      group_quantity: value
                    }))
                  }} 
                />
              </Box>
              <Box size='325 auto'>
                <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>团购截止时间</Text></Box>
                <Flex flex='frbc'>
                  <Picker 
                    value={edit.group_end} 
                    mode="date"
                    onChange={(e) => {
                      let temp = edit.group_end.split(' ')
                      temp[0] = e.detail.value
                      setEdit(prev => ({
                        ...prev,
                        group_end: `${temp[0]} ${temp[1] || ''}`
                      }))
                    }}
                  >
                    <Text color={styles.textColor}>{edit.group_end.split(' ')[0] || '日期'}</Text>
                  </Picker>
                  <Picker 
                    value={edit.group_end}
                    mode='time'
                    onChange={(e) => {
                      let temp = edit.group_end.split(' ')
                      temp[1] = e.detail.value
                      setEdit(prev => ({
                        ...prev,
                        group_end: `${temp[0] || ''} ${temp[1]}`
                      }))
                    }}
                  >
                    <Text color={styles.textColor}>{edit.group_end.split(' ')[1] || '时间'}</Text>
                  </Picker>
                </Flex>
              </Box>
            </Flex>
          </Box>
        }





        <Box>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>列表封面图</Text></Box>
          <UploadImg
            maxKb={160}
            compressed={false}
            uploadUrl={'/upload/article'}
            num={1}
            imgList={edit.a_img_urls}
            pathList={edit.a_img_paths}
            onChange={(imgs, paths) => {
              setEdit(prev => ({
                ...prev,
                a_img_urls: imgs,
                a_img_paths: paths
              }))
            }}
          />
        </Box>

        <Box>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>文章内容</Text></Box>
          <RichEditor
            maxKb={650}
            compressed={false}
            html={edit.a_html}
            uploadUrl='/upload/article'
            onInput={(value) => {
              setEdit(prev => ({
                ...prev,
                a_html: value
              }))
            }}
          />
        </Box>




        <Box>
          <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>寄件信息 (不填，则不自动呼叫快递)</Text></Box>
          <Press
            onClick={async () => {
              let addrInfo = await Taro.chooseAddress()
              setEdit(prev => ({
                ...prev,
                name: addrInfo.userName,
                mobile: addrInfo.telNumber,
                province: addrInfo.provinceName,
                city: addrInfo.cityName,
                area: addrInfo.countyName,
                addr: addrInfo.detailInfo,
              }))
            }}
          >
            <Flex flex='fccc' size='100% auto'>
              <AddressItem 
                item={{
                  name: edit.name || '寄件人',
                  phone: edit.mobile,
                  address: (edit.province + edit.city + edit.area + edit.addr) || '请选择寄件地址'
                }} 
              />
            </Flex>
          </Press>
        </Box>

        <Flex flex='frbc'>
          <Box size='350 auto'>
            <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>物品重量(kg)</Text></Box>
            <Input
              padding='0 25'
              bgColor={styles.boxColor}
              color={styles.textColor}
              type='digit'
              size='335 auto'
              placeholder='请输入物品重量' 
              value={edit.weight}
              onInput={(value) => {
                setEdit(prev => ({
                  ...prev,
                  weight: value
                }))
              }} 
            />
          </Box>
          <Box size='350 auto' margin='0 0 0 15'>
            <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>长度(cm)</Text></Box>
            <Input
              padding='0 25'
              bgColor={styles.boxColor}
              color={styles.textColor}
              type='digit'
              size='335 auto'
              placeholder='请输入物品长度' 
              value={edit.space_x}
              onInput={(value) => {
                setEdit(prev => ({
                  ...prev,
                  space_x: value
                }))
              }} 
            />
          </Box>
        </Flex>
        <Flex flex='frbc'>
          <Box size='350 auto'>
            <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>宽度(cm)</Text></Box>
            <Input
              padding='0 25'
              bgColor={styles.boxColor}
              color={styles.textColor}
              type='digit'
              size='335 auto'
              placeholder='请输入物品宽度' 
              value={edit.space_y}
              onInput={(value) => {
                setEdit(prev => ({
                  ...prev,
                  space_y: value
                }))
              }} 
            />
          </Box>
          <Box size='350 auto' margin='0 0 0 15'>
            <Box margin='25 0 15 0'><Text fontSize='28' color='#acacac'>高度(cm)</Text></Box>
            <Input
              padding='0 25'
              bgColor={styles.boxColor}
              color={styles.textColor}
              type='digit'
              size='335 auto'
              placeholder='请输入物品高度' 
              value={edit.space_z}
              onInput={(value) => {
                setEdit(prev => ({
                  ...prev,
                  space_z: value
                }))
              }} 
            />
          </Box>
        </Flex>


        

        <Line size='auto 50' />


        
        <Flex flex='frcc' size='100% auto'>              
          <ColorButton
            onClick={() => {
              onSend()
            }}
          >
            {options.taid ? '更新' : '提交'}
          </ColorButton>
        </Flex>
      </Box>
      <Line size='0 50' type='bottom' />
    </Page>
  )
}

export default AddProduct