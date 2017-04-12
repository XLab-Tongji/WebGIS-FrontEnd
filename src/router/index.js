import Vue from 'vue'
import Router from 'vue-router'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Navigation from '@/components/navigation'
import Index from '@/components/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '',
          components: {
            navigation: Navigation,
            header: Header,
            footer: Footer
          }
        }
      ]

    }
  ]
})
