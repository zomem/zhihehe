

const jwt = require('jsonwebtoken')

export const genToken = (uid) => {
  const token = jwt.sign({id: uid}, process.env.JWT_TOKEN_SECRET, {expiresIn: parseInt(process.env.JWT_TOKEN_EXPIRATION_TIME || '604800')})
  return token
}


// 静默登录时，jwt校验
export const silentJwt = (token) => {
  let id
  try{
    id = (jwt.verify(token, process.env.JWT_TOKEN_SECRET))?.id || ''
  }catch(err) {
    id = ''
  }
  return id
}


