import React, { useState, useEffect } from "react"
import {useDispatch} from 'react-redux'
import { Button } from "antd"
import Excel from "exceljs"
import { DownloadOutlined } from '@ant-design/icons'

import {fetchPost} from '@/constants/config'

/** 接口返回的数据格式
  {
  "data": {
    "total": 3,
    "columns": [
      {
        "dataIndex": "name",
        "title": "姓名"
      },
      {
        "dataIndex": "age",
        "title": "年龄"
      }
    ],
    "rows": [
      {
        "id": 1,
        "name": "tom",
        "age": "18"
      },
      {
        "id": 2,
        "name": "jim",
        "age": "25"
      },
      {
        "id": 3,
        "name": "tim",
        "age": "25"
      }
    ]
  }
}
 */

interface TableDownloadProps {
  text?: string // 下载按钮内文字
  execlTitle?: string // 导出execl文件名
  selectedUrl?: string // 接口地址url
  body?: any  // 请求参数
}
const TableDownload = ({
  text = "导出全部",
  selectedUrl = '',
  execlTitle = "表格数据",
  body={}
}: TableDownloadProps) => {
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)



  // 加载数据
  const getData = async () => {
    setLoading(true)
    let data = (await fetchPost(selectedUrl, {
      ...body
    }, dispatch)).data
    setLoading(false)
    fetchTableDatas(data.columns, data.rows)
  }

  // 执行下载表格
  const fetchTableDatas = (tableColumns: any, tableRows: any) => {
    // 初始化 创建工作簿
    const workbook = new Excel.Workbook()
    // 设置工作簿属性
    workbook.creator = "admin"
    workbook.lastModifiedBy = "admin"
    workbook.created = new Date()
    workbook.modified = new Date()

    // 添加工作表
    let sheet = workbook.addWorksheet("sheet")

    let columns: any = []
    // 表头格式化
    tableColumns.map((item: any) => {
      columns.push({
        header: item.title,
        key: item.key || item.dataIndex,
        width: item.width / 6 || 40,
      })
      return true
    })

    // 添加表头
    sheet.columns = columns

    if (Array.isArray(tableRows)) {
      // 添加表格数据
      sheet.addRows(tableRows)

      // 设置每一列样式 居中
      const row = sheet.getRow(1)
      row.eachCell((cell, rowNumber) => {
        sheet.getColumn(rowNumber).alignment = {
          vertical: "middle",
          horizontal: "center",
        }
      })

      // 将表格数据转为二进制
      workbook.xlsx.writeBuffer().then((buffer) => {
        writeFile(`${execlTitle}.xlsx`, buffer)
      });
    } else {
      alert("下载失败")
    }
  }

  // 将二进制转为Excel并下载
  const writeFile = (fileName: any, content: any) => {
    let a = document.createElement("a")
    let blob = new Blob([content], { type: "text/plain" })

    a.download = fileName
    a.href = URL.createObjectURL(blob)

    a.click()
  };

  return (
    <Button
      type='default'
      icon={<DownloadOutlined />}
      loading={isLoading}
      onClick={async () => {
        if(!selectedUrl) return
        await getData()
      }}
    >
      {isLoading ? "正在导出" : text}
    </Button>
  );
};

export default TableDownload