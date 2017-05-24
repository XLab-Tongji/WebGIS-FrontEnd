<template>
  <div class="row border-bottom">
      <nav class="navbar navbar-static-top white-bg" role="navigation" style="margin-bottom: 0">
          <div class="navbar-header">
              <a class="minimalize-styl-2 btn btn-primary" href="#" @click="toggleMenu"><i class="fa fa-bars"></i> </a>
              <form role="search" class="navbar-form-custom" method="post" action="#">
                  <div class="form-group">
                      <input type="text" placeholder="Search for something..." class="form-control" name="top-search" id="top-search">
                  </div>
              </form>
          </div>
          <ul class="nav navbar-top-links navbar-right">
              <li>
                  <router-link v-if="login" class="fa fa-sign-out" v-on:click.native="logout" to="#">{{userInfo.userName}} Log out</router-link>
              </li>
          </ul>

      </nav>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'headBar',
  computed: {
    ...mapGetters({
      userStatus: 'userStatus',
      userInfo: 'userInfo'
    }),

    login () {
      return this.userStatus.login
    }
  },
  methods: {
    ...mapActions([
    'logout'
    ]),

    toggleMenu: function () {
      $("body").toggleClass("mini-navbar");
    }
  },
  created () {
    this.toggleMenu()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
