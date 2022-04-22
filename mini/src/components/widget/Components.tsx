import React, { ReactNode, useState } from 'react'
import Taro from '@tarojs/taro'
import {
  Image as Img, 
  View as Viw, 
  Block as Blk,
  Input as Int,
  Textarea as Tarea,
  Swiper as Swi,
  SwiperItem as SwiI,
  Button as Btn,
  Switch as Sch,
  ScrollView as ScV,
} from '@tarojs/components'
import {styled} from '@linaria/react'
import {ZPX} from '@/constants/constants'
import './widget.scss'
const sys = Taro.getSystemInfoSync()

// 通用样式定义
// type TColor = '#181818' | '#7b7b7b' | '#acacac' | '#d2d2d2' | '#dddddd' | '#efefef' | '#f2f2f2' | '#ffffff' |
// '#ff7310' | 
// '#fa5151' | '#c87d2f' | '#ffc300' | '#91d300' | '#95ec69' | '#07c160' | 
// '#10aeff' | '#1485ee' | '#6467f0' | '#576b95'
export type TFontSize = string


export type TFontWeight = 'normal' | 'bold'
export type TFontSpacing = string
export type TOverflow = 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit' |
                 'visible visible' | 'visible hidden' | 'visible scroll' | 'visible auto' | 'visible inherit' |
                 'hidden visible' | 'hidden hidden' | 'hidden scroll' | 'hidden auto' | 'hidden inherit' |
                 'scroll visible' | 'scroll hidden' | 'scroll scroll' | 'scroll auto' | 'scroll inherit' |
                 'auto visible' | 'auto hidden' | 'auto scroll' | 'auto auto' | 'auto inherit' |
                 'inherit visible' | 'inherit hidden' | 'inherit scroll' | 'inherit auto' | 'inherit inherit'
export type TDisplay = 'flex' | 'inline' | 'block' | 'inline-block' | 'none'
export type TFlexWay = 'fraa' | 'frab' | 'frac' | 'frae' | 'fras' |
                'frba' | 'frbb' | 'frbc' | 'frbe' | 'frbs' |
                'frca' | 'frcb' | 'frcc' | 'frce' | 'frcs' |
                'frea' | 'freb' | 'frec' | 'free' | 'fres' |
                'frsa' | 'frsb' | 'frsc' | 'frse' | 'frss' |
                'fcaa' | 'fcab' | 'fcac' | 'fcae' | 'fcas' |
                'fcba' | 'fcbb' | 'fcbc' | 'fcbe' | 'fcbs' |
                'fcca' | 'fccb' | 'fccc' | 'fcce' | 'fccs' |
                'fcea' | 'fceb' | 'fcec' | 'fcee' | 'fces' |
                'fcsa' | 'fcsb' | 'fcsc' | 'fcse' | 'fcss'
export type TBoxSizing = 'content-box' | 'border-box'
export type TPosition = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky' | 'inherit'
export type TBgImageType = 'aspectFit' | 'aspectFill'
export type TSafeType = 'top' | 'bottom'
export type TTextDecoration = 'underline' | 'none' | 'line-through'
export type TFlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse' | 'inherit' | 'initial' | 'unset'
export type TFontStyle = 'normal' | 'italic' | 'oblique' | 'inherit'
export type TWhiteSpace = 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces'
export type TPointerEvents = 'auto' | 'none'
export type TStroke = string
export type TLeft = string
export type TRight = string
export type TTop = string
export type TBottom = string
export type TPadding = string
export type TMargin = string
export type TSize = string
export type TRadius = string
export type TColor = string
export type TZIndex = string
export type TOpacity = string
export type TBackDrop = string
export type TMinHeight = string
export type TMaxHeight = string
export type THoverBgColor = string
export type TAnimation = Animate




// 块
interface BlockProps{
  children?: ReactNode
}
export const Block = (props: BlockProps) => (
  <Blk>{props.children}</Blk>
)





// 容器
interface BoxBase {
  size?: TSize
  radius?: TRadius
  overflow?: TOverflow
  boxSizing?: TBoxSizing
  bgColor?: TColor
  bgImage?: TColor
  bgImageType?: TBgImageType
  position?: TPosition
  left?: TLeft
  top?: TTop
  right?: TRight
  bottom?: TBottom
  shadowColor?: TColor
  borderColor?: TColor
  zIndex?: TZIndex
  opacity?: TOpacity
  backdrop?: TBackDrop
  minHeight?: TMinHeight
  maxHeight?: TMaxHeight
  pointerEvents?: TPointerEvents
}
interface BoxProps extends BoxBase{
  display?: TDisplay
  padding?: TPadding
  margin?: TMargin
  flexWrap?: TFlexWrap
  whiteSpace?: TWhiteSpace
}
export const Box = styled.view<BoxProps>`
  width: ${props => (props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + ZPX) : 'auto')};
  height: ${props => (props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + ZPX) : 'auto')};
  box-sizing: ${props => props.boxSizing ? props.boxSizing : 'border-box'};
  padding: ${props => props.padding ? (props.padding.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  margin: ${props => props.margin ? (props.margin.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  border-radius: ${props => props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  border: ${props => props.borderColor ? `1${ZPX} solid ${props.borderColor}` : 'none'};
  overflow: ${props => props.overflow || 'visible'};
  background-color: ${props => props.bgColor || 'rgba(0,0,0,0)'};
  background-image: ${props => props.bgImage || 'none'};
  backdrop-filter: ${props => props.backdrop ? `blur(${props.backdrop}px)` : 'none'};
  pointer-events: ${props => props.pointerEvents || 'auto'};
  white-space: ${props => props.whiteSpace || 'normal'};
  min-height: ${props => props.minHeight ? props.minHeight + ZPX : 'none'};
  max-height: ${props => props.maxHeight ? props.maxHeight + ZPX : 'none'};
  background-size: ${props => props.bgImageType === 'aspectFit' ? 'contain' : 'cover'};
  background-repeat: no-repeat;
  background-position: center;
  display: ${props => props.display || 'block'};
  flex-wrap: ${props => props.flexWrap || 'nowrap'};
  box-shadow: ${props => props.shadowColor ? `1${ZPX} 1${ZPX} 10${ZPX} 5${ZPX} ${props.shadowColor}` : 'none'};
  position: ${props => props.position || 'static'};
  left: ${props => props.left ? props.left + ZPX : 'auto'};
  top: ${props => props.top ? props.top + ZPX : 'auto'};
  right: ${props => props.right ? props.right + ZPX : 'auto'};
  bottom: ${props => props.bottom ? props.bottom + ZPX : 'auto'};
  z-index: ${props => props.zIndex ? props.zIndex : 'auto'};
  opacity: ${props => props.opacity ? props.opacity : 'inherit'};
`


interface SafeAreaProps extends BoxBase{
  safe: TSafeType
  display?: TDisplay
  flexWrap?: TFlexWrap
  whiteSpace?: TWhiteSpace
}
export const SafeArea = styled.view<SafeAreaProps>`
  width: ${props => (props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + ZPX) : 'auto')};
  height: ${props => (props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + ZPX) : 'auto')};
  box-sizing: content-box;
  padding-top: ${props => (props.safe === 'top' ? sys.statusBarHeight + 'PX' : '0')};
  padding-bottom: ${props => (props.safe === 'bottom' ? 'env(safe-area-inset-bottom)': '0')};
  border-radius: ${props => props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  border: ${props => props.borderColor ? `1${ZPX} solid ${props.borderColor}` : 'none'};
  overflow: ${props => props.overflow || 'visible'};
  background-color: ${props => props.bgColor || 'rgba(0,0,0,0)'};
  background-image: ${props => props.bgImage || 'none'};
  backdrop-filter: ${props => props.backdrop ? `blur(${props.backdrop}px)` : 'none'};
  pointer-events: ${props => props.pointerEvents || 'auto'};
  white-space: ${props => props.whiteSpace || 'normal'};
  min-height: ${props => props.minHeight ? props.minHeight + ZPX : 'none'};
  max-height: ${props => props.maxHeight ? props.maxHeight + ZPX : 'none'};
  background-size: ${props => props.bgImageType === 'aspectFit' ? 'contain' : 'cover'};
  background-repeat: no-repeat;
  background-position: center;
  display: ${props => props.display || 'block'};
  flex-wrap: ${props => props.flexWrap || 'nowrap'};
  box-shadow: ${props => props.shadowColor ? `1${ZPX} 1${ZPX} 10${ZPX} 5${ZPX} ${props.shadowColor}` : 'none'};
  position: ${props => props.position || 'static'};
  left: ${props => props.left ? props.left + ZPX : 'auto'};
  top: ${props => props.top ? props.top + ZPX : 'auto'};
  right: ${props => props.right ? props.right + ZPX : 'auto'};
  bottom: ${props => props.bottom ? props.bottom + ZPX : 'auto'};
  z-index: ${props => props.zIndex ? props.zIndex : 'auto'};
  opacity: ${props => props.opacity ? props.opacity : 'inherit'};
`

interface FlexProps extends BoxBase{
  flex: TFlexWay
  padding?: TPadding
  margin?: TMargin
}
export const Flex = styled.view<FlexProps>`
  width: ${props => (props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + ZPX) : 'auto')};
  height: ${props => (props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + ZPX) : 'auto')};
  box-sizing: ${props => props.boxSizing ? props.boxSizing : 'border-box'};
  padding: ${props => props.padding ? (props.padding.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  margin: ${props => props.margin ? (props.margin.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  border-radius: ${props => props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  border: ${props => props.borderColor ? `1${ZPX} solid ${props.borderColor}` : 'none'};
  overflow: ${props => props.overflow || 'visible'};
  background-color: ${props => props.bgColor || 'rgba(0,0,0,0)'};
  background-image: ${props => props.bgImage || 'none'};
  backdrop-filter: ${props => props.backdrop ? `blur(${props.backdrop}px)` : 'none'};
  pointer-events: ${props => props.pointerEvents || 'auto'};
  min-height: ${props => props.minHeight ? props.minHeight + ZPX : 'none'};
  max-height: ${props => props.maxHeight ? props.maxHeight + ZPX : 'none'};
  background-size: ${props => props.bgImageType === 'aspectFit' ? 'contain' : 'cover'};
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  box-shadow: ${props => props.shadowColor ? `1${ZPX} 1${ZPX} 10${ZPX} 5${ZPX} ${props.shadowColor}` : 'none'};
  position: ${props => props.position || 'static'};
  left: ${props => props.left ? props.left + ZPX : 'auto'};
  top: ${props => props.top ? props.top + ZPX : 'auto'};
  right: ${props => props.right ? props.right + ZPX : 'auto'};
  bottom: ${props => props.bottom ? props.bottom + ZPX : 'auto'};
  flex-direction: ${props => props.flex[1] === 'c' ? 'column' : 'row'};
  justify-content: ${props => 
    props.flex[2] === 'c' ? 'center' : 
    props.flex[2] === 'b' ? 'space-between': 
    props.flex[2] === 'a' ? 'space-around': 
    props.flex[2] === 'e' ? 'flex-end': 
    props.flex[2] === 's' ? 'flex-start': 'center'
  };
  align-items: ${props => 
    props.flex[3] === 'c' ? 'center' : 
    props.flex[3] === 'b' ? 'space-between': 
    props.flex[3] === 'a' ? 'space-around': 
    props.flex[3] === 'e' ? 'flex-end': 
    props.flex[3] === 's' ? 'flex-start': 'center'
  };
  z-index: ${props => props.zIndex ? props.zIndex : 'auto'};
  opacity: ${props => props.opacity ? props.opacity : 'inherit'};
`


// 动画包裹
interface AnimateProps {
  animation?: TAnimation
  padding?: TPadding
  margin?: TMargin
  fontSize?: TFontSize
  color?: TColor
  fontWeight?: TFontWeight
  size?: TSize
  radius?: TRadius
  bgColor?: TColor
  shadowColor?: TColor
  zIndex?: TZIndex
  opacity?: TOpacity
  children?: ReactNode
  position?: TPosition
  left?: TLeft
  top?: TTop
  right?: TRight
  bottom?: TBottom
}
export const Animate = (props: AnimateProps) => (
  <Viw
    animation={props.animation}
    style={{
      width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + ZPX) : 'auto',
      height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + ZPX) : 'auto',
      borderRadius: props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      backgroundColor: props.bgColor || 'rgba(0,0,0,0)',
      boxShadow: props.shadowColor ? `1${ZPX} 1${ZPX} 10${ZPX} 5${ZPX} ${props.shadowColor}` : 'none',
      zIndex:  props.zIndex ? parseInt(props.zIndex) : 'auto',
      opacity:  props.opacity ? parseFloat(props.opacity) : 'inherit',
      padding: props.padding ? props.padding + ZPX : '0' + ZPX,
      margin: props.margin ? props.margin + ZPX : '0' + ZPX,
      fontSize: (props.fontSize || '32') + ZPX,
      color: props.color || '#ffffff',
      fontWeight: props.fontWeight || 'normal',
      position: props.position || 'static',
      left: props.left ? props.left + ZPX : 'auto',
      top: props.top ? props.top + ZPX : 'auto',
      right: props.right ? props.right + ZPX : 'auto',
      bottom: props.bottom ? props.bottom + ZPX : 'auto',
    }}
  >
    {props.children}
  </Viw>
)



// 点击
interface PressProps {
  display?: TDisplay
  children?: ReactNode
  onClick?: Function
  onGetPhoneNumber?: Function
  hoverBgColor?: THoverBgColor
  openType?: 'none' | 'contact' | 'share' | 'getPhoneNumber' | 'getUserInfo' | 'launchApp' | 'openSetting' | 'feedback'
}
const hoverAnimate = Taro.createAnimation({
  transformOrigin: "50% 50%",
  timingFunction: "linear",
})
export const Press = (props: PressProps) => {
  const [hoverAni, setHoverAni] = useState<Animate>({actions: []})
  const {onClick=()=>{}, onGetPhoneNumber=()=>{}, hoverBgColor, openType='none'} = props
  return (
    <Blk>
      {
        openType === 'none' ?
        <Viw
          animation={hoverAni}
          style={{display: props.display || 'block', backgroundColor: 'rgba(0,0,0,0)'}}
          onClick={(e) => {
            if(hoverBgColor){
              hoverAnimate
              .backgroundColor(hoverBgColor).step({duration: 150})
              .backgroundColor('rgba(0,0,0,0)').step({duration: 150})
              setHoverAni(hoverAnimate.export())
            }
            onClick(e)
          }}
        >
          {props.children}
        </Viw>
        :
        <Btn
          animation={hoverAni}
          style={{display: props.display || 'block', backgroundColor: 'rgba(0,0,0,0)'}}
          onClick={(e) => {
            if(hoverBgColor){
              hoverAnimate.backgroundColor(hoverBgColor).step({duration: 150}).backgroundColor('rgba(0,0,0,0)').step({duration: 150})
              hoverAnimate.backgroundColor(hoverBgColor)
            }
            onClick(e)
          }}
          onGetPhoneNumber={(e) => {
            if(openType === 'getPhoneNumber'){
              onGetPhoneNumber(e)
            }
          }}
          openType={openType}
          className='_press_button'
        >
          {props.children}
        </Btn>
      }
    </Blk>
  )
}






// 横线
interface LineProps {
  safe?: TSafeType
  bgColor?: TColor
  size?: string
  radius?: TRadius
}
export const Line = styled.view<LineProps>`
  width: ${props => (props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + ZPX) : '100%')};
  height: ${props => (props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + ZPX) : '1' + ZPX)};
  background-color: ${props => props.bgColor || 'rgba(255,255,255,0)'};
  border-radius: ${props => props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  padding-top: ${props => (props.safe === 'top' ? sys.statusBarHeight + 'PX' : '0')};
  padding-bottom: ${props => (props.safe === 'bottom' ? 'env(safe-area-inset-bottom)': '0')};
`





// 字体
interface TextProps{
  padding?: TPadding
  margin?: TMargin
  fontSize?: TFontSize
  color?: TColor
  fontWeight?: TFontWeight
  letterSpacing?: TFontSpacing
  lineHeight?: string
  textDecoration?: TTextDecoration
  opacity?: TOpacity
  stroke?: TStroke
  fontStyle?: TFontStyle
}
export const Text = styled.text<TextProps>`
  padding: ${props => props.padding ? (props.padding.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  margin: ${props => props.margin ? (props.margin.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  font-size: ${props => (props.fontSize || '32') + ZPX};
  color: ${props => props.color || '#181818'};
  font-style: ${props => props.fontStyle || 'normal'};
  font-weight: ${props => props.fontWeight || 'normal'};
  letter-spacing: ${props => props.letterSpacing ? props.letterSpacing + ZPX : 'normal'};
  line-height: ${props => props.lineHeight ? props.lineHeight + ZPX : 'normal'};
  text-decoration: ${props => props.textDecoration ? props.textDecoration : 'none'};
  opacity: ${props => props.opacity ? props.opacity : 'inherit'};
  -webkit-text-stroke: ${props => (props.stroke ? (props.stroke.split(' ').length > 0 ? props.stroke.split(' ')[0] + ZPX + ' ' + props.stroke.split(' ')[1] : props.stroke.split(' ')[0]) : 'unset')};
`
interface TextEllipsisProps extends TextProps{
  line?: string
}
export const TextEllipsis = styled.text<TextEllipsisProps>`
  padding: ${props => props.padding ? (props.padding.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  margin: ${props => props.margin ? (props.margin.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX};
  font-size: ${props => (props.fontSize || '32') + ZPX};
  color: ${props => props.color || '#181818'};
  font-style: ${props => props.fontStyle || 'normal'};
  font-weight: ${props => props.fontWeight || 'normal'};
  letter-spacing: ${props => props.letterSpacing ? props.letterSpacing + ZPX : 'normal'};
  display: -webkit-box;
  line-height: ${props => props.lineHeight ? props.lineHeight + ZPX : 'normal'};
	overflow: hidden;
	text-overflow: ellipsis;
	word-wrap: break-word;
	white-space: normal !important;
	-webkit-line-clamp: ${props => props.line || '1'};
	-webkit-box-orient: vertical; 
  text-decoration: ${props => props.textDecoration ? props.textDecoration : 'none'};
  opacity: ${props => props.opacity ? props.opacity : 'inherit'};
  -webkit-text-stroke: ${props => (props.stroke ? (props.stroke.split(' ').length > 0 ? props.stroke.split(' ')[0] + ZPX + ' ' + props.stroke.split(' ')[1] : props.stroke.split(' ')[0]) : 'unset')};
`





// 图片
interface ImageProps {
  size?: TSize
  padding?: TPadding
  margin?: TMargin
  radius?: TRadius
  src: string
  position?: TPosition
  left?: TLeft
  top?: TTop
  right?: TRight
  bottom?: TBottom
  zIndex?: TZIndex
  mode?: 'aspectFill' | 'aspectFit' | 'widthFix' | 'center'
  opacity?: TOpacity
  pointerEvents?: TPointerEvents
}
export const Image = (props: ImageProps) => (
  <Img 
    src={props.src}
    mode={props.mode || 'aspectFill'}
    style={{
      width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + ZPX) : 'auto',
      height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + ZPX) : 'auto',
      padding: props.padding ? (props.padding.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      margin: props.margin ? (props.margin.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      borderRadius: props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      display: 'block',
      position: props.position || 'static',
      pointerEvents: props.pointerEvents || 'auto',
      left: props.left ? props.left + ZPX : 'auto',
      top: props.top ? props.top + ZPX : 'auto',
      right: props.right ? props.right + ZPX : 'auto',
      bottom: props.bottom ? props.bottom + ZPX : 'auto',
      zIndex: props.zIndex ? parseInt(props.zIndex) : 'auto',
      opacity: props.opacity ? parseFloat(props.opacity) : 'inherit',
    }}
  />
)



// Input
interface InputProps {
  size?: TSize
  padding?: TPadding
  margin?: TMargin
  radius?: TRadius
  position?: TPosition
  left?: TLeft
  top?: TTop
  right?: TRight
  bottom?: TBottom
  fontSize?: TFontSize
  color?: TColor
  bgColor?: TColor
  pColor?: TColor
  fontWeight?: TFontWeight
  letterSpacing?: TFontSpacing
  placeholder?: string
  onInput?: Function
  onFocus?: Function
  onBlur?: Function
  onConfirm?: Function
  value?: string | number,
  maxlength?: string
  type?: 'text' | 'number' | 'idcard' | 'digit' | 'number'
}
export const Input = (props: InputProps) => (
  <Int
    onInput={(e) => {props.onInput && props.onInput(e.detail.value)}}
    onFocus={(e) => {props.onFocus && props.onFocus(e.detail.value)}}
    onBlur={(e) => {props.onBlur && props.onBlur(e.detail.value)}}
    onConfirm={(e) => {props.onConfirm && props.onConfirm(e.detail.value)}}
    value={props.value ? props.value.toString() : ''}
    placeholder={props.placeholder || '请输入内容'}
    placeholderStyle={`
      color: ${props.pColor || '#8c8c8c'};
    `}
    type={props.type || 'text'}
    maxlength={parseInt(props.maxlength || '140')}
    style={{
      width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + ZPX) : '100%',
      height: props.size ? (props.size.split(' ')[1].includes('auto') ? '80' + ZPX : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + ZPX) : '80' + ZPX,
      padding: props.padding ? (props.padding.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      margin: props.margin ? (props.margin.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      borderRadius: props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      display: 'block',
      boxSizing: 'border-box',
      backgroundColor: props.bgColor || '#ffffff',
      fontSize: (props.fontSize || '32') + ZPX,
      color: props.color || '#181818',
      fontWeight: props.fontWeight || 'normal',
      letterSpacing: props.letterSpacing ? props.letterSpacing + ZPX : 'normal',
    }}
  />
)

interface TextareaProps extends InputProps{
  autoHeight?: boolean
}
export const Textarea = (props: TextareaProps) => (
  <Tarea
    onInput={(e) => {props.onInput && props.onInput(e.detail.value)}}
    value={props.value ? props.value.toString() : ''}
    placeholder={props.placeholder || '请输入内容'}
    placeholderStyle={`
      color: ${props.pColor || '#acacac'};
    `}
    maxlength={parseInt(props.maxlength || '140')}
    autoHeight={props.autoHeight || false}
    style={{
      width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + ZPX) : '100%',
      height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + ZPX) : '168' + ZPX,
      padding: props.padding ? (props.padding.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      margin: props.margin ? (props.margin.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      borderRadius: props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      display: 'block',
      boxSizing: 'border-box',
      backgroundColor: props.bgColor || '#efefef',
      fontSize: (props.fontSize || '32') + ZPX,
      color: props.color || '#181818',
      fontWeight: props.fontWeight || 'normal',
      letterSpacing: props.letterSpacing ? props.letterSpacing + ZPX : 'normal',
    }}
  />
)



/** 按钮 */

interface ButtonProps {
  loading?: boolean
  letterSpacing?: TFontSpacing
  children: ReactNode
  onClick?: Function
  fontSize?: TFontSize
  color?: TColor
  fontWeight?: TFontWeight
  isFixAnimate?: boolean
  disable?: boolean
  size?: TSize
  radius?: TRadius
  overflow?: TOverflow
  bgColor?: TColor
  bgImage?: TColor
  bgImageType?: TBgImageType
  shadowColor?: TColor
  borderColor?: TColor
  zIndex?: TZIndex
  opacity?: TOpacity
  margin?: TMargin
}
export const Button = (props: ButtonProps) => {
  const {onClick=() => {},loading=false} = props
  return (
    <Viw 
      className={props.disable ? '_color_button_disable' : '_color_button'}
      style={{
        width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + ZPX) : '300' + ZPX,
        height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + ZPX) : '80' + ZPX,
        borderRadius: props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '15' + ZPX,
        border: props.borderColor ? `1${ZPX} solid ${props.borderColor}` : 'none',
        backgroundColor: props.bgColor || '#1890ff',
        backgroundImage: props.bgImage || 'none',
        backgroundSize: props.bgImageType === 'aspectFit' ? 'contain' : 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        boxShadow: props.shadowColor ? !props.disable ? `1${ZPX} 1${ZPX} 10${ZPX} 5${ZPX} ${props.shadowColor}` : `1${ZPX} 1${ZPX} 10${ZPX} 5${ZPX} rgba(204, 204, 204, 0.61)` : 'none',
        zIndex:  props.zIndex ? parseInt(props.zIndex) : 'auto',
        opacity:  props.opacity ? parseFloat(props.opacity) : 'inherit',
        letterSpacing: (props.letterSpacing || '10') + ZPX,
        paddingLeft: props.letterSpacing ? ((props.letterSpacing === 'normal' ? '0' : props.letterSpacing) + ZPX) : '10' + ZPX,
        margin: props.margin ? (props.margin.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
        fontSize: (props.fontSize || '32') + ZPX,
        color: props.color || '#ffffff',
        fontWeight: props.fontWeight || 'normal',
      }}
      onClick={(e) => {
        if(props.disable) return
        if(loading) return
        if(sys.platform === 'android' && props.isFixAnimate){
          setTimeout(() => {
            onClick(e)
          }, 240)
        }else{
          onClick(e)
        }
      }}
    >
      {loading && <Viw className='_color_button_circle_loading' />}
      {props.children}
    </Viw>
  )
}





interface SwiperProps{
  size?: TSize
  childList: ReactNode[]
  onChange?: Function
  current?: number
  autoplay?: boolean
  circular?: boolean
  vertical?: boolean
  duration?: number
  radius?: TRadius
  padding?: TPadding
  bgColor?: TColor
}
export const Swiper = (props: SwiperProps) => (
  <Swi
    style={{
      width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + ZPX) : '100%',
      height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + ZPX) : '100%',
      padding: props.padding ? (props.padding.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      borderRadius: props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
      overflow: 'hidden',
      backgroundColor: props.bgColor || '#1890ff',
    }}
    duration={props.duration || 500}
    vertical={props.vertical || false}
    circular={props.circular || false}
    autoplay={props.autoplay || false}
    current={props.current || 0}
    onChange={(e) => {
      if(props.onChange) props.onChange(e.detail.current)
    }}
  >
    {
      props.childList.map((item, index) => (
        <SwiI 
          key={index + '1066'} 
          style={{
            width: '100%', 
            height: '100%'
          }}
        >
          {item}
        </SwiI>
      ))
    }
  </Swi>
)


interface SwitchProps {
  disable?: boolean
  checked?: boolean
  bgColor?: string
  onChange?: (value: boolean) => void
}
export const Switch = (props: SwitchProps) => {
  const {onChange=()=>{}} = props
  return (
    <Sch 
      disabled={props.disable || false}
      checked={props.checked || false}
      color={props.bgColor || '#1890ff'}
      onChange={e => onChange(e.detail.value)}
    />
  )
}



interface ScrollViewProps {
  size?: TSize
  scrollX?: boolean
  scrollY?: boolean
  upperThreshold?: string | number
  lowerThreshold?: string | number
  scrollTop?: string | number
  scrollLeft?: string | number
  enableFlex?: boolean
  onScrollToUpper?: (event: any) => void
  onScrollToLower?: (event: any) => void
  onScroll?: (event: any) => void
  children?: ReactNode
  radius?: TRadius
  padding?: TPadding
  bgColor?: TColor
  scrollIntoView?: string
  scrollWithAnimation?: boolean
}
export const ScrollView = (props: ScrollViewProps) => {
  const {
    scrollX, scrollY, upperThreshold='50', lowerThreshold='50',
    scrollTop, scrollLeft, enableFlex, 
    onScrollToUpper=()=>{}, onScrollToLower=()=>{},
    onScroll=()=>{}, children, scrollIntoView, scrollWithAnimation
  } = props
  return (
    <ScV 
      style={{
        width: props.size ? (props.size.split(' ')[0].includes('auto') ? 'auto' : props.size.split(' ')[0].includes('%') ? props.size.split(' ')[0] : props.size.split(' ')[0] + ZPX) : '100%',
        height: props.size ? (props.size.split(' ')[1].includes('auto') ? 'auto' : props.size.split(' ')[1].includes('%') ? props.size.split(' ')[1] : props.size.split(' ')[1] + ZPX) : '100%',
        padding: props.padding ? (props.padding.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
        borderRadius: props.radius ? (props.radius.replace(/\s/g, ZPX + ' ') + ZPX) : '0' + ZPX,
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: props.bgColor || '#1890ff',
      }}
      scrollX={scrollX || false}
      scrollY={scrollY || false}
      upperThreshold={+upperThreshold}
      lowerThreshold={+lowerThreshold}
      scrollTop={scrollTop ? +scrollTop : undefined}
      scrollLeft={scrollLeft ? +scrollLeft : undefined}
      enableFlex={enableFlex || false}
      onScrollToUpper={onScrollToUpper}
      onScrollToLower={onScrollToLower}
      onScroll={onScroll}
      scrollIntoView={scrollIntoView}
      scrollWithAnimation={scrollWithAnimation || false}
    >
      {children}
    </ScV>
  )
}


export default {
  Block,
  Box,
  SafeArea,
  Press,
  Flex,
  Line,
  Text,
  TextEllipsis,
  Image,
  Input,
  Textarea,
  Button,
  Swiper,
  Switch,
  ScrollView
}
