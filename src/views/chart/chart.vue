<template>
    <div class="dashboard-container">
        <div class="dashboard-editor-container">
            <el-row style="background:#fff;padding:16px 0;margin-bottom:32px;">
                <div class="chart-wrapper">
                    各项目线上bug数/加一个日历控件筛选时间/饼图
                    <basic-bar :dashboardData="onLineProjChart" :width="'100%'" />
                    各项目提测bug数/加一个日历控件筛选时间/饼图
                    <basic-bar :dashboardData="testProjChart" :width="'100%'" />
                </div>
            </el-row>
            <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
                <div class="chart-wrapper">
                    线上bug数
                    <basic-bar :dashboardData="onLineBasicBar" />
                    提测bug数
                    <basic-bar :dashboardData="testBasicBar" />
                </div>
            </el-row>
            <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
                <div class="chart-wrapper">
                    线上个人bug占比/饼图
                    <basic-bar :dashboardData="onLineBasicBarAverage" />
                    提测个人bug占比/饼图
                    <basic-bar :dashboardData="testBasicBarAverage" />
                </div>
            </el-row>
            <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
                <div class="chart-wrapper">
                    线上个人bug数
                    <basic-bar :dashboardData="onLineBasicBar" />
                    陈婉君
                    <basic-bar :dashboardData="onLineBasicBar" />
                    毕友佳
                    <basic-bar :dashboardData="onLineBasicBar" />
                    肖志华
                    <basic-bar :dashboardData="onLineBasicBar" />
                    郑力可
                    <basic-bar :dashboardData="onLineBasicBar" />
                    蒋宝贤
                    <basic-bar :dashboardData="onLineBasicBar" />
                    王小宝
                    <basic-bar :dashboardData="onLineBasicBar" />
                    单志林
                    <basic-bar :dashboardData="onLineBasicBar" />
                    树文龙
                </div>
            </el-row>
            <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
                <div class="chart-wrapper">
                    测试个人bug数
                    <basic-bar :dashboardData="onLineBasicBar" />
                    陈婉君
                    <basic-bar :dashboardData="onLineBasicBar" />
                    毕友佳
                    <basic-bar :dashboardData="onLineBasicBar" />
                    肖志华
                    <basic-bar :dashboardData="onLineBasicBar" />
                    郑力可
                    <basic-bar :dashboardData="onLineBasicBar" />
                    蒋宝贤
                    <basic-bar :dashboardData="onLineBasicBar" />
                    王小宝
                    <basic-bar :dashboardData="onLineBasicBar" />
                    单志林
                    <basic-bar :dashboardData="onLineBasicBar" />
                    树文龙
                </div>
            </el-row>
        </div>
    </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner';
import PanelGroup from '../dashboard/PanelGroup';
import RadarChart from '@/components/Echarts/RadarChart';
import RadarChartP from '@/components/Echarts/RadarChartP';
import PieChart from '@/components/Echarts/PieChart';
import PieChartO from '@/components/Echarts/PieChartO';
import BarChart from '@/components/Echarts/BarChart';
import Category from '@/components/Echarts/Category';
import BasicBar from '@/components/Echarts/BasicBar';

import { getJiraData, issueTable } from '@/api/tools/jiraData';

const lineChartData = {
    products: {
        actualData: [
            {
                date: '2018-09-10',
                12: '老k',
                15: '一万',
            },
        ],
        lineheaders: [
            {
                label: '日期',
                prop: 'date',
            },
            {
                label: '斗地主',
                prop: '12',
            },
            {
                label: '麻将',
                prop: '15',
            },
        ],
    },
};

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
        BarChart,
        Category,
        BasicBar,
    },
    data() {
        return {
            onLineBasicBar: '',
            testBasicBar: '',
            onLineBasicBarAverage: '',
            testBasicBarAverage: '',
            onLineProjChart: '',
            testProjChart: '',
            lineChartData: lineChartData.products,
            localAddress: 'http://jira.diy8.com/',
            username: '',
            filterUrl: '',
            personalFilterUrl: '',
            bugFilterUrl: '',
            productFilterUrl: '',
            repairedFilterUrl: '',
            projectFilterUrl: '',
        };
    },
    created() {
        this.username = localStorage.getItem('username');
        this.get_personaData();
    },
    mounted() {
        let option = {
            xAxis: {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月'],
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
        this.onLineBasicBar = option;
        this.testBasicBar = option;
        this.onLineBasicBarAverage = option;
        this.testBasicBarAverage = option;
        let onLineProjChart = {
            xAxis: {
                type: 'category',
                data: [
                    '辅助设计',
                    'DMP',
                    '用户中心',
                    '米供',
                    '花型管家',
                    '米印',
                    '米印小程序',
                    '米定',
                    '设计师版',
                    '企业版',
                    '海外版',
                    // '设计师管理后台',
                    // '企业版管理后台',
                ],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: [
                        120,
                        200,
                        150,
                        80,
                        70,
                        110,
                        130,
                        120,
                        200,
                        150,
                        80,
                        // 70,
                        // 110
                    ],
                    type: 'bar',
                },
            ],
        };
        this.onLineProjChart = onLineProjChart;
        this.testProjChart = onLineProjChart;
    },
    methods: {
        get_personaData() {
            getJiraData()
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
    position: relative;
    padding: 32px;
    background-color: rgb(240, 242, 245);

    .github-corner {
        position: absolute;
        top: 0;
        right: 0;
        border: 0;
    }

    .chart-wrapper {
        // display: flex;
        margin-bottom: 32px;
        padding: 16px 16px 0;
        background: #fff;
    }
}

@media (max-width: 1024px) {
    .chart-wrapper {
        padding: 8px;
    }
}
</style>
