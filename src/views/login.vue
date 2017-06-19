<template>
  <div class="text-center animated fadeInDown login-main">
    <div class=" text-center">
      <h2 class="brand-name">在线公共设施管理平台</h2>
    </div>
    <h3>欢迎来到在线公共设施管理平台</h3>

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
  import UserService from  '../service/httpService/userService'

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
        if(this.username == "" || this.password == ""){
          toastr.warning("输入不合法");
          return;
        }
        let response = await UserService.login(this, {
          username: this.username,
          password: this.password
        });
        if (response.code === 200) {
          this.login({
            username: this.username,
            userId: response.data.id,
            role: response.data.role,
            company: response.data.company
          })
        }
        else {
          toastr.error("密码错误！")
        }
      }
    }
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .brand-name {
    font-size: 60px;
    text-space: 2em;
    color: whitesmoke;
  }
  .login-main {
    padding-top: 8%;
  }
</style>
