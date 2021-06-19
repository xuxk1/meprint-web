<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { getJiraData } from '@/api/tools/jiraData'

const animationDuration = 3000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '520px'
    },
    lists: JSON,
    dashboardData:{
      type: String,
      default: '',
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    dashboardData (u,o) {
      this.get_personaData(o)
      this.get_personaData(u)
    }
  },
  mounted() {
    this.get_personaData(this.dashboardData)
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    get_personaData (val) {
      let result
      var str = []
      this.$nextTick(function() {
        this.initChart()
      })
      if (val !==null && val !=='' && val !==undefined) {
        result = JSON.parse(val).product
        for (var j = 0; j < result.taskCount.length; j++) {
          var str3 = {}
          str3.name = result.userNames[j]
          str3.value = result.taskCount[j]
          str3.url = 'http://jira.diy8.com' + result.taskAddress[j]
          str.push(str3)
        }
        this.chart.setOption({
          title: {
            text: result.filterTitle,
            subtext: '总数：' + result.issueCount
          },
          series: [{
            name: result.filterTitle,
            data: str
          }]
        })
      }
      // return new Promise((resolve, reject) => {
      //   getJiraData().then(response => {
      //     result = response.product
      //     for (var j = 0; j < result.taskCount.length; j++) {
      //       var str3 = {}
      //       str3.name = result.userNames[j]
      //       str3.value = result.taskCount[j]
      //       str3.url = 'http://jira.diy8.com' + result.taskAddress[j]
      //       str.push(str3)
      //     }
      //     this.chart.setOption({
      //       title: {
      //         text: result.filterTitle,
      //         subtext: '总数：' + result.issueCount
      //       },
      //       series: [{
      //         name: result.filterTitle,
      //         data: str
      //       }]
      //     })
      //   }).catch(error => {
      //     reject(error)
      //     this.$notify.error('接口相应超时')
      //   })
      // })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          // text: text'',
          // subtext: '个人待办任务',
          left: 'center',
          textStyle: {
            fontSize: 16,
            fontWeight: 'bolder',
            color: 'rgba(0, 0, 0, 0.45)'
          },
          subtextStyle: {
            fontSize: 16,
            color: 'rgba(3,144,197,0.74)'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          // orient: 'vertical',
          // left: 'left',
          left: 'center',
          bottom: '10'
        },
        series: [
          {
            // name: '',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            // data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            animationDuration: animationDuration
          }
        ]
      })

      this.chart.on('click', function(params) {
        window.open(params.data.url)
      })
      // this.chart.setOption({
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
      //       type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      //     }
      //   },
      //   radar: {
      //     radius: '66%',
      //     center: ['50%', '42%'],
      //     splitNumber: 8,
      //     splitArea: {
      //       areaStyle: {
      //         color: 'rgba(127,95,132,.3)',
      //         opacity: 1,
      //         shadowBlur: 45,
      //         shadowColor: 'rgba(0,0,0,.5)',
      //         shadowOffsetX: 0,
      //         shadowOffsetY: 15
      //       }
      //     },
      //     indicator: [
      //       { name: 'Sales', max: 10000 },
      //       { name: 'Administration', max: 20000 },
      //       { name: 'Information Techology', max: 20000 },
      //       { name: 'Customer Support', max: 20000 },
      //       { name: 'Development', max: 20000 },
      //       { name: 'Marketing', max: 20000 }
      //     ]
      //   },
      //   legend: {
      //     left: 'center',
      //     bottom: '10',
      //     data: ['Allocated Budget', 'Expected Spending', 'Actual Spending']
      //   },
      //   series: [{
      //     type: 'radar',
      //     symbolSize: 0,
      //     areaStyle: {
      //       normal: {
      //         shadowBlur: 13,
      //         shadowColor: 'rgba(0,0,0,.2)',
      //         shadowOffsetX: 0,
      //         shadowOffsetY: 10,
      //         opacity: 1
      //       }
      //     },
      //     data: [
      //       {
      //         value: [5000, 7000, 12000, 11000, 15000, 14000],
      //         name: 'Allocated Budget'
      //       },
      //       {
      //         value: [4000, 9000, 15000, 15000, 13000, 11000],
      //         name: 'Expected Spending'
      //       },
      //       {
      //         value: [5500, 11000, 12000, 15000, 12000, 12000],
      //         name: 'Actual Spending'
      //       }
      //     ],
      //     animationDuration: animationDuration
      //   }]
      // })
    }
  }
}
</script>
