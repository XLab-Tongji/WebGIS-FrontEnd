import Vue from 'vue'
import Router from 'vue-router'
import Footer from '@/views/bar/footBar'
import Header from '@/views/bar/headBar'
import Navigation from '@/views/bar/sideBar'
import Index from '@/views/Index'
import googleMapPage from '@/views/google'
import MyMap from '@/views/myMap'
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
        mainPage: Index,
      }
    },
    {
      path: '/google',
      name: 'google',
      components: {
        navigation: Navigation,
        header: Header,
        mainPage: googleMapPage,
        footer: Footer
      }
    },
    {
      path:'/myMap',
      name:'myMap',
      components:{
        navigation: Navigation,
        header: Header,
        mainPage:MyMap,
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
