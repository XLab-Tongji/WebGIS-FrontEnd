// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'

import './global'

Vue.use(VueResource);
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  store,
  components: {
    App
  }
})

Vue.http.interceptors.push({
  request(request) {
    const jwtToken = JSON.parse(localStorage.getItem('auth.jwt_token'));
    if (jwtToken) {
      Vue.http.headers.common.Authorization = `Bearer ${jwtToken.access_token}`;
    } else {
      delete Vue.http.headers.common.Authorization;
    }
    return request;
  },
  response(response) {
    if (response.status === 400 || response.status === 401) {
      // 当 Token 已经失效时，清空所有保存在 localStorage 的数据
      localStorage.clear();
    }
    return response;
  },
});
