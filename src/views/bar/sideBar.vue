<template>
  <nav class="navbar-default navbar-static-side" role="navigation">
      <div class="sidebar-collapse">
          <ul class="nav metismenu" id="side-menu">
              <li class="nav-header">
                  <div class="dropdown profile-element">
                          <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                          <span class="clear"> <span class="block m-t-xs"> <strong class="font-bold">David Williams</strong>
                           </span> <span class="text-muted text-xs block">Art Director <b class="caret"></b></span> </span> </a>
                          <ul class="dropdown-menu animated fadeInRight m-t-xs">
                              <li><a href="#">Logout</a></li>
                          </ul>
                  </div>
                  <div class="logo-element">
                      IN+
                  </div>
              </li>

              <li v-for="item in items">
                  <router-link :to="item.target" class="fa fa-th-large"> <span class="nav-label"> {{item.title}}</span> </router-link>
              </li>
          </ul>

      </div>
  </nav>

</template>

<script>
  $("body").toggleClass("mini-navbar");
  SmoothlyMenu();

export default {
  name: 'navBar',
  data () {
    return {
      items: [
        {
          target: '/myMap',
          title: ' MyMap'
        },
        {
            target: '/recycled',
            title: 'Recycled'
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
