<template>
	<!--应用范围-->
	<ly-form-item label="应用范围:" prop="rangeAccount" style="margin-bottom: 4px;">
		<div style="position: relative;">
			<ly-radio-group v-model="dialogObj.rangeObj.jmObj.contain" @change="jmChange">
				<ly-radio :label="-1">不区分</ly-radio>
				<ly-radio :label="1">仅直营</ly-radio>
				<ly-radio :label="2">仅加盟</ly-radio>
			</ly-radio-group>
		</div>
	</ly-form-item>
	<ly-form-item class="mt10" label="公司:" prop="rangeCompany">
		<ly-select class="sel-contain" style="width:100px;" v-model="dialogObj.rangeObj.companyObj.contain"
			placeholder="请选择">
			<ly-option v-for="item in dialogObj.rangeList" :key="item.value" :label="item.label"
				:value="item.value"></ly-option>
		</ly-select>
		<ly-select class="sel-option ml10" style="width:calc(100% - 110px);" v-model="dialogObj.rangeObj.companyObj.selList"
			value-key="oldId" placeholder="请选择公司" multiple collapse-tags auto-popper filterable show-all reserve-keyword
			remote :remote-method="companyApi" :loading="dialogObj.rangeObj.companyObj.loading" @visible-change="companyApi">
			<ly-option v-for="item in dialogObj.rangeObj.companyObj.list" :key="item.oldId" :label="item.shortName"
				:value="item"></ly-option>
		</ly-select>
	</ly-form-item>

	<ly-form-item class="mt10" label="部门:" prop="rangeDept">
		<ly-select class="sel-contain" style="width:100px;" v-model="dialogObj.rangeObj.deptObj.contain" placeholder="请选择">
			<ly-option v-for="item in dialogObj.rangeList" :key="item.value" :label="item.label"
				:value="item.value"></ly-option>
		</ly-select>
		<ly-select class="sel-option ml10" style="width:calc(100% - 110px);" v-model="dialogObj.rangeObj.deptObj.selList"
			value-key="number" placeholder="请选择部门" multiple collapse-tags auto-popper filterable show-all reserve-keyword
			remote :remote-method="deptApi" :loading="dialogObj.rangeObj.deptObj.loading" @visible-change="deptApi()">
			<ly-option v-for="item in dialogObj.rangeObj.deptObj.list" :key="item.number" :label="item.name"
				:value="item"></ly-option>
		</ly-select>
	</ly-form-item>

	<ly-form-item class="mt10" label="职位类型:" prop="rangeDutyType" v-if="dialogObj.rangeObj.jmObj.contain !== 2">
		<ly-select class="sel-contain" style="width:100px;" v-model="dialogObj.rangeObj.postTypeObj.contain"
			placeholder="请选择">
			<ly-option v-for="item in dialogObj.rangeList" :key="item.value" :label="item.label"
				:value="item.value"></ly-option>
		</ly-select>
		<ly-select class="sel-option ml10" style="width:calc(100% - 110px);"
			v-model="dialogObj.rangeObj.postTypeObj.selList" value-key="number" placeholder="请选择职位类型" multiple collapse-tags
			auto-popper filterable show-all reserve-keyword remote :remote-method="postTypeApi"
			:loading="dialogObj.rangeObj.postTypeObj.loading" @visible-change="postTypeApi()">
			<ly-option v-for="item in dialogObj.rangeObj.postTypeObj.list" :key="item.number" :label="item.name"
				:value="item"></ly-option>
		</ly-select>
	</ly-form-item>

	<ly-form-item class="mt10" label="职位:" prop="rangeDept">
		<ly-select class="sel-contain" style="width:100px;" v-model="dialogObj.rangeObj.postObj.contain" placeholder="请选择">
			<ly-option v-for="item in dialogObj.rangeList" :key="item.value" :label="item.label"
				:value="item.value"></ly-option>
		</ly-select>
		<ly-select class="sel-option ml10" style="width:calc(100% - 110px);" v-model="dialogObj.rangeObj.postObj.selList"
			value-key="id" placeholder="请选择职位" multiple collapse-tags auto-popper filterable show-all reserve-keyword remote
			:remote-method="postApi" :loading="dialogObj.rangeObj.postObj.loading" @visible-change="postApi()">
			<ly-option v-for="item in dialogObj.rangeObj.postObj.list" :key="item.id" :label="item.name"
				:value="item"></ly-option>
		</ly-select>
	</ly-form-item>

	<ly-form-item class="mt10" label="序列:" prop="rangeDept">
		<ly-select class="sel-contain" style="width:100px;" v-model="dialogObj.rangeObj.sequenceObj.contain"
			placeholder="请选择">
			<ly-option v-for="item in dialogObj.rangeList" :key="item.value" :label="item.label"
				:value="item.value"></ly-option>
		</ly-select>
		<ly-select class="sel-option ml10" style="width:calc(100% - 110px);"
			v-model="dialogObj.rangeObj.sequenceObj.selList" value-key="id" placeholder="请选择序列" multiple collapse-tags
			auto-popper filterable show-all reserve-keyword remote :remote-method="sequenceApi"
			:loading="dialogObj.rangeObj.sequenceObj.loading" @visible-change="sequenceApi()">
			<ly-option v-for="item in dialogObj.rangeObj.sequenceObj.list" :key="item.id" :label="item.name"
				:value="item"></ly-option>
		</ly-select>
	</ly-form-item>

	<ly-form-item class="mt10" label="岗位:" prop="rangeDept">
		<ly-select class="sel-contain" style="width:100px;" v-model="dialogObj.rangeObj.dutyObj.contain" placeholder="请选择">
			<ly-option v-for="item in dialogObj.rangeList" :key="item.value" :label="item.label"
				:value="item.value"></ly-option>
		</ly-select>
		<ly-select class="sel-option ml10" style="width:calc(100% - 110px);" v-model="dialogObj.rangeObj.dutyObj.selList"
			value-key="dutyNumber" placeholder="请选择岗位" multiple collapse-tags auto-popper filterable show-all reserve-keyword
			remote :remote-method="dutyApi" :loading="dialogObj.rangeObj.dutyObj.loading" @visible-change="dutyApi()">
			<ly-option v-for="item in dialogObj.rangeObj.dutyObj.list" :key="item.dutyNumber" :label="item.dutyName"
				:value="item"></ly-option>
		</ly-select>
	</ly-form-item>

	<ly-form-item class="mt10" label="人员:" prop="rangeDept">
		<ly-select class="sel-contain" style="width:100px;" v-model="dialogObj.rangeObj.personObj.contain"
			placeholder="请选择">
			<ly-option v-for="item in dialogObj.rangeList" :key="item.value" :label="item.label"
				:value="item.value"></ly-option>
		</ly-select>
		<ly-select class="sel-option ml10" style="width:calc(100% - 110px);" v-model="dialogObj.rangeObj.personObj.selList"
			value-key="empNumber" placeholder="请选择人员" multiple collapse-tags auto-popper filterable show-all reserve-keyword
			remote :remote-method="personApi" :loading="dialogObj.rangeObj.personObj.loading" @visible-change="personApi()">
			<ly-option v-for="item in dialogObj.rangeObj.personObj.list" :key="item.empNumber" :label="item.showName"
				:value="item"></ly-option>
		</ly-select>
	</ly-form-item>
</template>

<script>
import { useServe } from '@element-plus/hooks'
import { nextTick } from 'vue'

export default {
	name: 'rangeSelect',
	props: {
		dialogObj: {
			type: Object,
			default: {},
		},
	},
	setup(props, ctx) {
		// console.log('props.dialogObj', props.dialogObj)
		// 查询公司api
		async function companyApi(text) {
			if (text === true) {
				text = "";
			} else if (text === false) {
				return
			}
			props.dialogObj.rangeObj.companyObj.loading = true;
			let list = await useServe.http('companyList', { powerUrl: "", key: text || "", empType: props.dialogObj.rangeObj.jmObj.contain }).catch(err => {
				props.dialogObj.rangeObj.companyObj.loading = false;
			});
			props.dialogObj.rangeObj.companyObj.loading = false;
			let selList = JSON.parse(JSON.stringify(props.dialogObj.rangeObj.companyObj.selList));
			list = getSelectList(selList, list, 'oldId')
			props.dialogObj.rangeObj.companyObj.list = list || [];
			// 改动让组件判断全选
			props.dialogObj.rangeObj.companyObj.selList = [];
			nextTick(() => {
				props.dialogObj.rangeObj.companyObj.selList = selList;
			});
		}

		// 查询部门api
		async function deptApi(text) {
			if (text === true) {
				text = "";
			} else if (text === false) {
				return
			}
			props.dialogObj.rangeObj.deptObj.loading = true;
			let list = await useServe.http('findDeptBykey', { powerUrl: "", key: text || "", deptType: props.dialogObj.rangeObj.jmObj.contain }).catch(err => {
				props.dialogObj.rangeObj.deptObj.loading = false;
			});
			if (!list) {
				list = [];
			}
			list.map(item => { item.number = String(item.number) });
			props.dialogObj.rangeObj.deptObj.loading = false;
			let selList = JSON.parse(JSON.stringify(props.dialogObj.rangeObj.deptObj.selList));
			list = getSelectList(selList, list, 'number')
			props.dialogObj.rangeObj.deptObj.list = list || [];
			// 改动让组件判断全选
			props.dialogObj.rangeObj.deptObj.selList = [];
			nextTick(() => {
				props.dialogObj.rangeObj.deptObj.selList = selList;
			});
		}

		// 查询职位类型api
		async function postTypeApi(text) {
			if (text === true) {
				text = "";
			} else if (text === false) {
				return
			}
			props.dialogObj.rangeObj.postTypeObj.loading = true;
			let list = props.dialogObj.rangeObj.postTypeObj.defaultList;
			// 不存在本地数据请求
			if (list.length == 0) {
				list = await useServe.http('selectPostTypeNewList', { empType: props.dialogObj.rangeObj.jmObj.contain }).catch(err => {
					props.dialogObj.rangeObj.postTypeObj.loading = false;
				});
				if (list?.length > 0) {
					list.map(item => { item.number = String(item.number) });
					props.dialogObj.rangeObj.postTypeObj.defaultList = list;
				} else {
					list = [];
				}
			}
			props.dialogObj.rangeObj.postTypeObj.loading = false;
			let selList = JSON.parse(JSON.stringify(props.dialogObj.rangeObj.postTypeObj.selList));
			list = list.filter(item => { return new RegExp(regReplace(text || "")).test(item.name) });
			list = getSelectList(selList, list, 'number')
			props.dialogObj.rangeObj.postTypeObj.list = list || [];
			// 改动让组件判断全选
			props.dialogObj.rangeObj.postTypeObj.selList = [];
			nextTick(() => {
				props.dialogObj.rangeObj.postTypeObj.selList = selList;
			});
		}

		// 查询职位api
		async function postApi(text) {
			if (text === true) {
				text = "";
			} else if (text === false) {
				return
			}
			props.dialogObj.rangeObj.postObj.loading = true;
			let list = await useServe.http('findPostBykey', { powerUrl: "", status: 2, keyWord: text || "", empType: props.dialogObj.rangeObj.jmObj.contain }).catch(err => {
				props.dialogObj.rangeObj.postObj.loading = false;
			});
			props.dialogObj.rangeObj.postObj.loading = false;
			let selList = JSON.parse(JSON.stringify(props.dialogObj.rangeObj.postObj.selList));
			list = getSelectList(selList, list, 'id')
			props.dialogObj.rangeObj.postObj.list = list || [];
			// 改动让组件判断全选
			props.dialogObj.rangeObj.postObj.selList = [];
			nextTick(() => {
				props.dialogObj.rangeObj.postObj.selList = selList;
			});
		}

		// 查询序列api
		async function sequenceApi(text) {
			if (text === true) {
				text = "";
			} else if (text === false) {
				return
			}
			props.dialogObj.rangeObj.sequenceObj.loading = true;
			let list = await useServe.http('sequenceList', { powerUrl: "", keyWord: text || "", empType: props.dialogObj.rangeObj.jmObj.contain }).catch(err => {
				props.dialogObj.rangeObj.sequenceObj.loading = false;
			});
			if (!list) {
				list = [];
			}
			list.map(item => { item.id = String(item.id) });
			props.dialogObj.rangeObj.sequenceObj.loading = false;
			let selList = JSON.parse(JSON.stringify(props.dialogObj.rangeObj.sequenceObj.selList));
			list = getSelectList(selList, list, 'id')
			props.dialogObj.rangeObj.sequenceObj.list = list || [];
			// 改动让组件判断全选
			props.dialogObj.rangeObj.sequenceObj.selList = [];
			nextTick(() => {
				props.dialogObj.rangeObj.sequenceObj.selList = selList;
			});
		}

		// 查询岗位api
		async function dutyApi(text) {
			if (text === true) {
				text = "";
			} else if (text === false) {
				return
			}
			let list = [];
			props.dialogObj.rangeObj.dutyObj.loading = true;
			let res = await useServe.http('selectDutyByKeyword', { powerUrl: "", keyword: text || "", empType: props.dialogObj.rangeObj.jmObj.contain }).catch(err => {
				props.dialogObj.rangeObj.dutyObj.loading = false;
			});
			props.dialogObj.rangeObj.dutyObj.loading = false;
			if (res.data) {
				list = res.data;
			}
			let selList = JSON.parse(JSON.stringify(props.dialogObj.rangeObj.dutyObj.selList));
			list = getSelectList(selList, list, 'dutyNumber')
			props.dialogObj.rangeObj.dutyObj.list = list || [];
			// 改动让组件判断全选
			props.dialogObj.rangeObj.dutyObj.selList = [];
			nextTick(() => {
				props.dialogObj.rangeObj.dutyObj.selList = selList;
			});
		}

		// 查询人员api
		async function personApi(text) {
			if (text === true) {
				text = "";
			} else if (text === false) {
				return
			}
			props.dialogObj.rangeObj.personObj.loading = true;
			let list = await useServe.http('findEmpBykey', { powerUrl: "", key: text || "", empType: props.dialogObj.rangeObj.jmObj.contain }).catch(err => {
				props.dialogObj.rangeObj.personObj.loading = false;
			});
			props.dialogObj.rangeObj.personObj.loading = false;
			if (!list) {
				list = [];
			}
			list.map(item => {
				item.showName = item.empName + '-' + item.deptName;
			})
			let selList = JSON.parse(JSON.stringify(props.dialogObj.rangeObj.personObj.selList));
			list = getSelectList(selList, list, 'empNumber')
			props.dialogObj.rangeObj.personObj.list = list || [];
			// 改动让组件判断全选
			props.dialogObj.rangeObj.personObj.selList = [];
			nextTick(() => {
				props.dialogObj.rangeObj.personObj.selList = selList;
			});
		}

		// 选择加盟/直营
		const jmChange = () => {
			// 清空选择项
			props.dialogObj.rangeObj.companyObj.selList = []
			props.dialogObj.rangeObj.deptObj.selList = []
			props.dialogObj.rangeObj.postTypeObj.selList = []
			props.dialogObj.rangeObj.postObj.selList = []
			props.dialogObj.rangeObj.sequenceObj.selList = []
			props.dialogObj.rangeObj.dutyObj.selList = []
			props.dialogObj.rangeObj.personObj.selList = []
			props.dialogObj.rangeObj.companyObj.contain = 1
			props.dialogObj.rangeObj.deptObj.contain = 1
			props.dialogObj.rangeObj.postTypeObj.contain = 1
			props.dialogObj.rangeObj.postObj.contain = 1
			props.dialogObj.rangeObj.sequenceObj.contain = 1
			props.dialogObj.rangeObj.dutyObj.contain = 1
			props.dialogObj.rangeObj.personObj.contain = 1
		}

		// 搜索关键词正则特殊字符过滤
		function regReplace(text = "", flag) {
			let reg = new RegExp("[~*.?+$^\\[\\](){}|\\/\\\\%]", "g");
			if (flag) {
				return reg.test(text);
			} else {
				return text.replace(reg, item => { return "\\" + item });
			}
		}

		const getSelectList = (selList, list, idName) => {
			if (selList && selList.length > 0) {
				selList.forEach(item => {
					const index = list.findIndex(obj => obj[idName] == item[idName])
					if (index > -1) {
						list.splice(index, 1)
					}
				});
			}
			return [...selList, ...list];
		}

		return {
			jmChange,
			companyApi,
			deptApi,
			postTypeApi,
			postApi,
			sequenceApi,
			dutyApi,
			personApi,
		}
	}
}
</script>