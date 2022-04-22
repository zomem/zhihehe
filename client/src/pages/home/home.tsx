import React, { useEffect, FC, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Link, useHistory} from 'react-router-dom'


import Login from '@/components/widgets/login/login'
import {fetchGet} from '@/constants/config'


const Home: FC = () => {
  const {currentUser} = useSelector((state: IRootStore) => state)
  const history = useHistory()
  const [isOpenLogin, setIsOpenLogin] = useState(false)

  return(
    <div>
      <h1>
        Home
        <Link to='/mine'>我的_文件上传</Link>
      </h1>

      <div style={{height: '100px'}}></div>
      <button
        onClick={async() => { 
          if(!currentUser.id){
            setIsOpenLogin(true)
            return
          }
          history.push('/management')
        }}
      >
        <h2>管理后台</h2>
      </button>

      <Login 
        isOpen={isOpenLogin}
        onCancel={() => setIsOpenLogin(false)}
        onConfirm={() => setIsOpenLogin(false)}
      />
    </div>
  )
}


export default Home