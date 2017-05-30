<template>
  <div class=" text-center animated fadeInDown">
    <div class=" text-center">
      <h2 class="logo-name">WebGIS</h2>
    </div>
    <h3>Welcome to WebGIS</h3>

    <form class="m-t middle-box loginscreen" >
      <div class="form-group">
        <input type="text" class="form-control " placeholder="用户名" required="" v-model="username">
      </div>
      <div class="form-group">
        <input type="password" class="form-control " placeholder="密码" required="" v-model="password">
      </div>
      <button type="button" class="btn btn-primary block full-width m-b" @click="userLogin">登录</button>

      <p class="text-muted text-center"><small>没有账号?</small></p>
      <router-link to="/signup" class="btn btn-sm btn-white btn-block" >注册</router-link>
    </form>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import * as UserService from  '../service/htppService/userService'

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

      userLogin: async function() {
        let response = await UserService.login(this, {
          username: this.username,
          password: this.password
        })
        if (response.state === 0) {
          this.login(this.username)
        }
        else {
            alert("密码错误！")
        }
      }
    }
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .logo-name {
    font-size: 130px;
  }
</style>
