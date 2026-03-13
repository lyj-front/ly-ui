import Pagination from './src'
import { reactive } from 'vue'

import type { App } from 'vue'
import type { SFCWithInstall } from '@element-plus/utils/types'

const _Pagination = Pagination as SFCWithInstall<typeof Pagination>

_Pagination.install = (app: App) => {
  app.component(_Pagination.name, _Pagination)
}

export default _Pagination
export const LyPagination = _Pagination

export function PaginationControl(maxPage, pageSize = 25) {
  const pageInfo = reactive({
    No: 1,
    Size: pageSize || 25,
    Total: 0,
    trueTotal: 0,
  })
  // 重置
  function pageReset() {
    pageInfo.No = 1
    pageInfo.Size = pageSize || 25
    pageInfo.Total = 0
    pageInfo.trueTotal = 0
  }
  // 修改 No
  function handleCurrentChange(val) {
    pageInfo.No = val
    return null
  }
  // 修改 Size
  function handleSizeChange(val) {
    pageInfo.Size = val
    getTotal()
    return null
  }
  //获取
  function getTotal() {
    maxPage = Number(maxPage)
    if (maxPage === 0) {
      pageInfo.trueTotal = pageInfo.Total
    } else {
      pageInfo.trueTotal =
        pageInfo.Total > pageInfo.Size * maxPage
          ? pageInfo.Size * maxPage
          : pageInfo.Total
    }
  }

  return {
    pageInfo,
    pageReset,
    handleCurrentChange,
    handleSizeChange,
    getTotal,
  }
}

export * from './src/pagination'
