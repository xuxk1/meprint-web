<template lang="html">
<div class="menu-container">

  <insert-box></insert-box>
  <move-box></move-box>
  <edit-del></edit-del>
  <attachment></attachment>
  <task-progress-box></task-progress-box>
  <span style="margin:0 10px">
    <p class="font-size-12">
      通过率： {{passRate ? passRate: 0}}%
    </p>
  </span>
  <span style="margin:0 10px">
    <p class="font-size-12">
      已测： {{passCount ? passCount : 0}}/{{totalCount ? totalCount : 0}}
    </p>
  </span>
  <span style="margin:0 10px">
    <p class="font-size-12">
      计划周期： {{expectStartTime ? expectStartTime : '1970/01/01'}} - {{expectEndTime ? expectEndTime : '1970/12/01'}}
    </p>
  </span>
  <div class="box-a box-b">
    <switchLock v-model="value" text="on|off" @change="sendMessage"></switchLock>
  </div>
  <div class='menu-button' v-if="checkPer(['admin','case:update'])">
    <el-button v-permission="['admin','case:update']" type="primary" size="medium" @click="save" >保存</el-button>
  </div>
  <div class='menu-button'>
    <el-button type="primary" size="medium" @click="$router.back()">返回上一页</el-button>
  </div>
</div>
</template>

<script>
import crudTask from '@/api/system/task'
import CRUD from '@crud/crudCase'
import insertBox from './insertBox'
import moveBox from './moveBox'
import editDel from './editDel'
import taskProgressBox from './taskProgressBox'
import attachment from './attachment'
import switchLock from '../../Switch'

export default {
	name: 'TaskEditMenu',
	components: {
		insertBox,
		moveBox,
		editDel,
    taskProgressBox,
		attachment,
    switchLock
	},
  data() {
	  return {
	    value: '',
      messageType: 2,
      passRate: '',
      passCount: '',
      totalCount: '',
      expectStartTime: '',
      expectEndTime: '',
      permission: {
        add: ['admin', 'case:update'],
      },
    }
  },
  created() {
    this.taskId = localStorage.getItem('taskId')
	  this.getTaskData(this.taskId)
  },
	methods: {
		save() {
			this.$parent.save()
		},
    sendMessage(val) {
      let messageLock = 'lock'
      let messgeUnlock = 'unlock'
      if (val === true) {
        this.$parent.sendMessage(this.messageType + messgeUnlock)
        this.$notify.success('解锁成功')
      }else {
        this.$parent.sendMessage(this.messageType + messageLock)
        this.$notify.success('上锁成功')
      }
    },
    getTaskData(taskId) {
      crudTask.execution(taskId).then(res => {
        if (res.code === 200) {
          this.passRate = res.data.passRate.toFixed(2)
          this.passCount = res.data.passCount
          this.totalCount = res.data.totalCount
          this.expectStartTime = res.data.expectStartTime
          this.expectEndTime = res.data.expectEndTime
        }
      }).catch(err => {
        console.log(err)
      })
    }
	}
}
</script>
<style lang="scss">
  .font-size-12 {
    font-size: 12px;
    margin: 0 10px;
    text-align:center;line-height:60px;
  }
  .box-a,.box-b{width:150px; margin: 0 10px;}
</style>
