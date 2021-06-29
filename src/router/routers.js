import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/login',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/system/case/xmind',
    component: (resolve) => require(['@/views/components/XmindEditor'], resolve),
    // component: Layout,
    hidden: true,
    // redirect: '/system/case/xmind',
    name: 'xmindeditor',
    meta: { title: '脑图', noCache: true }
    // children: [
    //   {
    //     path: '/system/case/xmind',
    //     component: (resolve) => require(['@/views/components/XmindEditor'], resolve),
    //     name: 'Xmind',
    //     meta: { title: '脑图', affix: true, noCache: true }
    //   }
    // ]
  },
  {
    path: '/system/task/task',
    component: (resolve) => require(['@/views/components/TaskEditor'], resolve),
    hidden: true,
    name: 'taskeditor',
    meta: { title: '测试任务', noCache: true }
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/home'], resolve),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/chart',
    component: Layout,
    redirect: '/chart',
    children: [
      {
        path: 'chart',
        component: (resolve) => require(['@/views/chart/chart'], resolve),
        name: 'Chart',
        meta: { title: '质量大盘' }
      }
    ]
  },
  {
    path: '/Echarts',
    component: Layout,
    redirect: '/Echarts',
    children: [
      {
        path: 'Echarts',
        component: (resolve) => require(['@/views/components/Echarts'], resolve),
        name: 'Echarts',
        meta: { title: 'Echarts' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  }

]

export default new Router({
  // mode: 'hash',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
