
const throwError = (errorCode: any, message?: string, statusCode?: number) => {
  const error = new Error() as any
  error.errorCode = errorCode
  error.statusCode = statusCode
  error.message = message || '错误'
  throw error
}


export default throwError