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

// Vue.http.interceptors.push((request, next)  =>{
//   var a= true;
//   if(a){
//     request.headers['X-Auth-Token'] = 'bearereyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0Iiwic2NvcGVzIjpbIlVTRVIiXSwiaXNzIjoiaHR0cDovL3N2bGFkYS5jb20iLCJpYXQiOjE0OTYxNTMxMDcsImV4cCI6MTQ5NjE1NDAwN30.k47nGdclzTPbL2Lsi_MEQjsTNE8Qm4qhij-PIKrKCfWexpQs-rf_Pl5q8CGM9mvMJVjz6-v03XsHR_zz2mRMJg'
//   }
//
//   console.log('headers', request.headers)
//
//   next((response) => {
//     console.log('response', response.status)
//     return response
//   });
//
// });

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
