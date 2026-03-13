<template>
  <div class="ly-table-view">
    <div class="table-view-button" @click="showView = true">
      <i class="el-icon-view-eye"></i>
      <p class="ly-table-p">表头：{{ viewAct }}</p>
      <i
        :class="[
          showView ? 'el-icon-view-arrow-top' : 'el-icon-view-arrow-bottom',
        ]"
      ></i>
    </div>
    <div
      v-if="showView"
      class="table-view-box-mask"
      @click="showView = false"
    ></div>
    <div v-if="showView" class="view-box">
      <div class="view-sol">
        <div v-if="systemView.length > 0" class="view-item-title">系统表头</div>
        <div
          v-for="sys in systemView"
          :key="sys.viewTableId"
          :class="['view-item', sys.useStatus ? 'active' : '']"
          @click="useViewTable(sys)"
        >
          {{ sys.viewName }}
        </div>
        <ly-divider v-if="userView.length > 0"></ly-divider>
        <div v-if="userView.length > 0" class="view-item-title">个人表头</div>
        <div
          v-for="use in userView"
          :key="use.viewTableId"
          :class="['view-item', use.useStatus ? 'active' : '']"
          @click="useViewTable(use)"
        >
          {{ use.viewName }}
        </div>
      </div>
      <ly-divider></ly-divider>
      <div class="view-button" @click="dialogModel">
        <i class="el-icon-view-add"></i>
        <div>新建表头</div>
      </div>
      <div class="view-button" @click="gotoViewConfig">
        <i class="el-icon-table-config"></i>
        <div>表头管理</div>
      </div>
    </div>
    <ly-table-view-dialog
      v-model="showDialog"
      :view-table-id="selViewTableId"
      :list-id-name="listIdName"
      :system-id-name="systemIdName"
			:filter-status="tableFilterStatus"
      @closed="dialogClosed"
      @saveAndUse="saveAndUse"
    ></ly-table-view-dialog>
  </div>
</template>

<script>
import { ref, toRefs, reactive, computed, watch } from 'vue'
import { useServe, getTableInfo } from '@element-plus/hooks'
// import { LyMessageBox } from '@element-plus/components/message-box'

export default {
  name: 'LyTableView',
  props: {
    listIdName: {
      type: String,
      required: true,
    },
    systemIdName: {
      type: String,
      required: true,
    },
		systemViewTableList: {
			type: Array,
      required: true,
		},
		userViewTableList: {
			type: Array,
      required: true,
		},
		tableFilterStatus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['useViewChange'],
  setup(props, { emit }) {
    const { listIdName, systemIdName } = toRefs(props)
    const showView = ref(false)
    const showDialog = ref(false)
		const selViewTableId = ref('')
    const list = reactive({
      systemView: props.systemViewTableList || [],
      userView: props.userViewTableList || [],
		})

		watch(() => props.systemViewTableList, (newVal) => {
			// console.log(newVal, 'systemViewTableList')
			list.systemView = newVal
		}, { immediate: true })

		watch(() => props.userViewTableList, (newVal) => {
			// console.log(newVal, 'userViewTableList')
			list.userView = newVal
		}, { immediate: true })
		
    const viewAct = computed(() => {
      let actText = ''
      const view = list.systemView.find((item) => {
        return item.useStatus
      })
      if (!!view) {
        actText = view.viewName
      } else {
        const view2 = list.userView.find((item) => {
          return item.useStatus
        })
        if (!!view2) {
          actText = view2.viewName
        }
      }
      return actText
    })

    // 打开新建视图
    function dialogModel() {
      showView.value = false
      showDialog.value = true
      // 测试修改的情况
      // selViewTableId.value = '21'
    }

    // 关闭视图弹窗回调
    function dialogClosed() {
      init()
    }

    // 保存并使用视图的时候需要重新查询一遍表格的接口数据
    function saveAndUse() {
      emit('useViewChange')
    }

    // 前往配置页面
    function gotoViewConfig() {
      window.open(
        `/lyj-menu/syssetting/SYS_VIEW#/view?listIdName=${listIdName.value}&systemIdName=${systemIdName.value}&isNotBreadcrumb=true`
      )
    }

    // 选中视图
    async function useViewTable(sys) {
      // if (sys.useStatus) return 不进行判断是否为当前选中的视图，因为可能需要重新刷新一下表格数据
      const { data } = await useServe.http('useViewTable', {
        listIdName: listIdName.value,
        systemIdName: systemIdName.value,
        viewTableId: sys.viewTableId,
      })
      showView.value = false
      init()
      getTableInfo(listIdName.value, systemIdName.value)
      emit('useViewChange', data)
    }

    // 获取视图
    async function getViewTable() {
			const { data } = await useServe.http('getViewTable', {
				listIdName: listIdName.value,
				systemIdName: systemIdName.value,
      })
      list.systemView = data.systemViewTableList || []
			list.userView = data.userViewTableList || []
    }

    // 初始化组件
    function init() {
      getViewTable()
    }

    // onMounted(() => {
    //   init()
    // })

    return {
      ...toRefs(list),
      selViewTableId,
      showView,
      viewAct,
			showDialog,
      dialogModel,
      gotoViewConfig,
      useViewTable,
      dialogClosed,
      saveAndUse,
    }
  },
}
</script>
