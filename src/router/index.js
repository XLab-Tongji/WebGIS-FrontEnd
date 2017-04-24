import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/views/headBar'
import Navigation from '@/views/navBar'
import Footer from '@/views/footBar'
import Index from '@/views/Index'
import Google from '@/views/google'
import store from '../store'

Vue.use(Router)
const router = new Router({
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

router.beforeEach( (to, from, next) => {
    console.log('beforeEach')
    console.log(store)
    console.log(store.getters.isLoggedIn)
    console.log(store.state.session.userName)
    let userName = store.state.session.userName
    let isLoggedIn = store.getters.isLoggedIn
    if(isLoggedIn) next()
    else next('/index')
  }
)

export default router
