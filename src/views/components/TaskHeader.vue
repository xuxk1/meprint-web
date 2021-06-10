<template lang="html">
  <header>
    <ul id="mind_tab">
      <li :class="{selected:switchShow.showEditMenu}">
        <a href="javascritp:;" class="btn-showEditMenu" @click="showMenu">思维导图</a>
      </li>
      <li :class="{selected:switchShow.showViewMenu}">
        <a href="javascritp:;" class="btn-showViewMenu" @click="showMenu">外观样式</a>
      </li>
    </ul>
    <div id="mind_tab-content">
      <div class="mind-tab-panel" v-show="switchShow.showEditMenu">
        <task-edit-menu></task-edit-menu>
      </div>
      <div class="mind-tab-panel" v-show="switchShow.showViewMenu">
        <view-menu></view-menu>
      </div>
    </div>
  </header>
</template>

<script>
import taskEditMenu from './menu/edit/taskEditMenu'
import viewMenu from './menu/view/viewMenu'
export default {
	name: 'TaskHeaderVue',
	data() {
		return {
			switchShow: {
				showEditMenu: true,
				showViewMenu: false,
			},
		};
	},
	components: {
    taskEditMenu,
		viewMenu,
	},
	methods: {
		showMenu (e) {
			for (var variable in this.switchShow) {
				if (this.switchShow.hasOwnProperty(variable)) {
					this.switchShow[variable] = false
				}
			}
			this['switchShow'][e.target.className.replace('btn-', '')] = true
			this.$store.commit('setSwitchShow', this.switchShow)
		},
		save () {
			this.$parent.save()
		},
    sendMessage(msg) {
      this.$parent.sendMessage(msg)
    }
	}
}
</script>

<style lang="scss">
@import '../../assets/styles/task-header.scss';
</style>
