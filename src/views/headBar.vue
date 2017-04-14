<template>
  <div class="row border-bottom">
      <nav class="navbar navbar-static-top white-bg" role="navigation" style="margin-bottom: 0">
          <div class="navbar-header">
              <a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i class="fa fa-bars"></i> </a>
              <form role="search" class="navbar-form-custom" method="post" action="#">
                  <div class="form-group">
                      <input type="text" placeholder="Search for something..." class="form-control" name="top-search" id="top-search">
                  </div>
              </form>
          </div>
          <ul class="nav navbar-top-links navbar-right">
              <li>
                  <!-- <a href="#">
                      <i ></i>
                  </a> -->
                  <!-- <button  @click="increment"></button> -->
                  <router-link class="fa fa-sign-out" v-on:click.native="increment" to="#">{{count}} Log out</router-link>
              </li>
          </ul>

      </nav>
  </div>
</template>

<script>
export default {
  name: 'headBar',
  computed: {
    count () {
      return this.$store.state.count
    }
  },
  methods: {
    increment () {
      this.$store.commit('increment')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
