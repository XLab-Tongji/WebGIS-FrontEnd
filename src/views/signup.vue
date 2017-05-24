<template>

  <div class="middle-box text-center loginscreen   animated fadeInDown">
    <div>
      <div>

        <h1 class="logo-name">WebGIS</h1>

      </div>
      <h3>注册WebGIS账号</h3>



      <form class="m-t" role="form" action=#>
        <div    class="form-group">
          <input type="text" class="form-control" placeholder="账号" v-model="registerModel.username" >
        </div>
        <div class="form-group">
          <input type="text" class="form-control" placeholder="昵称"  v-model="registerModel.name">
        </div>
        <div class="form-group">
          <input type="password" class="form-control" placeholder="密码"  v-model="registerModel.password">
        </div>
        <div class="form-group">
          <div class="checkbox i-checks"><label> <input type="checkbox"><i></i> 同意相关条款与政策 </label></div>
        </div>
        <button type="submit" class="btn btn-primary block full-width m-b" v-on:click="register">注册</button>

        <p class="text-muted text-center"><small>已有账号?</small></p >
        <router-link class="btn btn-sm btn-white btn-block"  to="/login">登录</router-link >
      </form>

    </div>
  </div>


</template>



<script>

  export default{
    name: "signup",
    data () {
      return {
        registerUrl: baseUrl + '/account/accounts',
        registerModel: {
          name: '',
          username: '',
          password: ''
        },

      }

    },
    methods: {
      register: function() {
        this.$http.post(this.registerUrl, this.registerModel)
          .then(function(response){
          console.log("get a response after create a map");
          var responseBody = response.body;
          if (responseBody.code === 200 && responseBody.message == "successful") {
            alert("注册成功!");
            this.$router.push('/login');
          }
          else{
            alert("注册失败!");
          }
        });

      }
    }
  }

</script>
