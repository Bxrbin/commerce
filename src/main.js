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

Vue.use(VueAxios, axios)
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')