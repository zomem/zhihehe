
const nodemailer = require('nodemailer')

interface ISendEmail {
  from: string
  to: string
  subject: string
  text?: string
  html?: string
}
async function sendEmail(params: ISendEmail) {
  // 创建Nodemailer传输器 SMTP 或者 其他 运输机制
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // 第三方邮箱的主机地址
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // 发送方邮箱的账号
      pass: process.env.EMAIL_PASS, // 邮箱授权密码
    },
  })

  // 定义transport对象并发送邮件
  let info = await transporter.sendMail(params)
  return info
}

export default sendEmail