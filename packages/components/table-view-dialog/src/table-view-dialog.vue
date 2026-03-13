<template>
  <ly-dialog
    v-model="showDialog"
    custom-class="ly-table-view-dialog"
    :title="`${viewTableId !== '' ? '修改表头' : '新建表头'}`"
    width="745px"
    :before-close="handleClose"
  >
    <ly-form
      ref="viewValidateForm"
      label-position="right"
      label-width="86px"
      :rules="rules"
      :model="viewFormData"
    >
      <ly-form-item label="表头名称:" prop="viewName">
        <ly-input
          v-model="viewFormData.viewName"
          class="table-view-input"
          maxlength="10"
          placeholder="请输入标题(最多10字)"
          @keyup="
            viewFormData.viewName = viewFormData.viewName.replace(
              /[^\u4e00-\u9fa5A-Za-z0-9]/gi,
              ''
            )
          "
        ></ly-input>
      </ly-form-item>
      <ly-form-item v-if="isFilter" label="设置表头条件:">
        <div class="view-select">
          <div class="view-radioType-item">
            <div class="view-item-title flex">
              <div class="c3188e8 mr20" @click="addCond">+添加条件</div>
              <template v-if="condition.length">
                <div class="mr10">条件关系:</div>
                <ly-radio-group class="radioType" v-model="radioType">
                  <ly-radio :label="1">与（AND）</ly-radio>
                  <ly-radio :label="2">或（OR）</ly-radio>
                </ly-radio-group>
              </template>
            </div>
            <div class="view-select-radio-cont">
              <div class="flex mb5" v-for="(cont,index) in condition" :key="index">
                <ly-select v-model="cont.conditionColumnId" filterable class="width150 mr10" placeholder="请选择字段名" @change="strCond(index, cont)">
                  <ly-option
                    v-for="item in typeDefault"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  >
                  </ly-option>
                </ly-select>
                <ly-select v-model="cont.operator" class="width150 mr10" placeholder="运算符" @change="strTypeCond(index)">
                  <ly-option
                    v-for="item in cont.setArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </ly-option>
                </ly-select>
                <template v-if="cont.operator&&cont.operatorStatus">
                  <template v-if="cont.type == 1&&(cont.operator!='8' && cont.operator!='9')">
                    <ly-input class="width250" v-model="cont.conditionValue" placeholder="请输入内容" maxlength="60"></ly-input>
                  </template>
                  <template v-else-if="cont.type == 2">
                    <template v-if="cont.operator=='1'">
                      <ly-date-picker class="width250" v-model="cont.conditionValue" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></ly-date-picker>
                    </template>
                    <template v-else-if="cont.operator!='8'&&cont.operator!='9'">
                      <ly-date-picker class="width250" v-model="cont.conditionValue" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择日期时间"></ly-date-picker>
                    </template>
                  </template>
                  <template v-else-if="cont.type == 3">
                    <template v-if="cont.operator=='1'">
                      <ly-date-picker class="width250" v-model="cont.conditionValue" type="daterange" value-format="YYYY-MM-DD" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></ly-date-picker>
                    </template>
                    <template v-else-if="cont.operator!='8'&&cont.operator!='9'">
                      <ly-date-picker class="width250" v-model="cont.conditionValue" type="date" value-format="YYYY-MM-DD" placeholder="选择日期时间"></ly-date-picker>
                    </template>
                  </template>
                  <template v-else-if="cont.type == 4">
                    <template v-if="cont.operator=='1'">
                      <ly-time-picker is-range class="width250" v-model="cont.conditionValue" value-format="HH:mm:ss" range-separator="至"  start-placeholder="开始日期" end-placeholder="结束日期"></ly-time-picker>
                    </template>
                    <template v-else-if="cont.operator!='8'&&cont.operator!='9'">
                      <ly-time-picker class="width250" v-model="cont.conditionValue" value-format="HH:mm:ss" placeholder="选择日期时间"></ly-time-picker>
                    </template>
                  </template>
                  <template v-else-if="cont.type == 5">
                    <template v-if="cont.operator=='10' || cont.operator=='11' || cont.operator=='12' || cont.operator=='13'">
                      <ly-select
                        v-model="cont.conditionValue"
                        class="width250"
                        multiple
                        filterable
                        remote
                        collapse-tags
                        :options="cont.defaultOptions"
                        placeholder="请输入人员查询"
                        :remote-method="
                          (keyword) => remoteMethodEmp(keyword, cont)
                        "
                        :loading="remoteLoading"
                        @change="(value) => remoteMethodChange(value, index)"
                      >
												<ly-option
                          v-for="item in cont.defaultOptions"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value"
                        ></ly-option>
											</ly-select>
                    </template>
                  </template>
                  <template v-else-if="cont.type == 7">
                    <template v-if="cont.operator!='8'&&cont.operator!='9'">
                        <ly-input class="width250" @keyup ="validateInput(index)" v-model="cont.conditionValue" placeholder="请输入数值"></ly-input>
                    </template>
                  </template>
                  <template v-else-if="cont.type == 8">
                    <template v-if="cont.operator!='8'&&cont.operator!='9'">
                      <ly-cascader class="width250" :props="cityProps.city" v-model="cont.conditionValue" :show-all-levels="false" clearable></ly-cascader>
                    </template>
                  </template>
                  <template v-else-if="cont.type == 9">
                    <template v-if="cont.operator!='8'&&cont.operator!='9'">
                      <ly-cascader class="width250" :props="cityProps.area" v-model="cont.conditionValue" :show-all-levels="false" clearable></ly-cascader>
                    </template>
                  </template>
                  <template v-else-if="cont.type == 10">
                    <template v-if="cont.operator!='8'&&cont.operator!='9'">
                      <ly-cascader class="width250" :props="cityProps.place" v-model="cont.conditionValue" :show-all-levels="false" clearable></ly-cascader>
                    </template>
                  </template>
                  <!-- 岗位组件 -->
                  <template v-else-if="cont.type == 11">
                    <template v-if="cont.operator!='8'&&cont.operator!='9'">
                      <ly-empSearch
                        v-model="cont.conditionValue"
                        :options="cont.defaultOptions"
                        multiple
                        apiKey="post"
                        placeholder="请输入岗位查询"
                        :value-key="'postId'"
                        @handleSelect="(value)=>{handSelect(value,index)}"
                      >
                      </ly-empSearch>
                    </template>
                  </template>
                  <!-- 职务组件 -->
                  <template v-else-if="cont.type == 12">
                    <template v-if="cont.operator!='8'&&cont.operator!='9'">
                      <ly-empSearch
                        v-model="cont.conditionValue"
                        :options="cont.defaultOptions"
                        multiple
                        apiKey="duty"
                        placeholder="请输入职务查询"
                        :value-key="'dutyNumber'"
                        @handleSelect="(value)=>{handSelect(value,index)}"
                      >
                      </ly-empSearch>
                    </template>
                  </template>
                  <!-- 部门组件 -->
                  <template v-else-if="cont.type == 13"> 
                    <template v-if="cont.operator!='8'&&cont.operator!='9'">
                      <ly-empSearch
                        v-model="cont.conditionValue"
                        :options="cont.defaultOptions"
                        multiple
                        apiKey="dept"
                        :value-key="'number'"
                        showStatus
                        placeholder="请输入部门查询"
                        @handleSelect="(value)=>{handSelect(value,index)}"
                      >
                      </ly-empSearch>
                    </template>
                  </template>
                  <!--枚举组件-->
                  <template v-else-if="cont.type == 14"> 
                    <template v-if="cont.operator!='8'&&cont.operator!='9'">
                      <ly-select
                        v-model="cont.conditionValue"
                        multiple
                        filterable
                        remote
                        collapse-tags
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="(keyword) => remoteMethod(keyword, cont)"
                        :loading="remoteLoading"
                        @change="(value) => remoteMethodChange(value, index)"
                      >
                        <ly-option
                          v-for="item in cont.defaultOptions"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value"
                        >
                        </ly-option>
                      </ly-select>
                    </template>
                  </template>
                </template>
                <ly-link class="width50" :underline="false" type="danger" @click="delCond(index)">删除</ly-link>
              </div>
            </div>
          </div>
        </div>
      </ly-form-item>
      <ly-form-item label="设置显示字段:">
        <div class="view-select">
          <div class="view-select-item">
            <div class="view-item-title">可选字段</div>
            <div class="view-select-item-box">
              <div class="view-system-search">
                <ly-input v-model="searchVal" @input="searchFieldChange" clearable placeholder="搜索字段">
                  <template #prefix>
                    <i class="el-input__icon el-icon-search"></i>
                  </template>
                </ly-input>
              </div>
              <div
                v-if="optionalField.length === 0"
                class="view-select-item-box-placeholder"
              >
                无可选字段
              </div>
              <div v-else class="view-system-field-list">
                <div
                  v-for="(field, index) in optionalField"
                  :key="field.listFieldId"
                  class="view-system-field"
                  @click="clickField(field, index)"
                >
                  <p>{{ field.fieldName }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="view-select-item">
            <div class="view-item-title">当前选定的字段</div>
            <div class="view-select-item-box no-left-border">
              <div
                v-if="selectField.length === 0"
                class="view-select-item-box-placeholder"
              >
                请点击左侧字段选中
              </div>
              <div v-else class="view-system-field-list" style="height: 100%;">
                <draggable
                  v-model="selectField"
                  tag="transition-group"
                  :animation="100"
                  item-key="fieldIdName"
                >
                  <template #item="{ element }">
                    <div
                      :key="element.fieldIdName + 'item'"
                      class="view-system-field"
                    >
                      <i class="el-icon-move-icon"></i>
                      <p :key="element.fieldIdName + 'p'">
                        {{ element.fieldName }}
                      </p>
                      <i
                        class="el-icon-ly-close"
                        @click.stop="clickSelectField(element)"
                      ></i>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>
          </div>
        </div>
      </ly-form-item>
      <ly-form-item
        v-if="isSysViewVerify"
        label="设置显示字段:"
        prop="viewType"
        style="margin-bottom: 0"
      >
        <ly-radio
          v-model="viewFormData.viewType"
          :disabled="viewTableId !== ''"
          label="1"
          >个人表头</ly-radio
        >
        <ly-radio
          v-if="!isAuth"
          v-model="viewFormData.viewType"
          :disabled="viewTableId !== ''"
          label="2"
          >系统表头</ly-radio
        >
      </ly-form-item>
      <range-select
        v-if="viewFormData.viewType == '2'"
        :dialog-obj="dialogObj"
      ></range-select>
      <ly-form-item
        v-if="isSysViewVerify"
        label="清除筛选条件:"
        prop="clearOldCon"
      >
        <ly-radio v-model="viewFormData.clearOldCon" :label="1">是</ly-radio>
        <ly-radio v-model="viewFormData.clearOldCon" :label="0">否</ly-radio>
      </ly-form-item>
    </ly-form>
    <template #footer>
      <span>
        <ly-button size="small" type="primary" @click="saveView">
          保存
        </ly-button>
        <ly-button
          v-if="viewTableId === ''"
          size="small"
          type="primary"
          @click="saveAndUseView"
        >
          保存并使用
        </ly-button>
        <ly-button size="small" @click="showDialog = false">取消</ly-button>
      </span>
    </template>
  </ly-dialog>
</template>

<script>
import { useShow, useServe, getTableInfo } from '@element-plus/hooks'
import draggable from 'vuedraggable'
import { ref, reactive, toRefs, watch, nextTick } from 'vue'
import { LyMessage } from '@element-plus/components/message'
import rangeSelect from './component/range-select.vue'

function sortBy(attr, rev) {
  //第二个参数没有传递 默认升序排列
  if (rev == undefined) {
    rev = 1
  } else {
    rev = rev ? 1 : -1
  }
  return function (a, b) {
    a = a[attr]
    b = b[attr]
    if (a < b) {
      return rev * -1
    }
    if (a > b) {
      return rev * 1
    }
    return 0
  }
}

export default {
  name: 'LyTableViewDialog',
  components: {
		draggable,
		rangeSelect,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    viewTableId: {
      type: String,
      default: '',
    },
    listIdName: {
      type: String,
      required: true,
    },
    systemIdName: {
      type: String,
      required: true,
    },
    filterStatus: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'closed', 'saveAndUse'],
	setup(props, { emit }) {
    const { listIdName, systemIdName } = toRefs(props) // 两个name
    const viewValidateForm = ref(null) // 表单ref
    const showDialog = ref(false) // 是否显示dialog
    const isSysViewVerify = ref(false) // 是否有配置系统视图的权限
    const optionalField = ref([]) // 可选字段
    const optionalFieldCopy = ref([]) // 可选字段
    const selectField = ref([]) // 当前选定的字段
    const isAuth = ref(false)
    //新加视图功能参数开始
    const radioType = ref(1)
    const typeDefault = ref([])
    const typeArr = ref([{
          value: '1',
          label: '字符串'
      },{
          value: '2',
          label: '日期年月日时分秒',
      },{
          value: '3',
          label: '日期年月日',
      },{
          value: '4',
          label: '时间时分秒',
      },{
          value: '5',
          label: '用户筛选',
      },{
          value: '7',
          label: '数值筛选',
      },{
          value: '8',
          label: '城市筛选',
      },{
          value: '9',
          label: '区域筛选',
      },{
          value: '10',
          label: '片区筛选',
      },{
          value: '11',
          label: '岗位控件',
      },{
          value: '12',
          label: '职务控件',
      },{
          value: '13',
          label: '部门控件',
      },{
          value: '14',
          label: '枚举控件',
      }])
    const conditionArr = reactive({
      //字符串
      first:[{
        value: '10',
        label: '属于（IN）',
        status:true
      },{
        value: '11',
        label: '不属于（NOT IN）',
        status:true
      },{
        value: '12',
        label: '包含（LIKE）',
        status:true
      },{
        value: '13',
        label: '不包含（NOT LIKE）',
        status:true
      },{
        value: '8',
        label: '为空（IS NULL）',
        status:false
      },{
        value: '9',
        label: '不为空（IS NOT NULL）',
        status:false
      }],
      // 时间控件2-4运算符一致，都用second
      second:[{
        value: '1',
        label: '之间（BETWEEN）',
        status:true
      },{
        value: '2',
        label: '等于（=）',
        status:true
      },{
        value: '3',
        label: '不等于（<>）',
        status:true
      },{
        value: '4',
        label: '大于（>）',
        status:true
      },{
        value: '5',
        label: '大于等于（>=）',
        status:true
      },{
        value: '6',
        label: '小于（<）',
        status:true
      },{
        value: '7',
        label: '小于等于（<=）',
        status:true
      },{
        value: '8',
        label: '为空（IS NULL）',
        status:false
      },{
        value: '9',
        label: '不为空（IS NOT NULL）',
        status:false
      }],
      //用户筛选
      fifth:[{
        value: '10',
        label: '属于（IN）',
        status:true
      },{
        value: '8',
        label: '为空（IS NULL）',
        status:false
      },{
        value: '9',
        label: '不为空（IS NOT NULL）',
        status:false
      },{
        value: '14',
        label: '当前登录用户',
        status:false
      }],
      //数值筛选
      seventh:[{
        value: '2',
        label: '等于（=）',
        status:true
      },{
        value: '3',
        label: '不等于（<>）',
        status:true
      },{
        value: '4',
        label: '大于（>）',
        status:true
      },{
        value: '5',
        label: '大于等于（>=）',
        status:true
      },{
        value: '6',
        label: '小于（<）',
        status:true
      },{
        value: '7',
        label: '小于等于（<=）',
        status:true
      },{
        value: '8',
        label: '为空（IS NULL）',
        status:false
      },{
        value: '9',
        label: '不为空（IS NOT NULL）',
        status:false
      }],
      // 岗位、职务、部门、枚举11-14都用nine
      eighth:[{
        value: '10',
        label: '属于（IN）',
        status:true
      },{
        value: '11',
        label: '不属于（NOT IN）',
        status:true
      },{
        value: '12',
        label: '包含（LIKE）',
        status:true
      },{
        value: '13',
        label: '不包含（NOT LIKE）',
        status:true
      },{
        value: '8',
        label: '为空（IS NULL）',
        status:false
      },{
        value: '9',
        label: '不为空（IS NOT NULL）',
        status:false
      }],
      nine: [{
        value: '10',
        label: '属于（IN）',
        status:true
      },{
        value: '11',
        label: '不属于（NOT IN）',
        status:true
      },{
        value: '8',
        label: '为空（IS NULL）',
        status:false
      },{
        value: '9',
        label: '不为空（IS NOT NULL）',
        status:false
      }]
		})

		const dialogObj = ref({
			rangeObj: {
					jmObj: {contain: -1, selList: [], list: [], loading: false,},
					companyObj: { contain: 1, selList: [], list: [], loading: false },
					deptObj: { contain: 1, selList: [], list: [], loading: false },
					postTypeObj: { contain: 1, selList: [], list: [], defaultList: [], loading: false },
					postObj: { contain: 1, selList: [], list: [], loading: false },
					sequenceObj: { contain: 1, selList: [], list: [], loading: false },
					dutyObj: { contain: 1, selList: [], list: [], loading: false },
					personObj: { contain: 1, selList: [], list: [], loading: false },
			},
			rangeList: [
					{ label: '包含', value: 1 },
					{ label: '排除', value: 2 },
			], // 应用范围1包含2排除
			rangeDefault: [
					{ configTag: 1, contain: 1, detailValue: '', detailValueName: '' },
					{ configTag: 2, contain: 1, detailValue: '', detailValueName: '' },
					{ configTag: 3, contain: 1, detailValue: '', detailValueName: '' },
					{ configTag: 4, contain: 1, detailValue: '', detailValueName: '' },
					{ configTag: 5, contain: 1, detailValue: '', detailValueName: '' },
					{ configTag: 6, contain: 1, detailValue: '', detailValueName: '' },
					{ configTag: 7, contain: 1, detailValue: '', detailValueName: '' },
			],
		})
    
    let defaultOptionsObj = {}
    let changeVals = {}
    // 条件集合
    const condition = ref([])
    //封装可回显的数据
    function dataResult(){
      const _old = JSON.parse(JSON.stringify(condition.value))
      // eslint-disable-next-line no-console
      // console.log('_old: ', _old);
      const _new = []
      if (_old) {
        condition.value = []
        _old.filter((item, index) => {
          const supportFilter = viewFieldAll.value.filter(
            (arr) => arr.id == item.conditionColumnId
          )[0].supportFilter;
          // eslint-disable-next-line no-console
          // console.log('supportFilter: ', supportFilter);
          if (supportFilter != 0) { // 当关闭筛选字段的时候，不显示该字段
            _new.push(item)
            if ([11, 12, 13, 14].includes(item.type)) {
              // 岗位、职务、部门、枚举值为字符串的时候，需要特殊处理为数组
              item.defaultOptions =
                typeof item.defaultOptions == 'string'
                  ? item.defaultOptions.split(',')
                  : item.defaultOptions
            }
            // eslint-disable-next-line no-console
            _new[index]['conditionValue'] = item.defaultOptions
            _new[index]['conditionColumnId'] = item.conditionColumnId
            _new[index]['setArr'] = item.setArr
            _new[index]['type'] = item.type + ''
            _new[index]['id'] = item.id + ''
            _new[index]['operator'] = item.operator + ''
            _new[index]['operatorStatus'] = true
            _new[index]['defaultOptions'] = item.userOptions || []
            _new[index]['interfaceUrl'] = item.interfaceUrl + ''
            _new[index]['supportFilter'] = supportFilter + ''
            _new[index]['dbFieldName'] = item.dbFieldName + ''
            defaultOptionsObj[index] = item.userOptions || []
            changeVals[index] = _new[index]['conditionValue']
          }
        })
      }
      condition.value = _new
    }
    //添加条件
    function addCond(){
      let obj = {
        type:null, //控件类型ID
        setType:null, //控件类型
        operator:null, //运算符具体的值
        setArr:[], //运算符集合
        conditionColumn:null, //条件字段,类似'planStatus'
        conditionValue:null, //条件具体的值
        defaultOptions:[], //多选下拉默认的值（回显专用）
        conditionColumnId:null,
        sort:null, //索引
        id:null, //编辑id
        viewTableId:null,////编辑tableId
        operatorStatus: false,
        interfaceUrl: '',
        supportFilter: false
      }
      condition.value.push(obj)
    }
    //删除条件
    function delCond(index){
      let arr = condition.value.filter((item,num)=> num != index)
      condition.value = arr
    }
    //选择运算符清空值
    function strTypeCond(index){
      condition.value[index].conditionValue = null
      condition.value[index].operatorStatus = true
      defaultOptionsObj[index] = []
      changeVals[index] = []
    }
    //选择条件切换运算符
    function strCond(index, cont) {
      //动态赋值控件类型setType
      typeDefault.value.forEach((item) => {
        if (item.id == cont.conditionColumnId) {
          condition.value[index]['type'] = item.value
          if (item.interfaceUrl) {
            condition.value[index]['interfaceUrl'] = item.interfaceUrl
          }
        }
      })
      condition.value[index].operator = null
      condition.value[index].conditionValue = null
      condition.value[index].operatorStatus = false
      defaultOptionsObj[index] = []
      changeVals[index] = []
      let str = condition.value[index].type
      switch (str) {
        case '1':
          condition.value[index].setArr = conditionArr.first
          break
        case '2':
          condition.value[index].setArr = conditionArr.second
          break
        case '3':
          condition.value[index].setArr = conditionArr.second
          break
        case '4':
          condition.value[index].setArr = conditionArr.second
          break
        case '5':
          condition.value[index].setArr = conditionArr.fifth
          break
        case '7':
          condition.value[index].setArr = conditionArr.seventh
          break
        case '8':
          condition.value[index].setArr = conditionArr.eighth
          break
        case '9':
          condition.value[index].setArr = conditionArr.eighth
          break
        case '10':
          condition.value[index].setArr = conditionArr.eighth
          break
        case '11':
          condition.value[index].setArr = conditionArr.nine
          break
        case '12':
          condition.value[index].setArr = conditionArr.nine
          break
        case '13':
          condition.value[index].setArr = conditionArr.nine
          break
        case '14':
          condition.value[index].setArr = conditionArr.nine
          break
        default:
          condition.value[index].setArr = conditionArr.first
      }
    }
    //用户ID
    function handSelect(value, index) {
      defaultOptionsObj[index] = value.allValue
      changeVals[index] = value.allValue.length
      // condition.value[index].defaultOptions = value.allValue
      // console.log('handSelect:', condition.value)
    }

    //城市片区cityProps
    const cityProps = reactive({
      city:{ city: true ,cityLevel:2 ,multiple:false},
      area:{ city: true ,cityLevel:3 ,multiple:false},
      place:{ city: true ,cityLevel:4 ,multiple:false},
    })
    //新加视图功能参数结束
    // 将 modelValue 与 showDialog 绑定
    useShow(props, showDialog, emit)

    const viewFormData = reactive({
      viewName: '',
      viewType: '1',
      authorityList: [],
      clearOldCon: 1,
    })

    const rules = {
      viewName: { required: true, message: '请输入表头名称', trigger: 'blur' }
    }

    // 关闭弹窗
    function handleClose() {
      showDialog.value = false
		}

		// 监听 props 变化并更新本地状态
		const isFilter = ref(false)
		watch(() => props.filterStatus, (newVal) => {
			isFilter.value = newVal
			// console.log('isFilter.value:', isFilter.value)
    }, { immediate: true })

    watch(showDialog, async (val) => {
      if (!val) {
        // 重置数据
        viewFormData.viewName = ''
        viewFormData.viewType = '1'
        viewFormData.clearOldCon = 1
        selectField.value = []
        condition.value = []
        radioType.value = 1
        // typeDefault.value = []
        // getViewFieldById()
        for (let i in dialogObj.value.rangeObj) {
          if (i == 'jmObj') {
            dialogObj.value.rangeObj[i].contain = -1
          } else {
            dialogObj.value.rangeObj[i].contain = 1
          }
          dialogObj.value.rangeObj[i].selList = []
          dialogObj.value.rangeObj[i].list = []
        }
      } else {
        await getViewFieldById()
        await nextTick()
        if (props.viewTableId == '') {
          // 新增
          getViewFieldById()
        } else {
          // 修改
          const { data } = await useServe.http('queryViewInfo', {
            viewTableId: props.viewTableId,
            listIdName: listIdName.value,
            systemIdName: systemIdName.value,
          })
          viewFormData.viewName = data.viewName
          viewFormData.viewType = data.viewType + ''
          viewFormData.clearOldCon = data.clearOldCon
          setRangeList(data.authorityList)
          selectField.value = data.fieldIdList || []
          optionalField.value = data.noFieldIdList || []
          optionalFieldCopy.value = data.noFieldIdList || []
          if (data.tableConditionsList) {
            condition.value = data.tableConditionsList
            if (data.conditions) {
              if (data.conditions == 'AND') {
                radioType.value = 1
              } else if (data.conditions == 'OR') {
                radioType.value = 2
              }
            }
            dataResult()
          }
        }
      }
    })

    // 点击选中字段
    function clickField(field, index) {
      selectField.value.push(field)
      optionalField.value = optionalField.value.filter(item => item.id !== field.id)
      optionalFieldCopy.value = optionalFieldCopy.value.filter(item => item.id !== field.id)
    }

    // 筛选可选字段vscode-file://vscode-app/c:/Users/DELL/AppData/Local/Programs/cursor/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html
    const searchVal = ref('')
    function searchFieldChange(val) {
      optionalField.value = optionalFieldCopy.value.filter(item => item.fieldName.indexOf(val) !== -1)
    }
    //视图条件校验数值
    function validateInput(index){
      let _str = condition.value[index].conditionValue
      _str = _str.replace(/[^\d.]/g, ""); //清除"数字"和"."
      _str = _str.replace(/^\./g, ""); //验证第一个字符是数字而不是
      _str = _str.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      _str = _str.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      _str = _str.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两位小数
      condition.value[index].conditionValue = _str
    }
    // 点击删除当前选定的字段
    function clickSelectField(sField) {
      optionalField.value.push(sField)
      optionalField.value.sort(sortBy('sort', true))
      optionalFieldCopy.value = optionalField.value
      const index = selectField.value.findIndex(
        (item) => item.fieldIdName === sField.fieldIdName
      )
      selectField.value.splice(index, 1)
    }

    function getSaveData() {
      let _conditions = null
      if(radioType.value){
        if(radioType.value == 1){
          _conditions = 'AND'
        }else if(radioType.value == 2){
          _conditions = 'OR'
        }
      }
      return {
        systemIdName: systemIdName.value,
        listIdName: listIdName.value,
        viewName: viewFormData.viewName,
        viewType: viewFormData.viewType, // 默认是个人视图
        authorityList: getAuthorityList(),
        fieldIdList: selectField.value,
        conditions: _conditions,
        clearOldCon: viewFormData.clearOldCon,
        rangeType: dialogObj.value.rangeObj.jmObj.contain,
      }
    }
    //视图组件条件字段整合
    function quertData(){
      let _arr = [] //返回的值
      condition.value.forEach((item,index) => {
        let _array = [] //选中的值
        let _obj = {
          conditionColumn:null,
          type:null,
          operator:null,
          conditionValue:null,
          sort:null,
          id:null,
          viewTableId:null,
          defaultOptions: [],
          conditionColumnId:null,
          setArr:[],
        }
        typeDefault.value.forEach((cont) => {
          if( cont.id == item.conditionColumnId ){
            //原数据就是所有字段选择
            _obj.conditionColumn = cont.dbFieldName //原数据中的fieldIdName,封装数据中的conditionColumn
            _obj.conditionColumnId = cont.id //新加原数据中的id
            _obj.type = cont.value //原数据中的controlType，封装数据中的type
          }
        })
        if(Array.isArray(item.conditionValue)){
          item.conditionValue.forEach((txt)=>{
            _array.push({[_obj.conditionColumn+'']:txt})
          })
        }else{
          _array.push({[_obj.conditionColumn+'']:item.conditionValue})
        }
        _obj.conditionValue = JSON.stringify(_array)
        _obj.valueRules = item.conditionValue
        _obj.operator = item.operator
        _obj.defaultOptions = defaultOptionsObj[index]
        _obj.setArr = item.setArr
        _obj.operatorStatus = true
        _obj.sort = index
        _obj.interfaceUrl = item.interfaceUrl
        _obj.supportFilter = item.supportFilter
        _arr.push(_obj)
      })
      // console.log('_arr: ', _arr);
      return _arr
    }
    // 校验条件
    function queryDataRules(obj){
      let _table = obj
      if(_table.length != 0){
          let _status = null
          //AND OR
          // console.log(radioType.value)
          if(!radioType.value){
            _status = 4
          }
          _table.forEach((item,index) => {
            if(!item.conditionColumnId){
              _status = 1
            }else{
              if(!item.operator){
                _status = 2
              }else{
                if(item.type==1){
                  if((item.operator == '12' || item.operator == '13') && !item.valueRules){
                    _status = 3
                  }
                }else if(item.type==5){
                  if((item.operator == '10' || item.operator == '11' || item.operator == '12' || item.operator == '13') && !item.valueRules){
                    _status = 3
                  }
                }else if(['11', '12', '13', '14'].includes(item.type)){
                  if(item.operator !='8' && item.operator !='9'&& !item.valueRules.length){
                    _status = 3
                  }
                }else{
                  if(item.operator !='8' && item.operator !='9'&& !item.valueRules){
                    _status = 3
                  }
                }
              }
            }
          })
          // console.log(_status)
          if(_status){
            if(_status == 4){
              LyMessage('请先检查表头条件传值')
            }else if(_status == 1){
              LyMessage('请选择字段名')
            }else if(_status == 2){
              LyMessage('请选择运算符')
            }else if(_status == 3){
              LyMessage('请输入表头筛选值')
            }
            return false
          }
        }
        return true
    }
    // 保存视图
    function saveView() {
      viewValidateForm.value.validate(async (valid) => {
        if (valid) {
          let _table = quertData() //封装请求的数据
          let _status = queryDataRules(_table) //校验通过返回true，否则false
          if(!_status) return false
          //视图条件结束
          if (props.viewTableId !== '') {
            try {
              await useServe.http('updateView', {
                viewTableId: props.viewTableId,
                ...getSaveData(),
                tableConditionsList:_table
              })
              showDialog.value = false
              LyMessage('修改成功')
            } catch (error) {
              LyMessage(error.errorInfo)
            }
          } else {
            try {
              await useServe.http('saveView', {...getSaveData(),tableConditionsList:_table})
              showDialog.value = false
              LyMessage('新建表头成功')
            } catch (error) {
              LyMessage(error.errorInfo)
            }
          }
        } else {
          return false
        }
      })
    }

    // 保存并使用视图
    function saveAndUseView() {
      viewValidateForm.value.validate(async (valid) => {
        if (valid) {
          try {
            let _table = quertData() //封装请求的数据
            let _status = queryDataRules(_table) //校验通过返回true，否则false
            if(!_status) return false
            await useServe.http('saveAndUseView', {...getSaveData(),tableConditionsList:_table})
            getTableInfo(listIdName.value, systemIdName.value)
            showDialog.value = false
            LyMessage('已保存并使用表头')
            nextTick(() => {
              emit('saveAndUse')
            })
          } catch (error) {
            LyMessage(error.errorInfo)
          }
        } else {
          return false
        }
      })
    }

    // 获取可选字段
    const viewFieldAll = ref([])
    async function getViewFieldById() {
      const { data } = await useServe.http('queryAllField', {
        listIdName: listIdName.value,
        systemIdName: systemIdName.value,
      })
      optionalField.value = data
      optionalFieldCopy.value = data
      viewFieldAll.value = data
      typeDefault.value = JSON.parse(JSON.stringify(data)).filter(item => item.supportFilter != 0) // 字段筛选为0关闭 1开启 2为自定义
      // console.log('typeDefault.value: ', typeDefault.value);
      typeDefault.value.forEach((item,index) => {
        typeDefault.value[index].label = item.fieldName
        typeDefault.value[index].value = item.controlType+''
        typeDefault.value[index].name = item.fieldIdName
        typeDefault.value[index].id = item.id
      })
    }

    async function getSysViewVerify() {
      const { data } = await useServe.http('sysViewVerify')
      isSysViewVerify.value = data
    }

    async function fieldAuthGetAuth() {
      const { data } = await useServe.http('fieldAuthGetAuth', {
        listIdName: listIdName.value,
        systemIdName: systemIdName.value,
      })
      isAuth.value = data
    }

    const remoteLoading = ref(false)
    async function remoteMethod(query, item) {
      // console.log('item: ', item);
      if (query) {
        remoteLoading.value = true
        const res = await fetchUrl(item.interfaceUrl, { keyword: query }).catch((err) => {
					remoteLoading.value = false
        })
        remoteLoading.value = false
        if (res.success) {
          item.defaultOptions = (res.data || []).map((item) => {
            return {
              name: item.showName,
              value: item.value
            }
          })
        } else {
          item.defaultOptions = []
        }
      }
    }

    function remoteMethodChange(val, index) {
      if (!defaultOptionsObj[index] || defaultOptionsObj[index].length == 0) {
        defaultOptionsObj[index] = []
        changeVals[index] = []
      }
      if (val.length > changeVals[index].length) { // 新增
        const extraVal = val
          .filter((item) => !changeVals[index].includes(item))
          .join(',')
        const list = condition.value[index].defaultOptions.filter(
          (item) => item.value === extraVal
        )
        defaultOptionsObj[index] = [...defaultOptionsObj[index], ...list]
      } else { // 删除
        const missingVal = changeVals[index]
          .filter((item) => !val.includes(item))
          .join(',')
        const arrIndex = defaultOptionsObj[index].findIndex(
          (item) => item.value === missingVal
        )
        defaultOptionsObj[index].splice(arrIndex, 1);
      }
      changeVals[index] = val
      // console.log('defaultOptionsObj[index]: ', defaultOptionsObj[index]);
    }

    async function remoteMethodEmp(query, item) {
      // console.log('item: ', item);
      if (query) {
        remoteLoading.value = true
        const res = await fetchFormDataUrl('/nhr/common/selectEmpList', {
          pageNum: 1,
          pageSize: 100,
          keyword: query,
					status: 1, // 人员状态 1.在职，2.离职，默认1
        }).catch((err) => {
					remoteLoading.value = false
        })
        remoteLoading.value = false
        if (res && res.length) {
          item.defaultOptions = (res || []).map((item) => {
            return {
              name: item.empName + '--' + item.deptName,
              value: item.empNumber,
            }
          })
        } else {
          item.defaultOptions = []
        }
      }
    }

    function fetchUrl(url, options = {}) {
      return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'post', // 指定请求方法为 POST
          headers: {
            'Content-Type': 'application/json'
					},
          body: JSON.stringify(options)
        })
        .then((response) => {
          response.json().then(data => {
            resolve(data)
          })
        })
        .catch(error => {
          reject(error); // 抛出错误，可以在调用时捕获
        })
      })
		}

		function fetchFormDataUrl(url, options = {}) {
			let formData = ''
			Object.keys(options).forEach((key, index) => {
				const val = options[key]
				if (index > 0) formData += '&'
				formData += `${key}=${val}`
			})
		  return new Promise((resolve, reject) => {
        fetch(url, {
          method: 'post', // 指定请求方法为 POST
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: formData
        })
        .then((response) => {
          response.json().then(data => {
            resolve(data)
          })
        })
        .catch(error => {
          reject(error); // 抛出错误，可以在调用时捕获
        })
      })
		}

    function getAuthorityList() {
			let list = []
			let obj = {
				containType: null,
				authorityName: "",
				authorityNumber: "",
				viewSystemType: null
			}
			for (let i in dialogObj.value.rangeObj) {
				const selList = dialogObj.value.rangeObj[i].selList || []
				obj.containType = dialogObj.value.rangeObj[i].contain
				if (i == 'companyObj') {
					// 公司
					obj.viewSystemType = 6
					selList.forEach(item => {
							obj.authorityName = item.shortName
							obj.authorityNumber = item.oldId +''
							list.push(JSON.parse(JSON.stringify(obj)))
					})
				} else if (i == 'deptObj') {
					// 部门
					obj.viewSystemType = 4
					selList.forEach(item => {
							obj.authorityName = item.name
							obj.authorityNumber = item.number +''
							list.push(JSON.parse(JSON.stringify(obj)))
					})
				} else if (i == 'dutyObj') {
					// 岗位
					obj.viewSystemType = 3
					selList.forEach(item => {
							obj.authorityName = item.dutyName
							obj.authorityNumber = item.dutyNumber +''
							list.push(JSON.parse(JSON.stringify(obj)))
					})
				} else if (i == 'personObj') {
					// 人员
					obj.viewSystemType = 1
					selList.forEach(item => {
							obj.authorityName = item.showName
							obj.authorityNumber = item.empNumber +''
							list.push(JSON.parse(JSON.stringify(obj)))
					})
				} else if (i == 'postObj') {
					// 职位
					obj.viewSystemType = 2
					selList.forEach(item => {
							obj.authorityName = item.name
							obj.authorityNumber = item.postId +''
							list.push(JSON.parse(JSON.stringify(obj)))
					})
				} else if (i == 'postTypeObj') {
					// 职位类型
					obj.viewSystemType = 5
					selList.forEach(item => {
							obj.authorityName = item.name
							obj.authorityNumber = item.number +''
							list.push(JSON.parse(JSON.stringify(obj)))
					})
				} else if (i == 'sequenceObj') {
					// 序列
					obj.viewSystemType = 7
					selList.forEach(item => {
							obj.authorityName = item.name
							obj.authorityNumber = item.id +''
							list.push(JSON.parse(JSON.stringify(obj)))
					})
				}
			}
			return list
	}

		// 设置应用范围数据 item为提交时设置对象
		function setRangeList(data) {
			let dataArr = data || []
			dataArr.forEach(item => {
				let obj = {}, key='', keyValue = '', keyName = '';
				switch (item.viewSystemType) {
					case 1:
						// 人员
						key = 'personObj'
						keyValue = 'empNumber'
						keyName = 'showName'
						break;
					case 2:
						// 职位
						key = 'postObj'
						keyValue = 'id'
						keyName = 'name'
						break;
					case 3:
						// 岗位
						key = 'dutyObj'
						keyValue = 'dutyNumber'
						keyName = 'dutyName'
						break;
					case 4:
						// 部门
						key = 'deptObj'
						keyValue = 'number'
						keyName = 'name'
						break;
					case 5:
						// 职位类型
						key = 'postTypeObj'
						keyValue = 'number'
						keyName = 'name'
						break;
					case 6:
						// 公司
						key = 'companyObj'
						keyValue = 'oldId'
						keyName = 'shortName'
						break;
					case 7:
						// 序列
						key = 'sequenceObj'
						keyValue = 'id'
						keyName = 'name'
						break;
					default:
						break;
				}
				obj[keyValue] = item.authorityNumber || ''
				obj[keyName] = item.authorityName || ''
				dialogObj.value.rangeObj[key].selList.push(obj)
				dialogObj.value.rangeObj[key].list.push(obj)
				dialogObj.value.rangeObj[key].contain = item.containType || 1
			})
			dialogObj.value.rangeObj.jmObj.contain = dataArr[0]?.rangeType || -1
			// console.log('setRangeList dialogObj:', dialogObj.value.rangeObj)
		}

    // 进来默认获取一次可选字段 及 权限
    if (props.viewTableId === '') {
      getViewFieldById()
    }

    getSysViewVerify()
    fieldAuthGetAuth()
    return {
      rules,
      showDialog,
      handleClose,
      optionalField,
      selectField,
      viewFormData,
      clickField,
      clickSelectField,
      searchVal,
      searchFieldChange,
      saveView,
      saveAndUseView,
      isSysViewVerify,
      viewValidateForm,
      isAuth,
      radioType,
      typeArr,
      typeDefault,
      condition,
      strCond,
      addCond,
      delCond,
      strTypeCond,
      handSelect,
      cityProps,
      validateInput,
      remoteMethod,
			remoteMethodChange,
			remoteMethodEmp,
			remoteLoading,
			dialogObj,
			isFilter
    }
  },
}
</script>

