<template>
    <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import { debounce } from '@/utils';

const animationDuration = 6000;

export default {
    props: {
        className: {
            type: String,
            default: 'chart',
        },
        width: {
            type: String,
            default: '50%',
        },
        height: {
            type: String,
            default: '300px',
        },
        list: JSON,
        dashboardData: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            chart: null,
        };
    },
    watch: {
        dashboardData(u, o) {
            this.get_personaData(o);
            this.get_personaData(u);
        },
    },
    created() {
        this.initChart();
    },
    methods: {
        get_personaData(val) {
            this.initChart(val);
        },
        initChart(val) {
            this.chart = echarts.init(this.$el);
            let option = val
                ? val
                : {
                      xAxis: {
                          type: 'category',
                          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      },
                      yAxis: {
                          type: 'value',
                      },
                      series: [
                          {
                              data: [120, 200, 150, 80, 70, 110, 130],
                              type: 'bar',
                          },
                      ],
                  };

            this.chart.setOption(option);
        },
    },
};
</script>
