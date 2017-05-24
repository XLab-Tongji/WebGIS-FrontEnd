<template>
  <login v-if="userStatus.login == false"></login>
  <logined v-else></logined>
</template>

<script>
  import login from '@/views/login'
  import headBar from '@/views/bar/headBar'
  import sideBar from '@/views/bar/sideBar'
  import footBar from '@/views/bar/footBar'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'app',
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters([
          'userStatus'
        ]
      )
    },
    components: {
      'login': login,
      'logined': {
        template: '<div id="app-wrapper">' +
        '<sideBar></sideBar>' +
        '<div id="page-wrapper" class="gray-bg">' +
        '<headBar></headBar>' +
        '<router-view name="mainPage"></router-view>' +
        '<footBar></footBar>' +
        '</div>' +
        '</div>',
        components: {'headBar': headBar,
          'sideBar': sideBar,
          'footBar': footBar}
      }
    },
  }
</script>

<style>

</style>
