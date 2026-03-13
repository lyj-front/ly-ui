import { post,postFormData } from './unit'

/**
 * ListTablePage 模块
 */
class Server {
  // 列表接口配置示例
  @post()
  planList() {
    return '/college_web/lxt-plan/query'
  }

  @post()
  controlDept() {
    return '/nhr/hrDept/controlDept'
  }

  @post()
  shopsTree() {
    return '/nhr/jurisdictionShops/shopsTree'
  }
  @postFormData()
  cjIndexList() {
    return '/jjscj-schedule/ywjdsearch/cjIndexList'
  }
}

export default new Server()
