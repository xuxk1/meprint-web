<template>
<div class="main-container">
  <div>
    <header-menu></header-menu>
  </div>
  <div>
    <main-editor ref="child"></main-editor>
  </div>
  <footer style="width: 800px; height: 600px">
    <navigator></navigator>
  </footer>

</div>

</template>

<script>
import headerMenu from '../components/Header'
import mainEditor from '../components/main/mainEditor'
import navigator from '../components/main/navigator'
import footer from '../components/Footer'

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
    },
  },
}

</script>
