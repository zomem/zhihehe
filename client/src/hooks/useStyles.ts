import React, {useRef, useEffect} from 'react'
import theme from '@/theme.json'
import {IMPORT} from '@/constants/constants'


// 检测文件
const insertImport = (config: any = {}, themeMode: string) => {
  let temp = {...config}
  for(let c in config){
    if(config[c].indexOf('@import') > -1){
      temp[c] = themeMode === 'dark' ? IMPORT[c+'_dark'] : IMPORT[c]
    }
  }
  return temp
}


const useStyles = (callback: (styles: UseStyle) => void) => {
  const mode = useRef<string>('light')
  const style = useRef<any>(theme.light)
  const prefersMedia = useRef<any>(window.matchMedia('(prefers-color-scheme: dark)'))
  const savedHandler = useRef<any>(callback)

  useEffect(() => {
    if (prefersMedia.current.matches) {
      mode.current = 'dark'
      style.current = theme.dark
    }
    savedHandler.current(insertImport(style.current, mode.current))

    const eventListener = (e: any) => {
      if(mode.current === 'light' && e.matches){
        mode.current = 'dark'
        style.current = theme.dark
        savedHandler.current(insertImport(style.current, mode.current))
      }
      if(mode.current === 'dark' && !e.matches){
        mode.current = 'light'
        style.current = theme.light
        savedHandler.current(insertImport(style.current, mode.current))
      }
    }
    prefersMedia.current.addEventListener('change', eventListener)
    return () => {
      prefersMedia.current.removeEventListener('change', eventListener)
    }
  }, [])
}

export default useStyles