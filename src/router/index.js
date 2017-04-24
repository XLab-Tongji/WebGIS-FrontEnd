import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/views/Index'
import Google from '@/views/google'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      components: {
        mainPage: Index,
      }
    },
    {
      path: '/google',
      name: 'google',
      components: {
        mainPage: Google,
      }
    },
    {
      path: '*',
      name: 'others',
      redirect: '/index'
    }
  ]
})
