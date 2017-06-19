<template>
  <nav class="navbar-default navbar-static-side" role="navigation">
    <div class="sidebar-collapse">
      <ul class="nav metismenu" id="side-menu">
        <li class="nav-header">
          <div class="dropdown profile-element">
            <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                          <span class="clear"> <span class="block m-t-xs"> <strong class="font-bold">{{username}}</strong>
                           </span> <span class="text-muted text-xs block">Art Director <b class="caret"></b></span> </span> </a>
            <ul class="dropdown-menu animated fadeInRight m-t-xs">
              <li><a href="#">Logout</a></li>
            </ul>
          </div>
          <div class="logo-element">
            IN+
          </div>
        </li>

        <li v-for="(item,index) in items" :class="{active:index==activeItem}" @click="itemClick(index,$event)">
          <router-link v-if="item.right=='ADMIN' || item.right == role"
                       :to="item.target"
                       class="fa"
                       :class="item.iconName"
                       :title="item.title">
            <span class="nav-label"> {{item.title}} </span>

          </router-link>
        </li>
      </ul>

    </div>
  </nav>

</template>

<script>
  export default {
    name: 'navBar',
    data () {
      return {
        role:this.$store.state.session.role,
        username: this.$store.state.session.userName,
        activeItem:0,
        items: [
          {
            target: '/myMap',
            title: ' MyMap',
            right:'ADMIN',     //用户权限
            iconName: 'fa-map-o'
          },
          {
            target: '/recycled',
            title: 'Recycled',
            right:'SUPER_ADMIN',
            iconName: 'fa-recycle'
          },
          {
            target: '/userManagement',
            title: 'UserManagement',
            right:'SUPER_ADMIN',
            iconName: 'fa-address-book'
          },
          {
            target: '/commonMap',
            title: 'CommonMap',
            right:'ADMIN',
            iconName: 'fa-map-marker'
          },
          {
            target: '/personalInfo',
            title: 'PersonalInfo',
            right:'ADMIN',
            iconName: 'fa-user-o'
          }
        ]
      }
    },
    methods:{
      itemClick:function(index,event){
        this.activeItem = index;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .nav li{
    overflow: hidden;
  }
</style>
