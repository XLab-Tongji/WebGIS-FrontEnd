import Vue from 'vue'
import Router from 'vue-router'
import Footer from '@/views/bar/footBar'
import Header from '@/views/bar/headBar'
import Navigation from '@/views/bar/sideBar'
import Index from '@/views/Index'
import GoogleMapPage from '@/views/google'
import MapCompare from '@/views/mapCompare'
import MyMap from '@/views/myMap'
import Recycled from '@/views/recycled'
import store from '../store'
import Login from '@/views/login'
import Signup from '@/views/signup'


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
      path: '/google/:mapId',
      name: 'google',
      components: {
        navigation: Navigation,
        header: Header,
        mainPage: GoogleMapPage,
        footer: Footer
      }
    },
    {
      path: '/google/compare/:mapId',
      name: 'mapCompare',
      components: {
        navigation: Navigation,
        header: Header,
        mainPage: MapCompare,
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
      path:'/recycled',
      name:'recycled',
      components:{
        navigation: Navigation,
        header: Header,
        mainPage:Recycled,
        footer: Footer
      }
    },
     {
      path: '/signup',
      name: 'signup',
      components:{
        header: Header,
        footer: Footer,
        mainPage: Signup
      }
    },
    {
      path: '/login',
      name:'login',
      components: {
        header: Header,
        footer: Footer,
        mainPage: Login
      }
    },
    {
      path: '*',
      name: 'others',
      redirect: '/index'
    }
  ]
})

// router.beforeEach( (to, from, next) => {
//     console.log('beforeEach')
//     console.log(store)
//     console.log(store.getters.isLoggedIn)
//     console.log(store.state.session.userName)
//     let userName = store.state.session.userName
//     let isLoggedIn = store.getters.isLoggedIn
//     if(isLoggedIn) next()
//     else next('/index')
//   }
// )

export default router
