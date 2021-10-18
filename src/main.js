import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from 'axios'
import VueAxios from 'vue-axios'
/* 引用公共样式 */
import './assets/css/global.css'
/* 引用icon图标 */
import './assets/fonts/iconfont.css'
/* 引用树状表格 */
import TreeTable from 'vue-table-with-tree-grid'
 Vue.component('tree-table',TreeTable)

Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.config.productionTip = false
// 时间过滤器
Vue.filter('dateFromat',function(originVal){
  const dt = new Date(originVal)

  // 年月日
  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+1+'').padStart(2,'0')

  // 时分秒
  const hh = (dt.getHours()+1+'').padStart(2,'0')
  const mm = (dt.getMinutes()+1+'').padStart(2,'0')
  const ss= (dt.getSeconds()+1+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')