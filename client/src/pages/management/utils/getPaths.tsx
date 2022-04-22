import React from 'react'


// const Taaa = require('../paths/testPath/ta').default

interface IGetPaths {
  [key: string]: any
}
const getPaths = (allPaths: string[]): IGetPaths => {

  if(!allPaths[0]){
    return {}
  }
  let objPaths: any = {}
  for(let i = 0; i < allPaths.length; i++){
    objPaths[`${allPaths[i]}`] = React.createElement(require(`../paths/${allPaths[i]}`).default, {})
  }
  return objPaths
}


export default getPaths