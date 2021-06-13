<template>
  <div>
    <task-header-menu/>
    <task-main-editor ref="child"></task-main-editor>
    <navigator/>
  </div>
</template>

<script>
import taskHeaderMenu from '../../views/components/TaskHeader'
import taskMainEditor from './main/taskMainEditor'
import navigator from '../../views/components/main/navigator'

export default {
  name: 'taskeditor',
  components: {
    taskMainEditor,
    taskHeaderMenu,
    navigator
  },
  methods: {
    save() {
      this.$refs.child.savesave()
    },
    sendMessage(msg) {
      this.$refs.child.onsend(msg)
    }
  }
}
</script>
