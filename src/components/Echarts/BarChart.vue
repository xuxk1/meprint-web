<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { getJiraData } from '@/api/tools/jiraData'

const animationDuration = 6000

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
    list: JSON,
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
  created() {
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
    get_personaData(val) {
      let result
      var str = []
      this.$nextTick(() => {
        this.initChart()
      })
      if (val !==null && val !=='' && val !==undefined) {
        result = JSON.parse(val).project
        for (var j = 0; j < result.projectName.length; j++) {
          var str3 = {}
          str3.name = result.projectName[j]
          str3.value = [j]
          str.push(str3)
        }
        this.chart.setOption({
          title: {
            text: '项目分布',
            subtext: '总数：' + result.projectCount
          },
          series: [{
            name: '所有子项目分布',
            data: str
          }]
        })
        console.log(str)
      }
      // return new Promise((resolve, reject) => {
      //   getJiraData().then(response => {
      //     result = response.project
      //     for (var j = 0; j < result.projectName.length; j++) {
      //       var str3 = {}
      //       str3.name = result.projectName[j]
      //       str3.value = [j]
      //       str.push(str3)
      //     }
      //     this.chart.setOption({
      //       title: {
      //         text: '项目分布',
      //         subtext: '总数：' + result.projectCount
      //       },
      //       series: [{
      //         name: '所有子项目分布',
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
          // text: '',
          // subtext: '所有子项目分布',
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
          // top: '5%',
          // left: 'center'
          left: 'center',
          bottom: '10'
        },
        series: [
          {
            // name: '访问来源',
            type: 'pie',
            radius: ['30%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            // data: [
            //   { value: 1048, name: '搜索引擎' },
            //   { value: 735, name: '直接访问' },
            //   { value: 580, name: '邮件营销' },
            //   { value: 484, name: '联盟广告' },
            //   { value: 300, name: '视频广告' }
            // ],
            animationDuration: animationDuration
          }
        ]
      })

      // this.chart.setOption({
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: { // 坐标轴指示器，坐标轴触发有效
      //       type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      //     }
      //   },
      //   grid: {
      //     top: 10,
      //     left: '2%',
      //     right: '2%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: [{
      //     type: 'category',
      //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      //     axisTick: {
      //       alignWithLabel: true
      //     }
      //   }],
      //   yAxis: [{
      //     type: 'value',
      //     axisTick: {
      //       show: false
      //     }
      //   }],
      //   series: [{
      //     name: 'pageA',
      //     type: 'bar',
      //     stack: 'vistors',
      //     barWidth: '60%',
      //     data: [79, 52, 200, 334, 390, 330, 220],
      //     animationDuration
      //   }, {
      //     name: 'pageB',
      //     type: 'bar',
      //     stack: 'vistors',
      //     barWidth: '60%',
      //     data: [80, 52, 200, 334, 390, 330, 220],
      //     animationDuration
      //   }, {
      //     name: 'pageC',
      //     type: 'bar',
      //     stack: 'vistors',
      //     barWidth: '60%',
      //     data: [30, 52, 200, 334, 390, 330, 220],
      //     animationDuration
      //   }]
      // })
    }
  }
}
</script>
