<template>
  <div class="middle-box text-center loginscreen animated fadeInDown">
    <div>
      <div>
        <h1 class="logo-name">WebGIS</h1>
      </div>
      <h3>Welcome to WebGIS</h3>

      <form class="m-t" role="form" action="index.html">
        <div class="form-group">
          <!--<input type="text" class="form-control username" placeholder="用户名" required="" v-model="username">-->
          <input type="text" class="form-control " placeholder="用户名" required="" v-model="username">
        </div>
        <div class="form-group">
          <!--<input type="password" class="form-control password" placeholder="密码" required="" v-model="password">-->
          <input type="password" class="form-control " placeholder="密码" required="" v-model="password">
        </div>
        <button type="submit" class="btn btn-primary block full-width m-b" @click="userLogin()">登录</button>

        <!--<a href="#"><small>忘记密码?</small></a>-->
        <p class="text-muted text-center"><small>没有账号?</small></p>
        <router-link to="/signup" class="btn btn-sm btn-white btn-block" >注册</router-link>
        <!--<a class="btn btn-sm btn-white btn-block" href="register.html">Create an account</a>&ndash;&gt;-->
      </form>


    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'login',
    data () {
      return {
        getUrl: baseUrl + "",
        username: '',
        password: ''
      }
    },
    methods: {
      ...mapActions([
        'login'
      ]),
      ...mapGetters([
        'userStatus'
      ]),

      userLogin: function() {
        // do something here for wangyue surui

        // end
        this.login('test name')
      }
    }
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
