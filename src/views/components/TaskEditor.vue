<template>
  <div>
    <header-menu/>
    <task-editor ref="child"></task-editor>
    <navigator/>
  </div>
</template>

<script>
import headerMenu from '../../views/components/Header'
import taskEditor from '../../views/components/main/taskEditor'
import navigator from '../../views/components/main/navigator'

export default {
  name: 'TaskEditor',
  components: {
    headerMenu,
    taskEditor,
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
