
## 微信小程序商城 全栈开发 源码  
  
### 说明  
  
|  名称    |  目录     |              技术              |
|  ----    |  ----    |  ----                          |
| 管理后台  |  client  |  React, TypeScript             |
| 小程序    |  mini    |  Taro, React, TypeScript       |
| 后台     |  server   |  koa2, TypeScript, access-db   |


### 页面 
支持 深色模式  
  
<figure class="half">
  <img src="./1.jpg" width="320"/><img src="./2.jpg" width="320"/>
</figure>
  
可扫码体验   

![纸禾禾](https://file.zomem.com/zhihehe/images/wzj.png)  

### 管理后台  
管理后台的代码在 `client/src/pages/management`  
路由配置在 `client/src/App.tsx`  
接口配置在 `client/src/constants/config.ts`
  
```shell
  cd client
  yarn

  # 开发
  yarn dev

  # 打包
  yarn build
```
浏览器打开 `http://localhost:3000/zhihehe/management`  

### 小程序  
接口配置在 `mini/src/constants/fetch.ts`  
样式文件在 `mini/theme.json`  

```shell
  cd mini
  yarn

  # 开发
  yarn dev:weapp

  # 打包
  yarn build:weapp
```
使用微信开发工具，打开项目  


### 后台  
数据库：mysql  redis
导入`zhihehe_base.sql`到数据库   

配置信息： `server/.env`  
access-db 配置方法：[https://access-db.cn](https://access-db.cn)

```shell
  cd server
  yarn

  # 开发
  yarn dev

  # 打包
  yarn build
  cd dist
  node server.js  # 一定要在 server.js 目录下启动
```