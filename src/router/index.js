import Vue from 'vue'
import Router from 'vue-router'
<<<<<<< HEAD
import Footer from '@/views/footBar'
import Header from '@/views/headBar'
import Navigation from '@/views/navBar'
import Index from '@/views/Index'
import googleMapPage from '@/views/google'
import MyMap from '@/views/myMap'
=======
import Index from '@/views/Index'
import Google from '@/views/google'
import store from '../store'
>>>>>>> 0df1bee01863ed7f041335ba4080f4dbb3d42fac

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
