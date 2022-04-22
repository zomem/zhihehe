import React from "react"


import './lineText.css'


interface ILineTextProps {
  title: string
}

const LineText = (props: ILineTextProps) => {
  const {title} = props

  return (
    <div className='_line_text frsc'>
      {title}
    </div>
  )
}

export default LineText