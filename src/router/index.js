import Vue from 'vue'
import Router from 'vue-router'

import Header from '@/views/headBar'
import Navigation from '@/views/navBar'
import Footer from '@/views/footBar'

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
        navigation: Navigation,
        header: Header,
        mainPage: Index,
        footer: Footer
      }
    },
    {
      path: '/google',
      name: 'google',
      components: {
        navigation: Navigation,
        header: Header,
        mainPage: Google,
        footer: Footer
      }
    },
    {
      path: '*',
      name: 'others',
      redirect: '/index'
    }
  ]
})
