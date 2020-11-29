import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../../static/css/theme/index.css'

/* eslint-disable */
// 引入全局函数
import './utils/script/global-function'

// highlight.js代码高亮样式
// import 'highlight.js/styles/monokai-sublime.css'
import 'highlight.js/styles/googlecode.css' // 样式文件

// 引入css文件
import '../../static/css/index.css'
import $ from 'jquery'
/* eslint-enable */

import moment from 'moment'
import md5 from 'js-md5'

Vue.prototype.$md5 = md5
Vue.prototype.$moment = moment

Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
console.log('store', store)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
  // components: { App },
  // template: '<App/>'
}).$mount('#app')
