<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边部门数据-->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="projectName"
            clearable
            size="small"
            placeholder="输入项目名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
            @input="getProjectDatas"
          />
        </div>
        <el-tree
          :data="projectDatas"
          :load="getProjectDatas"
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
            <el-input v-model="query.blurry" clearable size="small" placeholder="输入内容模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <date-range-picker v-model="query.createTime" class="date-item" />
            <rrOperation />
          </div>
          <crudOperation :permission="permission">
            <!-- 新增 -->
          </crudOperation>
        </div>
        <!--表单渲染-->
        <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="570px">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
            <el-form-item label="用例集名称" width="80px" prop="title">
              <el-input v-model="form.title" />
            </el-form-item>
            <el-form-item label="用例集分类" prop="projectId">
              <treeselect
                v-model="form.projectId"
                :options="projects"
                :load-options="loadProjects"
                style="width: 178px"
                placeholder="选择用例集"
                @remove-tag="deleteTag"
              />
            </el-form-item>
            <el-form-item label="关联需求" prop="requirementId">
              <el-select
                v-model="form.requirementId"
                style="width: 178px"
                placeholder="选择需求"
                @remove-tag="deleteTag"
                @change="changeProduct"
              >
                <el-option
                  v-for="item in requirementId"
                  :key="item.key"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用例类型" prop="caseType">
              <el-select
                v-model="form.caseType"
                style="width: 178px"
                placeholder="选择用例类型"
                @remove-tag="deleteTag"
                @change="changeCaseType"
              >
                <el-option
                  v-for="item in caseTypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <textarea v-model="form.description" class="text-area"  maxLength="1024" ></textarea>
            </el-form-item>
            <el-form-item v-if="crud.status.add" label="上传">
              <el-input v-model="form.file" v-if="false"></el-input>
              <el-upload
                ref="upload"
                :limit="1"
                accept=".xmind"
                name="file"
                :before-upload="beforeUpload"
                :headers="headers"
                :on-success="handleSuccess"
                :on-error="handleError"
                :on-change="beforeUpload"
                :action="xmindUploadApi"
                :auto-upload="false"
              >
                <div class="eladmin-upload"><i class="el-icon-upload" /> 添加文件</div>
                <div slot="tip" class="el-upload__tip">可上传xmind的文件，且不超过100M</div>
              </el-upload>
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
          <el-table-column :show-overflow-tooltip="true" prop="id" label="序号" />
          <el-table-column :show-overflow-tooltip="true" prop="groupId" label="用例集ID" />
          <el-table-column :show-overflow-tooltip="true" prop="title" label="用例集名称" >
            <template slot-scope="scope">
              <el-link @click="getCaseInfo(scope.row.id)"><font color="#1890ff">{{scope.row.title}}</font></el-link>
            </template>
          </el-table-column>
          <el-table-column v-model="form.project.id" :load-options="loadProjects" :show-overflow-tooltip="true" prop="projectId" label="项目ID">
            <template slot-scope="scope">
              <div>{{ scope.row.projectId}}</div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="creator" label="创建人" />
          <el-table-column :show-overflow-tooltip="true" prop="modifier" label="更新人" />
          <el-table-column :show-overflow-tooltip="true" prop="gmtCreated" label="创建日期" />
          <el-table-column
            v-if="checkPer(['admin','case:edit','case:del'])"
            label="操作"
            width="115"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <udOperation
                :data="scope.row"
                :permission="permission"
                :disabled-dle="scope.row.id === user.id"
              />
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
import cases from '@/api/system/case'
import { getToken } from '@/utils/auth'
import { isvalidPhone } from '@/utils/validate'
import { getProjects, getProjectSuperior } from '@/api/system/project'
import { getAll, getLevel } from '@/api/system/role'
import { getAllJob } from '@/api/system/job'
import CRUD, { presenter, header, form, crud } from '@crud/crudCase'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import Xmind from './xmind.vue'
let userRoles = []
let userProducts = []
const initData = `{"root":{"data":{"id":"bv8nxhi3c800","created":1562059643204,"text":"中心主题"},"children":[]},"template":"default","theme":"fresh-blue","version":"1.4.43","base":0}`;
const username = localStorage.getItem('username')
var defaultForm = { id: null, creator: username, title: null, productLineId: 1, caseType: null, channel: 1, file: '', caseContent:initData,  bizId: -1, projectId: null, enabled: 'false', project: { id: null }, description: null, requirementId: 1}
export default {
  name: 'Case',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker },
  cruds() {
    const params = {
      productLineId: 1,
      channel: 1,
      bizId: -1
    }
    return CRUD({ title: '用例管理', url: 'api/case/list', params, crudMethod: { ...cases }})
  },

  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['case_status'],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      projectName: '', projects: [], projectDatas: [], requirementId: [], level: 3, roles: [],
      productDatas: [], roleDatas: [], // 多选时使用
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      headers: { 'Authorization': getToken() },
      permission: {
        add: ['admin', 'case:add'],
        edit: ['admin', 'case:edit'],
        del: ['admin', 'case:del']
      },
      caseTypeOptions: [
        { key: 0, display_name: '需求用例' },
        { key: 1, display_name: '核心用例' },
        { key: 2, display_name: '冒烟用例' }
      ],
      rules: {
        title: [
          { required: true, message: '请输入用例集名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        chooseContent: [
          { required: false, message: '请输入用例集分类', trigger: 'blur' },
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi'
    ])
  },
  watch: {
    'form.projectId': 'changeProjectId',
  },
  created() {
    this.crud.msg.add = '新增成功'
    this.username = localStorage.getItem('username')
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    changeRole(value) {
      userRoles = []
      value.forEach(function(data, index) {
        const role = { id: data }
        userRoles.push(role)
      })
    },
    changeProduct(value) {
      userProducts = []
      value.forEach(function(data, index) {
        const product = { id: data }
        userProducts.push(product)
      })
    },
    changeProjectId(value) {
      console.log('bizId~~~~~~~' + value)
      this.projectId = Number(value)
    },
    changeCaseType(value) {
      this.caseType = value
    },
    deleteTag(value) {
      userRoles.forEach(function(data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.id == null) {
        this.getProjects()
      } else if (form.projectId != null) {
        this.getSupProjects(form.projectId)
      } else {
        this.getSupProjects(form.project.id)
      }
      form.enabled = form.enabled.toString()
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.projectId) {
        this.$message({
          message: '用例集分类选项不能为空',
          type: 'warning'
        })
        return false
      }
      if (!crud.form.caseType) {
        this.$message({
          message: '用例类型选项不能为空',
          type: 'warning'
        })
        return false
      }
      crud.form.roles = userRoles
      crud.form.products = userProducts
      return true
    },
    // 获取左侧部门数据
    getProjectDatas(node, resolve) {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getProjects(params).then(res => {
          if (resolve) {
            resolve(res.content)
          } else {
            this.projectDatas = res.content
          }
        })
      }, 100)
    },
    getProjects() {
      getProjects({ enabled: true }).then(res => {
        this.projects = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupProjects(projectId) {
      getProjectSuperior(projectId).then(res => {
        const date = res.content
        this.buildProjects(date)
        this.projects = date
      })
    },
    buildProjects(projects) {
      projects.forEach(data => {
        if (data.children) {
          this.buildProjects(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 获取弹窗内项目数据
    loadProjects({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getProjects({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 切换项目
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.query.projectId = null
      } else {
        this.query.projectId = data.id
      }
      this.crud.toQuery()
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
    },
    // 上传文件
    upload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      let reader = new FileReader()
      reader.readAsDataURL(file.raw);
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      this.form.file = file.raw
      return isLt2M
    },
    handleSuccess(response, file, fileList) {
      this.crud.notify('上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.upload.clearFiles()
      this.crud.status.add = CRUD.STATUS.NORMAL
      this.crud.resetForm()
      this.crud.toQuery()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },
    getCaseInfo(id) {
      cases.getCaseInfo(id).then(res => {
        console.log('res=====' + id)
      })
      this.$router.push({path: '/system/case/xmind', query: { caseId: id }})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
  .text-area {
    width: 178px;
    border-top:1px solid gainsboro;
    border-bottom:1px solid gainsboro;
  }
  .text-area textarea {
    width: 100%;
    margin: 0.75rem  0;
    border: none;
    outline: none;
    padding-left: 1.125rem;
    height: 6.5rem ;
  }

  .text-area textarea::-webkit-input-placeholder {
    color: #9E9E9E;

  }
</style>
