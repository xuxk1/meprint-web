<template>
  <div>
    <header-menu/>
    <main-editor ref="child"></main-editor>
    <navigator/>
  </div>
</template>

<script>
import headerMenu from '../../views/components/Header'
import mainEditor from '../../views/components/main/mainEditor'
import navigator from '../../views/components/main/navigator'

export default {
  name: 'xmindeditor',
  components: {
    headerMenu,
    mainEditor,
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
