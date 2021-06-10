<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <github-corner class="github-corner" />
      <!--:usernames="get_personaData"子组件给父组件传值，使用子组件panel-group-->
      <panel-group @handleSetLineChartData="handleSetLineChartData" />

      <!--<el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="lineChartData"/>
      </el-row>-->
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <radar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <radar-chart-p />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart-o />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './dashboard/PanelGroup'
import RadarChart from '@/components/Echarts/RadarChart'
import RadarChartP from '@/components/Echarts/RadarChartP'
import PieChart from '@/components/Echarts/PieChart'
import PieChartO from '@/components/Echarts/PieChartO'
import BarChart from '@/components/Echarts/BarChart'
import { getJiraData } from '@/api/tools/jiraData'

const lineChartData = {
  products: {
    actualData: [{
      date: '2018-09-10',
      12: '老k',
      15: '一万'
    }],
    lineheaders: [{
      label: '日期',
      prop: 'date'
    },
    {
      label: '斗地主',
      prop: '12'
    },
    {
      label: '麻将',
      prop: '15'
    }]
  }
}

export default {
  name: 'Dashboard',
  components: {
    GithubCorner,
    PanelGroup,
    // LineChart,
    RadarChart,
    RadarChartP,
    PieChart,
    PieChartO,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.products,
      localAddress: 'http://jira.diy8.com/',
      username: '',
      filterUrl: '',
      personalFilterUrl: '',
      bugFilterUrl: '',
      productFilterUrl: '',
      repairedFilterUrl: '',
      projectFilterUrl: ''

    }
  },
  created() {
    this.username = localStorage.getItem('username')
    this.get_personaData(this.username)
  },
  methods: {
    handleSetLineChartData(type) {
      // this.lineChartData = lineChartData[type]
      if (type !== undefined && type === 'task') this.filterUrl = this.personalFilterUrl
      if (type !== undefined && type === 'questions') this.filterUrl = this.bugFilterUrl
      if (type !== undefined && type === 'bugs') this.filterUrl = this.repairedFilterUrl
      if (type !== undefined && type === 'products') this.filterUrl = this.productFilterUrl
      if (type !== undefined && type === 'projects') this.filterUrl = this.projectFilterUrl
      window.open(this.localAddress + this.filterUrl)
    },
    get_personaData(username) {
      return new Promise((resolve, reject) => {
        getJiraData().then(response => {
          if (response) {
            const names = [].slice.call(response.product.userNames)
            const bugUrl = [].slice.call(response.repaired.userNames)
            this.productFilterUrl = response.product.filterUrl
            this.repairedFilterUrl = response.repaired.filterUrl
            this.projectFilterUrl = response.project.filterUrl
            // for (var j = 0; j < response.product.userNames.length; j++) {
            //   if (username !== undefined && username === response.product.userNames[j]) {
            //     this.personalFilterUrl = response.product.taskAddress[j]
            //     console.log(response.product.userNames[j] + '访问自己的任务地址：' + this.personalFilterUrl)
            //     break
            //   }
            // }
            for (const [res, value] of names.entries()) {
              if (username !== undefined && username === value) {
                this.personalFilterUrl = response.product.taskAddress[res]
                console.log(value + '访问自己的任务地址：' + this.personalFilterUrl)
                break
              }
            }
            // for (var k = 0; k < response.repaired.userNames.length; k++) {
            //   if (username !== undefined && username === response.repaired.userNames[k]) {
            //     this.bugFilterUrl = response.repaired.taskAddress[k]
            //     console.log('访问自己的Bug地址：' + this.bugFilterUrl)
            //     break
            //   }
            // }
            for (const [ret, val] of bugUrl.entries()) {
              if (username !== undefined && username === val) {
                this.bugFilterUrl = response.repaired.taskAddress[ret]
                console.log(val + '访问自己的Bug地址：' + this.bugFilterUrl)
                break
              }
            }
          }
        }).catch(error => {
          reject(error)
          // alert(error)
          this.$notify.error('接口相应超时')
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
