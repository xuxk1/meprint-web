import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
//
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 数据字典
import dict from './components/Dict'

// 权限指令
import checkPer from '@/utils/permission'
import permission from './components/Permission'
import './assets/styles/element-variables.scss'
// global css
import './assets/styles/index.scss'

// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App'
import store from './store'
import router from './router/routers'

import './assets/icons' // icon
import './router/index' // permission control
import 'echarts-gl'
import kity from 'kity'
import kityminder from 'kityminder-core'
import 'vue-kityminder-editor/lib/kityMinder.css'
import kityMinder from 'vue-kityminder-editor'

import axios from 'axios'

require('../node_modules/codemirror/lib/codemirror.js')
require('../node_modules/codemirror/mode/xml/xml.js')
require('../node_modules/codemirror/mode/javascript/javascript.js')
require('../node_modules/codemirror/mode/css/css.js')
require('../node_modules/codemirror/mode/htmlmixed/htmlmixed.js')
require('../node_modules/codemirror/mode/markdown/markdown.js')
require('../node_modules/codemirror/addon/mode/overlay.js')
require('../node_modules/codemirror/mode/gfm/gfm.js')
require('../node_modules/marked/lib/marked.js')
require('../node_modules/kity/dist/kity.js')
require('../node_modules/hotbox/hotbox.js')
require('../node_modules/kityminder-core/dist/kityminder.core.js')
require('../node_modules/kityminder-core/src/core/patch.js')
require('./script/expose-editor.js')

Vue.prototype.$axios = axios

Vue.use(kity)
Vue.use(kityMinder)
Vue.use(kityminder)
Vue.use(checkPer)
Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
