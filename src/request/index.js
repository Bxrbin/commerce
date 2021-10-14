import axios from 'axios'
// import store from './../store/index.js'
export default function (config) {
  const instance = axios.create({
    
    // baseURL: '/api',
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 3000
  });
  // 添加请求拦截器
  instance.interceptors.request.use(
    function (config) {
      // 在发送请求之前做些什么
      // console.log(store);
      // store.commit('updateLoading', true)
      if (config.url != '/Login') {
        config.headers['Authorization'] = sessionStorage.getItem('token')
      }
      return config;
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    }
  );

  // 添加响应拦截器
  instance.interceptors.response.use(
    function (response) {
      // 对响应数据做点什么
      /* 关闭等待 */
      // store.commit('updateLoading', false)
      // if (response.data.status == 400) {
      //   alert('请续费')
      //   router.push('/Login')
      // }
      return response;
    },
    function (error) {
      // 对响应错误做点什么
      return Promise.reject(error);
    }
  );
  return instance(config)
}