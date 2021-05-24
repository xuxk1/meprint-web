<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { getJiraData } from '@/api/tools/jiraData'

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
    lists: JSON
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    lists: function() {
      this.get_personaData()
    }
  },
  mounted() {
    this.get_personaData()
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
    get_personaData() {
      let result
      var str = []
      this.$nextTick(() => {
        this.initChart()
      })
      return new Promise((resolve, reject) => {
        getJiraData().then(response => {
          result = response.repaired
          this.title = result.filterTitle
          for (var j = 0; j < result.taskCount.length; j++) {
            var str3 = {}
            str3.name = result.userNames[j]
            str3.value = result.taskCount[j]
            str3.url = 'http://jira.diy8.com' + result.taskAddress[j]
            str.push(str3)
          }
          this.chart.setOption({
            legend: {
              data: str.name
            },
            title: {
              text: result.filterTitle,
              subtext: '总数：' + result.issueCount
            },
            series: [{
              name: result.filterTitle,
              data: str
            }]
          })
        }).catch(error => {
          reject(error)
          this.$notify.error('接口相应超时')
        })
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '',
          subtext: '个人待办任务',
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
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: []
        },
        calculable: true,
        series: [
          {
            name: '',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 120],
            center: ['50%', '50%'],
            data: [
              { value: 320, name: '王文' },
              { value: 240, name: '周茉' },
              { value: 149, name: '白文凯' },
              { value: 100, name: '刘颖' },
              { value: 59, name: '徐小魁' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })

      this.chart.on('click', function(params) {
        window.open(params.data.url)
      })
    }
  }
}
</script>
