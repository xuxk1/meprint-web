<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('task')">
        <div class="card-panel-icon-wrapper icon-project">
          <svg-icon icon-class="todo" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            我的任务
          </div>
          <count-to :start-val="startVal" :end-val="taskCount" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('questions')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="bug" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            我的Bug
          </div>
          <count-to :start-val="startVal" :end-val="bugCount" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('products')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="product" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            产品需求
          </div>
          <count-to :start-val="startVal" :end-val="productCount" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('bugs')">
        <div class="card-panel-icon-wrapper icon-bug">
          <svg-icon icon-class="bug" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            待修复Bug
          </div>
          <count-to :start-val="startVal" :end-val="endVal" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('projects')">
        <div class="card-panel-icon-wrapper icon-project">
          <svg-icon icon-class="project" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            需求项目
          </div>
          <count-to :start-val="startVal" :end-val="projectCount" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getJiraData } from '@/api/tools/jiraData'

export default {
  components: {
    CountTo
  },
  props: {
    lists: JSON,
    usernames: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      startVal: 0,
      productCount: Number,
      endVal: Number,
      projectCount: Number,
      taskCount: Number,
      bugCount: Number
    }
  },
  created() {
    this.endVal = 0
    this.productCount = 0
    this.projectCount = 0
    this.taskCount = 0
    this.bugCount = 0
    this.username = localStorage.getItem('username')
    this.get_bugdata(this.username)
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    get_bugdata(username) {
      // 给子组件传值，配合:usernames="get_personaData"这个使用
      // if (this.usernames){
      //   this.usernames(this.username)
      // }
      return new Promise((resolve, reject) => {
        getJiraData().then(response => {
          console.log(response)
          this.endVal = Number(response.personal.issueCount)
          this.productCount = Number(response.product.issueCount)
          this.projectCount = Number(response.project.projectCount)
          for (var j = 0; j < response.product.taskCount.length; j++) {
            if (username !== undefined && username === response.product.userNames[j]) {
              this.taskCount = response.product.taskCount[j]
              break
            }
          }
          for (var k = 0; k < response.repaired.taskCount.length; k++) {
            if (username !== undefined && username === response.repaired.userNames[k]) {
              this.bugCount = response.repaired.taskCount[k]
              break
            }
          }
        }).catch(error => {
          reject(error)
          this.$notify.error('接口相应超时')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
    margin-right: -5px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-bug {
        background: #f4516c;
      }

      .icon-project {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-bug {
      color: #f4516c;
    }

    .icon-project {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
