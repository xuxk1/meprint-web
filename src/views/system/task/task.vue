<template>
  <!--Form表单-->
  <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="dialog" :title="crud.status.title" append-to-body width="730px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="任务名称" prop="title">
        <el-input v-model="form.title" style="width: 220px;" />
      </el-form-item>
      <el-form-item label="任务描述" prop="description">
        <el-input v-model="form.description" style="width: 220px;" />
      </el-form-item>
      <el-form-item label="执行人" prop="executors">
        <el-input v-model="form.executors" style="width: 220px;" />
      </el-form-item>
      <el-form-item label="任务负责人" prop="owner">
        <el-input v-model="form.owner" style="width: 220px;" />
      </el-form-item>
      <el-form-item label="计划周期" prop="email">
        <date-range-picker v-model="form.createTime" class="date-item" style="width: 556px;"/>
      </el-form-item>
      <el-form-item label="选择用例集">
        <el-radio-group v-model="form.chooseContent" style="width: 556px" @change="caseSelect">
          <el-radio :label="true" style="display: block; height: 50px; margin-top: 10px; font-size: 14px;">
            包含全部用例
            <p class="small-size-font">
              覆盖全部可用用例（共计个），如果用例集库有新增的用例，会自动加入到本计划中
            </p>
          </el-radio>
          <el-radio :label="false" style="display: block; height: 80px; margin-top: 10px; font-size: 14px;">
            手动圈选用例集
            <el-row :gutter="15" :disabled="btnStatus" style="display: block; height: 80px; margin-top: 10px; font-size: 14px;">
              <el-col>
                <el-form-item label="优先级" prop="priority">
                  <el-input v-model="form.priority" placeholder="用例等级" clearable :disabled="btnStatus" :style="{width: '100%'}">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="标签" prop="field104">
                  <el-input v-model="form.resource" placeholder="标签" clearable :disabled="btnStatus" :style="{width: '100%'}">
                  </el-input>
                </el-form-item>
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
</template>

<script>
const defaultForm = { id: null, jobName: null, subTask: null, beanName: null, methodName: null, params: null, cronExpression: null, pauseAfterFailure: true, isPause: false, personInCharge: null, email: null, description: null }
import crudTask from '@/mixins/crud'
import CRUD, { presenter, header, form, crud } from '@crud/crudCase'
import DateRangePicker from '@/components/DateRangePicker'
export default {
  name: "Task",
  components: { DateRangePicker },
  mixins: [crudTask, presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      title: '测试任务',
      permission: {
        add: ['admin', 'timing:add'],
        edit: ['admin', 'timing:edit'],
        del: ['admin', 'timing:del']
      },
      rules: {
        title: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        executors: [
          { required: true, message: '请输入Bean名称', trigger: 'blur' }
        ],
        owner: [
          { required: true, message: '请输入方法名称', trigger: 'blur' }
        ]
      },
      btnStatus: true
    }
  },
  methods: {
    caseSelect(val) {
      let that = this
      that.btnStatus=(val===true)?true:false
    }
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
</style>
