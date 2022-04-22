import React, {ReactNode} from "react"
import {useSelector} from 'react-redux'
import {Box, Text, TOverflow} from '@/components/widget/Components'

interface CardProps {
  children?: ReactNode
  bgColor?: string
  color?: string
  padding?: string
  margin?: string
  radius?: string
  frontTxt?: string
  afterTxt?: string
  size?: string
  overflow?: TOverflow
  wrap?: boolean
}


export default (props: CardProps) => {
  const {styles} = useSelector((state: ReduxState) => state)
  const {children, bgColor='', size, padding, margin, radius, frontTxt, afterTxt, color, overflow, wrap=false} = props

  return (
    <Box size={size || '100% auto'} margin={margin}>
      {frontTxt && <Box size='100% auto' padding='12 25'><Text fontSize={styles.textSizeXS} color={color || styles.textColorGray}>{frontTxt}</Text></Box>}
      <Box 
        size='100% auto'
        bgColor={bgColor || styles.boxColor}
        radius={radius || '30'}
        padding={padding}
        overflow={overflow || 'hidden'}
        display={wrap ? 'flex' : 'block'}
        flexWrap={wrap ? 'wrap' : 'nowrap'}
      >
        {children}
      </Box>
      {afterTxt && <Box size='100% auto' padding='12 25'><Text fontSize={styles.textSizeXXS} color={color || styles.textColorGray}>{afterTxt}</Text></Box>}
    </Box>
  )
}
