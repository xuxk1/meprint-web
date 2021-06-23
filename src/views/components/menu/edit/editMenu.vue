<template lang="html">
<div class="menu-container">

  <insert-box></insert-box>
  <move-box></move-box>
  <edit-del></edit-del>
  <attachment></attachment>
  <sequence-box></sequence-box>
<!--  <progress-box></progress-box>-->
  <custom-box></custom-box>
   <expand></expand>
  <selection></selection>
  <div>
    <switchLock v-model="value" text="on|off" @change="sendMessage"></switchLock>
  </div>
  <div class='menu-button'>
    <el-button type="primary"  size="medium" @click="save">保存</el-button>
  </div>
  <div class='menu-button'>
    <el-button type="primary"  size="medium" @click="$router.back()">返回上一页</el-button>
  </div>
</div>
</template>

<script>
import insertBox from './insertBox'
import moveBox from './moveBox'
import editDel from './editDel'
import customBox from './customBox'
import sequenceBox from './sequenceBox'
import progressBox from './progressBox'
import expand from './expand'
import selection from './selection'
import attachment from './attachment'
import switchLock from '../../Switch'

export default {
	name: 'editMenu',
	components: {
		insertBox,
		moveBox,
		editDel,
		sequenceBox,
		progressBox,
		expand,
		selection,
		customBox,
		attachment,
    switchLock
	},
  data() {
	  return {
	    value: '',
      messageType: 2
    }
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
    }
	}
}
</script>
