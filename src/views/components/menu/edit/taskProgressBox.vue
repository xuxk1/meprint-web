<template>
  <div class="progress-group">
    <ul>
      <ul class="card-panel" :disabled="commandDisabled">
        <li v-for="(item, index) in items" class="menu-btn" :class="classArray(item.value)" @click="execCommand(item.value)" :title="item.title">
          <svg-icon :icon-class="item.type" class-name="card-panel-icon" />
        </li>
      </ul>
    </ul>
<!--    <ul>-->
<!--      <ul :disabled="commandDisabled">-->
<!--        <li v-for="(item, index) in items" class="menu-btn" :class="classArray(index)" @click="execCommand(index)" :title="title(index)"></li>-->
<!--      </ul>-->
<!--    </ul>-->
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'TaskProgressBox',
    data() {
      return {
        items: [
          { value: null, type: 'clean', title: '移除结果' },
          { value: '1', type: 'back', title: '不执行' },
          { value: '9', type: 'pass', title: '通过' },
          { value: '5', type: 'block', title: '阻塞' },
          { value: '4', type: 'fail', title: '失败' }
        ]
      }
    },
    computed: {
      ...mapGetters({
        minder: 'getMinder'
      }),
      commandDisabled() {
        var minder = this.minder
        minder.on &&
        minder.on('interactchange', function () {
          this.commandValue = minder.queryCommandValue('progress')
        });
        return (
          minder.queryCommandState &&
          minder.queryCommandState('progress') === -1
        )
      }
    },
    created() {},
    methods: {
      execCommand(index) {
        this.commandDisabled || this.minder.execCommand('progress', index)
      },
    classArray(index) {
      var isActive =
        this.minder.queryCommandValue &&
        this.minder.queryCommandValue('progress') === index
      var sequence = 'progress-' + index

      // 用数组返回多个class
      var arr = [
        {
          active: isActive
        },
        sequence
      ]
      return arr
    },
    title(index) {
      switch (index) {
        case 0:
          return '移除结果'
        case 1:
          return '不执行'
        case 4:
          return '失败'
        case 5:
          return '阻塞'
        case 9:
          return '通过'
        default:
          return '阻塞/通过'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .card-panel {
    height: auto;
    width: auto;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    .card-panel-icon {
      float: left;
      font-size: 20px;
    }
  }
</style>
