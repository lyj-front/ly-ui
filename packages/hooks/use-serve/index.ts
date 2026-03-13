import ServerConstruction from './serverConstruction'

/**
 * ListTablePage 模块
 */
class Server extends ServerConstruction {
  // 列表接口配置示例
  lxtPlanList() {
    return {
      name: '/college_web/lxt-plan/query',
      method: 'post',
    }
  }
  // 列表接口配置示例
  posterList() {
    return {
      name: '/college_web/lxt-plan/query',
      method: 'post',
    }
  }

  // 获取当前可展示视图
  getViewTable() {
    return {
      name: '/common/view_web/viewTable/getViewTable',
      method: 'post',
    }
  }

  // 获取可选字段
  queryAllField() {
    return {
      name: '/common/view_web/viewSystem/queryAllField',
      method: 'post',
    }
  }

  // 获取视图展示字段
  getViewFieldById() {
    return {
      name: '/common/view_web/viewTable/getViewFieldById',
      method: 'post',
    }
  }

  // 修改视图的时候，用来回显数据的接口
  viewTableSetInfo() {
    return {
      name: '/common/view_web/viewTableSet/queryInfo',
      method: 'post',
    }
  }

  //  使用视图
  useViewTable() {
    return {
      name: '/common/view_web/viewTable/useViewTable',
      method: 'post',
    }
  }

  // 新增视图
  saveView() {
    return {
      name: '/common/view_web/viewTable/save',
      method: 'post',
    }
  }

  // 修改视图设置前查看返回值
  queryViewInfo() {
    return {
      name: '/common/view_web/viewTableSet/queryInfo',
      postType: 'query',
      method: 'post',
    }
  }

  // 修改视图设置
  updateView() {
    return {
      name: '/common/view_web/viewTable/update',
      method: 'post',
    }
  }

  // 新增并使用视图
  saveAndUseView() {
    return {
      name: '/common/view_web/viewTable/saveAndUse',
      method: 'post',
    }
  }

  // 获取是否有修改系统视图的权限
  sysViewVerify() {
    return {
      name: '/common/view_web/viewTable/sysViewVerify',
      method: 'post',
    }
  }

  // 查人员
  findEmpBykey() {
    return {
      name: '/nhr/common/findEmpBykey',
      errorToast: false,
      checkSuccess: false,
      postType: 'form',
      method: 'post',
    }
  }

  // 查岗位
  findPostBykey() {
    return {
      name: '/nhr/common/findPostBykey',
      errorToast: false,
      checkSuccess: false,
      postType: 'form',
      method: 'post',
    }
  }

  // 查岗位类别
  selectPostTypeNewList() {
    return {
      name: '/nhr/common/selectPostTypeNewList',
      errorToast: false,
      checkSuccess: false,
      postType: 'form',
      method: 'post',
    }
  }

  // 查职务
  findDutyBykey() {
    return {
      name: '/nhr/common/findDutyBykey',
      errorToast: false,
      postType: 'form',
      method: 'post',
    }
  }

  // 查部门
  findDeptBykey() {
    return {
      name: '/nhr/common/findDeptBykey',
      errorToast: false,
      checkSuccess: false,
      postType: 'form',
      method: 'post',
    }
  }

  // 查组织架构
  queryDept() {
    return {
      name: '/nhr/personnalFile/queryDept',
      errorToast: false,
      checkSuccess: false,
      postType: 'form',
      method: 'post',
    }
  }

  // 查公司
  companyList() {
    return {
      name: '/nhr/common/companyList',
      errorToast: false,
      checkSuccess: false,
      postType: 'form',
      method: 'post',
    }
  }

  // 查询序列
  sequenceList() {
    return {
      name: '/nhr/common/sequenceList',
      errorToast: false,
      checkSuccess: false,
      postType: 'form',
      method: 'post',
    }
  }

  // 查询岗位
  selectDutyByKeyword() {
    return {
      name: '/nhr/common/selectDutyByKeyword',
      errorToast: false,
      checkSuccess: false,
      postType: 'form',
      method: 'post',
    }
  }

  fieldAuthGetAuth() {
    return {
      name: '/common/view_web/fieldAuth/getAuth',
      method: 'post',
    }
  }
}

export default new Server()
