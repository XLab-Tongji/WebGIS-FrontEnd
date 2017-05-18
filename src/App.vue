<template>
  <login v-if="login == false"></login>
  <logined v-else></logined>
</template>

<script>
  import login from '@/views/login'
  import headBar from '@/views/bar/headBar'
  import sideBar from '@/views/bar/sideBar'
  import footBar from '@/views/bar/footBar'

  export default {
    name: 'app',
    data () {
      return {
        login: false
      }
    },
    components: {
      'login': login,
      'logined': {
        template: '<div id="app-wrapper">' +
        '<sideBar></sideBar>' +
        '<div id="page-wrapper" class="gray-bg">' +
        '<headBar></headBar>' +
        '<router-view name="main"></router-view>' +
        '<footBar></footBar>' +
        '</div>' +
        '</div>',
        components: {'headBar': headBar,
          'sideBar': sideBar,
          'footBar': footBar}
      }
    }
  }
</script>

<style>

</style>
