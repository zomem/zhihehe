import React, {useEffect, useState} from 'react'

import {fetchGet, fetchUpload, CONFIG_DATA} from '@/constants/config' 

function Mine() {

  const [oneUser, setOneUser] = useState<any>({})

  useEffect(() => {
    async function getSome() {
      // 仅测试: 获取 uid=5 的用户的信息
      setOneUser((await fetchGet('/users/uid/5')).data)
    }
    getSome()
  }, [])

  return(
    <div>
      <div>测试查寻，返回用户：{oneUser.nickname}</div>


      <div style={{height: '30px'}}></div>
      <h2>(函数)文件上传示例：</h2>
      <input 
        type="file"
        onChange={async (e) => {
          let file = e.target.files || []
          await fetchUpload('/upload/images', file[0])
        }}
      />

      <div style={{height: '30px'}}></div>
      <h2>(url)文件上传示例：</h2>
      <form action={CONFIG_DATA.API_URL + "/upload/images"} method="POST" encType="multipart/form-data">
        {/* 这里的 name=file 是和后台对应 */}
        <input type="file" name="file"/> 
        <input type="submit" />
      </form>
    </div>
  )
}

export default Mine