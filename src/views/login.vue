<template>
  <div class="middle-box text-center loginscreen animated fadeInDown">
    <div>
      <div>
        <h1 class="logo-name">WebGIS</h1>
      </div>
      <h3>Welcome to WebGIS</h3>

      <form class="m-t" role="form" action="index.html">
        <div class="form-group">
          <input type="text" class="form-control username" placeholder="用户名" required="" v-model="username">
        </div>
        <div class="form-group">
          <input type="password" class="form-control password" placeholder="密码" required="" v-model="password">
        </div>
        <button type="submit" class="btn btn-primary block full-width m-b" @click="getList()">登录</button>

        <!--<a href="#"><small>忘记密码?</small></a>-->
        <p class="text-muted text-center"><small>没有账号?</small></p>
        <router-link to="/signup" class="btn btn-sm btn-white btn-block" >注册</router-link>
        <!--<a class="btn btn-sm btn-white btn-block" href="register.html">Create an account</a>&ndash;&gt;-->
      </form>


    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {

    //num : this.$route.query.num,
    data(){
      return {
//        name : 'rule-list',
        getUrl: "http://wb.lab-sse.cn/account/sessions",
//        items: []
      }
    },

    methods: {
      //数据请求
      getList: function () {
        //获取 url get参数num值
//        var num = this.$route.query.num;

        //请求数据
        var username = $('.username').val();
        var _password = $('.password').val();
        //请求数据
        var _data = {
          "username" : username,
          "password" : _password
        };
        alert(username);
        return false;
        //post请求方法
        this.$http.post(this.getUrl, _data, {emulateJSON: true}).then(
          function (res) {
            alert()

          }, function (res) {
            //请求失败
          }
        );
      }
    },
//    created: function () {
//      this.getList();
//    }
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
