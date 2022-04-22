import React from "react"


import ExcIcons from './excIcons'
import {ICON_NAME_LIST_1, ICON_NAME_LIST_2, ICON_NAME_LIST_3, ICON_NAME_LIST_4, ICON_NAME_LIST_5, ICON_NAME_LIST_6} from './iconsName'


import './iconsList.css'

interface IIconsListProps {
  onClick?: (name: string) => void,
  select?: string
}


const IconsList = (props: IIconsListProps) => {
  const {onClick=() => {}, select=''} = props

  return (
    <div>
      <div className='_icons_list_line frsc'>网站通用图标</div>
      <div className='_icons_list_con'>
        {
          ICON_NAME_LIST_6.map((item, index) => (
            <div 
              className={select === item ? '_icons_list_item frcc _icons_list_item_s' : '_icons_list_item frcc'}
              onClick={() => {
                onClick(item)
              }}
              key={item}
            >
              <ExcIcons name={item} style={{fontSize: '18px'}} />
            </div>
          ))
        }
      </div>
      <div className='_icons_list_line frsc'>方向性图标</div>
      <div className='_icons_list_con'>
        {
          ICON_NAME_LIST_1.map((item, index) => (
            <div 
              className={select === item ? '_icons_list_item frcc _icons_list_item_s' : '_icons_list_item frcc'}
              onClick={() => {
                onClick(item)
              }}
              key={item}
            >
              <ExcIcons name={item} style={{fontSize: '18px'}} />
            </div>
          ))
        }
      </div>
      <div className='_icons_list_line frsc'>提示建议性图标</div>
      <div className='_icons_list_con'>
        {
          ICON_NAME_LIST_2.map((item, index) => (
            <div 
              className={select === item ? '_icons_list_item frcc _icons_list_item_s' : '_icons_list_item frcc'}
              onClick={() => {
                onClick(item)
              }}
              key={item}
            >
              <ExcIcons name={item} style={{fontSize: '18px'}} />
            </div>
          ))
        }
      </div>
      <div className='_icons_list_line frsc'>编辑类图标</div>
      <div className='_icons_list_con'>
        {
          ICON_NAME_LIST_3.map((item, index) => (
            <div 
              className={select === item ? '_icons_list_item frcc _icons_list_item_s' : '_icons_list_item frcc'}
              onClick={() => {
                onClick(item)
              }}
              key={item}
            >
              <ExcIcons name={item} style={{fontSize: '18px'}} />
            </div>
          ))
        }
      </div>
      <div className='_icons_list_line frsc'>数据类图标</div>
      <div className='_icons_list_con'>
        {
          ICON_NAME_LIST_4.map((item, index) => (
            <div 
              className={select === item ? '_icons_list_item frcc _icons_list_item_s' : '_icons_list_item frcc'}
              onClick={() => {
                onClick(item)
              }}
              key={item}
            >
              <ExcIcons name={item} style={{fontSize: '18px'}} />
            </div>
          ))
        }
      </div>
      <div className='_icons_list_line frsc'>品牌和标识</div>
      <div className='_icons_list_con'>
        {
          ICON_NAME_LIST_5.map((item, index) => (
            <div 
              className={select === item ? '_icons_list_item frcc _icons_list_item_s' : '_icons_list_item frcc'}
              onClick={() => {
                onClick(item)
              }}
              key={item}
            >
              <ExcIcons name={item} style={{fontSize: '18px'}} />
            </div>
          ))
        }
      </div>
    </div>
  )
}


export default IconsList