<template>
<!--  <div :class="className" :style="{height:height,width:width}" />-->
  <div :class="className">
    <el-table :data=chartData.actualData style="padding-top: 10px;" tooltip-effect="dark" v-if="chartData.actualData">
      <el-table-column v-if="chartData.lineheaders" align="center" v-for="item in chartData.lineheaders" :prop="item.prop" :label="item.label" :key="item.prop">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getJiraData } from '../../api/tools/jiraData'

export default {
  mixins: [resize],
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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // chart: null,
      columns: [],
      expectedData: []
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        console.log('val1=============' + val)
      }
    }
  },
  mounted: function() {
  },
  // beforeDestroy() {
  //   if (!this.chart) {
  //     return
  //   }
  //   this.chart.dispose()
  //   this.chart = null
  // },
  methods: {
    // initChart() {
    //   this.chart = echarts.init(this.$el, 'macarons')
    //   this.setOptions(this.chartData)
    // },
    // setOptions({ expectedData, actualData } = {}) {
    //   this.chart.setOption({
    //     xAxis: {
    //       data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    //       boundaryGap: false,
    //       axisTick: {
    //         show: false
    //       }
    //     },
    //     grid: {
    //       left: 10,
    //       right: 10,
    //       bottom: 20,
    //       top: 30,
    //       containLabel: true
    //     },
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {
    //         type: 'cross'
    //       },
    //       padding: [5, 10]
    //     },
    //     yAxis: {
    //       axisTick: {
    //         show: false
    //       }
    //     },
    //     legend: {expected
    //       data: ['', 'actual']
    //     },
    //     series: [{
    //       name: 'expected', itemStyle: {
    //         normal: {
    //           color: '#FF005A',
    //           lineStyle: {
    //             color: '#FF005A',
    //             width: 2
    //           }
    //         }
    //       },
    //       smooth: true,
    //       type: 'line',
    //       data: expectedData,
    //       animationDuration: 2800,
    //       animationEasing: 'cubicInOut'
    //     },
    //     {
    //       name: 'actual',
    //       smooth: true,
    //       type: 'line',
    //       itemStyle: {
    //         normal: {
    //           color: '#3888fa',
    //           lineStyle: {
    //             color: '#3888fa',
    //             width: 2
    //           },
    //           areaStyle: {
    //             color: '#f3f8ff'
    //           }
    //         }
    //       },
    //       data: actualData,
    //       animationDuration: 2800,
    //       animationEasing: 'quadraticOut'
    //     }]
    //   })
    // }
    handleSetLineChartData(type) {
      this.$parent.handleSetLineChartData(type)
    }
  }
}
</script>
