<template>
  <div>
    <header-menu></header-menu>
    <main-editor ref="child"></main-editor>
    <navigator></navigator>
  </div>
</template>

<script>
import headerMenu from '../../views/components/Header'
import mainEditor from '../../views/components/main/mainEditor'
import navigator from '../../views/components/main/navigator'

export default {
  name: 'XmindEditor',
  components: {
    headerMenu,
    mainEditor,
    navigator
  },
  methods: {
    save() {
      this.$refs.child.savesave();
    }
  }
}
</script>
