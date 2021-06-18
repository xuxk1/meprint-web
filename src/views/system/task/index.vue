<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="caseName"
            clearable
            size="small"
            placeholder="输入用例名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
            @input="getCaseDatas"
          />
        </div>
        <el-tree
          :data="caseDatas"
          :load="getCaseDatas"
          icon-class="disable"
          :props="defaultProps"
          :expand-on-click-node="false"
          lazy
          @node-click="handleNodeClick"
        />
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input v-model="query.title" clearable size="small" placeholder="输入任务名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <el-input v-model="query.owner" clearable size="small" placeholder="输入负责人搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <date-range-picker v-model="query.createTime" class="date-item" @change="onDateChange"/>
            <rrOperation />
          </div>
          <crudOperation show="" :permission="permission" >
          </crudOperation>
        </div>
        <!--表单渲染-->
        <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" append-to-body width="730px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
            <el-form-item label="任务名称" prop="title">
              <el-input v-model="form.title" placeholder="请输入任务名称" style="width: 220px;" />
            </el-form-item>
            <el-form-item label="任务负责人" prop="owner">
              <el-input v-model="form.owner" placeholder="请输入任务负责人" style="width: 220px;" />
            </el-form-item>
            <el-form-item label="计划周期" prop="StartTime">
              <date-range-picker v-model="formDate.expectTime" value-format="yyyy-MM-dd" @change="dateConvert" range-separator="至" class="date-item" style="width: 556px;"/>
<!--              <el-date-picker-->
<!--                v-model="formDate.StartTime"-->
<!--                type="date"-->
<!--                placeholder="选择日期"-->
<!--                value-format="yyyy-MM-dd"-->
<!--                :clearable="false"-->
<!--                @change="startDateConvert"-->
<!--              ></el-date-picker>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="结束时间" prop="EndTime">-->
<!--              <el-date-picker-->
<!--                v-model="formDate.EndTime"-->
<!--                type="date"-->
<!--                placeholder="选择日期"-->
<!--                value-format="yyyy-MM-dd"-->
<!--                :clearable="false"-->
<!--                @change="endDateConvert"-->
<!--              ></el-date-picker>-->
            </el-form-item>
            <el-form-item label="用例集分类" prop="caseId">
              <el-select v-model="form.caseId" placeholder="请选择用例集" size="small" @change="selectCases(form.caseId)" style="width: 220px">
                <el-option v-for="item in Cases" :key="item.value" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务描述" prop="description">
              <!--          <el-input v-model="form.description" style="width: 220px;" />-->
              <textarea v-model="form.description" class="ant-input" maxLength="1024" style="width: 220px" />
            </el-form-item>
            <el-form-item label="选择用例集" prop="chooseContent">
              <el-radio-group v-model="formDate.content" :disabled="radioBtnStatus" style="width: 556px">
                <el-radio :label="true" style="display: block; height: 50px; margin-top: 10px; font-size: 14px;" @change="caseSelect(formDate.content,form.caseId)">
                  包含全部用例
                  <p class="small-size-font">
                    覆盖全部可用用例（共计{{caseCount}}个），如果用例集库有新增的用例，会自动加入到本计划中
                  </p>
                </el-radio>
                <el-radio :label="false" style="display: block; height: 80px; margin-top: 10px; font-size: 14px;" @change="caseSelect(formDate.content,form.caseId)">
                  手动圈选用例集
                  <el-row :gutter="15" :disabled="btnStatus" style="display: block; height: 80px; margin-top: 10px; font-size: 14px;">
                    <el-col>
                      <el-form-item label="优先级" prop="priority">
<!--                        <el-input v-model="formDate.priority" placeholder="用例等级" clearable :disabled="btnStatus" :style="{width: '100%'}" />-->
                        <el-select v-model="formDate.prioritylist" multiple placeholder="用例等级" @change="setPriority(formDate.prioritylist, form.caseId)" :disabled="btnStatus" style="width: 200px">
                          <el-option v-for="item in caseLevel" :key="item.key" :label="item.display_name" :value="item.key"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col>
                      <el-form-item label="标签" prop="resource">
<!--                        <el-input v-model="formDate.resources" placeholder="标签" clearable :disabled="btnStatus" style="width: 200px" />-->
                        <el-select v-model="formDate.resource" multiple placeholder="标签" @change="setResource(formDate.resource, form.caseId)" :disabled="btnStatus" style="width: 200px">
                          <el-option v-for="item in resources" :key="item.label" :label="item.label" :value="item.label"></el-option>
                        </el-select>
                      </el-form-item>
                      <p>{{selectCaseCount}}个已选用例</p>
                    </el-col>
                  </el-row>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
          <el-table-column :selectable="checkboxT" type="selection" width="55" />
          <el-table-column v-model="form.caseId" :show-overflow-tooltip="true" prop="caseId" label="用例ID">
            <template slot-scope="scope">
              <div>{{ scope.row.caseId }}</div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="id" label="任务ID" />
          <el-table-column :show-overflow-tooltip="true" prop="title" width="225" label="任务名称" />
          <el-table-column :show-overflow-tooltip="true" prop="owner" label="负责人" />
          <el-table-column :show-overflow-tooltip="true" prop="executors" label="执行人" />
          <el-table-column :show-overflow-tooltip="true" prop="passRate" label="通过率" >
            <template slot-scope="scope">
                <span style="margin-left: 10px">{{parseFloat((scope.row.successNum/scope.row.totalNum)*100).toFixed(2)}}%</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="executeNum" label="已测用例集">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.executeNum}}/{{scope.row.totalNum}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="expectStartTime"  width="136px" value-format="YYYY-MM-DD" label="开始时间" />
          <el-table-column :show-overflow-tooltip="true" prop="expectEndTime"  width="136px" value-format="YYYY-MM-DD" label="结束时间" />
          <el-table-column v-if="checkPer(['admin','task:edit','task:run','task:del'])" label="操作" width="170px" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button v-permission="['admin','task:edit']" size="mini" style="margin-right: 3px;" type="text" @click="crud.toEdit(scope.row)">编辑</el-button>
              <el-popover
                :ref="`popover-${scope.$index}`"
                v-permission="['admin','task:run']"
                placement="top"
                width="200"
              >
                <p>确定执行该任务吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                  <el-button :loading="editLoading" type="primary" size="mini" @click="execute(scope.row.caseId, scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="text" size="mini">执行</el-button>
              </el-popover>
              <el-popover
                :ref="scope.row.id"
                v-permission="['admin','task:del']"
                placement="top"
                width="200"
              >
                <p>确定停止并删除该任务吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="text" size="mini">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudTask from '@/api/system/task'
import cases, { queryList, getCaseInfo } from '@/api/system/case'
import CRUD, { presenter, header, form, crud } from '@crud/crudCase'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operationXmind'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

const username = localStorage.getItem('username')
const defaultForm = { id: null, caseId: null, title: null, creator: username, modifier: username, chooseContent: { 'priority': [],'resource': []}, description: null, expectEndTime: null, expectStartTime: null, owner: null, executors: null}
export default {
  name: 'Task',
  components: { Treeselect, pagination, crudOperation, rrOperation, DateRangePicker },
  cruds() {
    const params = {
      'userName': username
    }
    return CRUD({ title: '测试任务', url: 'api/record/alllist', params,  crudMethod: { ...crudTask }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      editLoading: false,
      delLoading: false,
      formDate: {
        expectTime: null,
        StartTime: null,
        EndTime: null,
        content: null,
        prioritylist: null,
        resource: null
      },
      prioritys: [],
      resources: [],
      caseDatas: [],
      Cases: [],
      caseName: '',
      caseCount: '',
      selectCaseCount: '',
      means : '',
      defaultProps: { children: 'children', label: 'title', isLeaf: 'leaf' },
      permission: {
        add: ['admin', 'task:add'],
        edit: ['admin', 'task:edit'],
        run: ['admin', 'task:run'],
        del: ['admin', 'task:del']
      },
      rules: {
        title: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        executors: [
          { required: true, message: '请输入执行人姓名', trigger: 'blur' }
        ],
        owner: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' }
        ],
        caseId: [
          { required: true, message: '请选择用例集', trigger: 'blur' }
        ]
      },
      caseLevel: [
        { key: '1', display_name: 'P0' },
        { key: '2', display_name: 'P1' },
        { key: '3', display_name: 'P2' },
      ],
      radioBtnStatus :true,
      btnStatus: true
    }
  },
  watch: {
    'form.caseId': 'changeCaseId'
  },
  created() {
    this.caseCount = 0
    this.selectCaseCount = 0
    this.means = 'add'
  },
  methods: {
    //转换时间返回查询参数
    onDateChange(dateString) {
      console.log(dateString[0])
      console.log(dateString[1])
      delete this.query.createTime
      this.query.expectStartTime = dateString[0]
      this.query.expectEndTime = dateString[1]
    },
    // 执行
    execute(caseId,taskId) {
      // crudTask.execution(taskId).then(res => {
      //   if (res.code === 200) {
      //     this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      //   }
      // }).catch(err => {
      //   this.crud.notify('执行失败', CRUD.NOTIFICATION_TYPE.ERROR)
      //   console.log(err)
      // })
      this.editLoading = true
      this.$router.push({ path: '/system/task/task', query: { caseId: caseId, taskId: taskId, iscore: 3}})
      localStorage.setItem('taskId', taskId)
      this.editLoading = false
    },
    updateParams(id) {
      console.log(id)
    },
    delMethod(id) {
      this.delLoading = true
      crudTask.del([id]).then(() => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.crud.dleChangePage(1)
        this.crud.delSuccessNotify()
        this.crud.toQuery()
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1
    },
    changeCaseId(value) {
      console.log('bizId~~~~~~~' + value)
      this.caseId = Number(value)
    },
    dateConvert(time) {
      let that = this
      const start = time.toString().split(',')[0]
      const end = time.toString().split(',')[1]
      const startTime = start +  ' 00:00:00'
      const endTime = end +  ' 23:59:59'
      const getStartTime = new Date(startTime)
      const getEndTime = new Date(endTime)
      that.form.expectStartTime = getStartTime.valueOf()
      that.form.expectEndTime = getEndTime.valueOf()
    },
    endDateConvert(time) {
      let that = this
      const endTime = time +  ' 23:59:59'
      const getEndTime = new Date(endTime)
      that.form.expectEndTime = getEndTime.valueOf()
    },
    caseSelect(val, caseId) {
      let that = this
      that.resources = []
      that.formDate.prioritylist = []
      that.formDate.resource = []
      that.selectCaseCount = 0
      that.btnStatus=(val===true)?true:false
      this.form.chooseContent = {'priority':[],'resource':[]}

      cases.countByCondition({caseId: caseId, priority: '', resource: ''}).then(res => {
        if (res.code === 200 && res.data.taglist) {
          const tags = new Set(res.data.taglist)
          tags.forEach(tag => {
            if (tag) {
              that.resources.push({
                'label': tag
              })
            }
          })
        }
      }).catch(error => {
        reject(error)
        this.$notify.error('异步获取数据失败')
      })
    },
    setPriority(val, caseId) {
      if (val && caseId) {
        const selectOption = []
        const params = {
          caseId: caseId,
          priority: val.toString(),
          resource: ''
        }
        if (this.means === 'edit' && this.formDate.resource !==undefined) {
          params['resource'] = this.formDate.resource.toString()
        }
        val.forEach(data => {
          selectOption.push(data)
        })
        this.prioritys = val.toString()
        this.radioBtnStatus = false
        this.selectCaseCount = 0
        cases.countByCondition(params).then(res => {
          if (res.code === 200) {
            this.selectCaseCount = res.data.count
          }
        }).catch(error => {
          reject(error)
          this.$notify.error('异步获取数据失败')
        })
        if (this.means === 'add') {
          this.form.chooseContent.priority = selectOption
        }
        if (this.means === 'edit') {
          this.form.chooseContent = {'priority': selectOption, 'resource': this.formDate.resource}
        }
      }
    },
    setResource(val, caseId) {
      let selectReource = []
      if (val && caseId) {
        const params = {
          caseId: caseId,
          priority: '',
          resource: val.toString()
        }
        if (this.means === 'edit' && this.formDate.prioritylist !==undefined) {
          params['priority'] = this.formDate.prioritylist.toString()
        }
        const set = new Set(this.resources)
        this.resources = set
        val.forEach(data => {
          selectReource.push(data)
        })
        this.radioBtnStatus = false
        this.selectCaseCount = 0
        cases.countByCondition(params).then(res => {
          if (res.code === 200) {
            this.selectCaseCount = res.data.count
          }
        }).catch(error => {
          reject(error)
          this.$notify.error('异步获取数据失败')
        })
        if (this.means === 'edit' && this.form.chooseContent) {
          this.form.chooseContent = this.form.chooseContent = {'priority': this.formDate.prioritylist, 'resource': selectReource }
        }
        if (this.means === 'add') {
          this.form.chooseContent.resource = selectReource
        }
      }
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.caseId == null && form.id === null) {
        this.radioBtnStatus = true
        this.formDate.content = ''
        this.formDate.expectTime = ''
        this.formDate.prioritylist = ''
        this.formDate.resource = ''
        this.getCases()
      } else if (form.caseId !== null && form.id !==null) {
        this.getSupCases(form.caseId)
        //第一种赋值方式
        this.formDate.expectTime = [form.expectStartTime.split(' ')[0] , form.expectEndTime.split(' ')[0]]
        //第二种赋值方式
        // this.$set(this.formDate, 'expectTime', [form.expectStartTime.split(' ')[0] , form.expectEndTime.split(' ')[0]])
        const prioritylist = JSON.parse(form.chooseContent).priority
        const resource = JSON.parse(form.chooseContent).resource
        this.means = 'edit'
        this.editInit(form.caseId, prioritylist, resource)
      }
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.title) {
        this.$message({
          message: '任务名称不能为空',
          type: 'warning'
        })
        return false
      }
      if (!crud.form.owner) {
        this.$message({
          message: '负责人不能为空',
          type: 'warning'
        })
        return false
      }
      if (!crud.form.caseId) {
        this.$message({
          message: '用例集分类选项不能为空',
          type: 'warning'
        })
        return false
      }
      return true
    },
    // 获取左侧部门数据
    getCaseDatas(node, resolve) {
      const sort = 'id,desc'
      const params = {
        pageNum: 1,
        pageSize: 10,
        sort: sort,
        productLineId: 1,
        channel: 1,
        bizId: -1
      }
      if (typeof node !== 'object') {
        if (node) {
          params['title'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        queryList(params).then(res => {
          if (resolve && res.data.total > 1) {
            resolve(res.data.dataSources)
          }
          if (node.children && !node.children.length) {
            delete node.children
          }
          this.caseDatas = []
          this.caseDatas = res.data.dataSources
        })
      }, 100)
    },
    getCases() {
      const sort = 'id,desc'
      const params = {
        pageNum: 1,
        pageSize: 10,
        sort: sort,
        productLineId: 1,
        channel: 1,
        bizId: -1
      }
      queryList(params).then(res => {
        this.Cases = res.data.dataSources.map(function(obj) {
          if (obj.title) {
            obj.title
          }
          return obj
        })
      })
    },
    getSupCases(caseId) {
      getCaseInfo(caseId).then(res => {
        const date = res.data
        this.Cases = []
        this.Cases.push(date)
      })
    },
    selectCases(id) {
        cases.countByCondition({ caseId: id, priority: '', resource: '' }).then(res => {
        if (res.code === 200) {
          this.caseCount = res.data.totalCount
        }
          this.radioBtnStatus = false
          this.formDate.content = true
      }).catch(error => {
        reject(error)
        this.$notify.error('异步获取数据失败')
      })
    },
    editInit(id, priority, resource) {
      let that = this
      that.getCases()
      that.formDate.prioritylist = []
      that.formDate.resource = []
      that.resources = []
      const params = { caseId: id, priority: '', resource: '' }
      if (priority.length > 0 || resource.length > 0) {
        that.radioBtnStatus = false
        that.formDate.content = false
        that.btnStatus = false
        if (priority && priority !==null && priority !==undefined && priority !=='') {
          params['priority'] = priority.toString()
          that.formDate.prioritylist = priority
        }
        if (resource && resource !==null && priority !==undefined && resource !=='') {
          params['resource'] = resource.toString()
          that.formDate.resource = resource
          const tags = new Set(resource)
          tags.forEach(tag => {
            if (tag) {
              that.resources.push({
                'label': tag
              })
            }
          })
        }
      }else {
        that.selectCaseCount = 0
        that.radioBtnStatus = false
        that.formDate.content = true
        that.formDate.resource = false
      }
      cases.countByCondition(params).then(res => {
        if (res.code === 200) {
          that.caseCount = res.data.totalCount
          this.selectCaseCount = res.data.count
        }
      }).catch(error => {
        reject(error)
        that.$notify.error('异步获取数据失败')
      })
    },
    // 切换项目
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.caseId = null
      } else {
        this.query.caseId = data.id
      }
      this.crud.url = 'api/record/list'
      this.crud.toQuery()
    },
    deleteTag(value) {
      this.caseDatas.forEach(function(data, index) {
        if (data.id === value) {
          this.caseDatas.splice(index, value)
        }
      })
    },
  }
}
</script>

<style lang="css">
  .small-size-font {
    font-size: 12px;
    color: #8b9abe;
    width: 100%;
    white-space: normal;
    margin-top: 8px;
    margin-left: 22px;
  }
  textarea.ant-input {
    max-width: 100%;
    height: 32px;
    min-height: 32px;
    line-height: 1.5;
    vertical-align: bottom;
    transition: all .3s,height 0s;
  }
  .ant-input {
    box-sizing: border-box;
    margin: 0;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: "tnum";
    position: relative;
    display: inline-block;
    width: 100%;
    height: 32px;
    padding: 4px 11px;
    color: rgba(0,0,0,.65);
    font-size: 14px;
    line-height: 1.5;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    transition: all .3s;
  }
  textarea {
    overflow: auto;
    resize: vertical;
  }
</style>
