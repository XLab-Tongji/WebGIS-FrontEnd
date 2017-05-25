<template>
  <div class="middle-box text-center loginscreen animated fadeInDown">
    <div>
      <div>
        <h1 class="logo-name">WebGIS</h1>
      </div>
      <h3>Welcome to WebGIS</h3>

      <form class="m-t" role="form">
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
        getUrl: baseUrl + '/auth/token',
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

//          console.log("try");
        // do something here for wangyue surui
        //判断是否填写数据
        //console.log(this.username);
        if(this.password =="" || this.username==""){
          return false;

        }


        //接口请求数据
        var _data = {
          "username":this.username,
          "password":this.password,

        };
//        console.log(_data.username);
//        this.$http.get('http://115.159.65.170:8080/test/state').then(
//            function (response) {
//              console.log(response)
//            }
//        )
//        this.$http.post(this.getUrl, _data)
        console.log('----------0')
        this.$http.post(this.getUrl, {"username":"123","password":"123"})
          .then(function(response){
              console.log('---------------------1')
              console.log(response)
              console.log('---------------------2')
//            console.log("get a response after create a map");
//            var responseBody = response.body;
////            alert("responseBody.code");
//            if (responseBody.code === 200 ) {
//              alert("登录成功!");
//              this.$store.commit("LOG_IN",userName);
//
//
//            }
//            else{
//              alert("登录失败!");
//            }
          },
          function (response) {
            console.log('----------error')
            console.log(response)
          });

        //等待提示
//        $('#loadingToast').show();

        //接口请求
//        this.$http.post(this.getUrl, _data, {emulateJSON:true}).then(function(response)(
//        var responseBody = response.body;
//        if (responseBody.code === 200 && responseBody.message == "successful") {
//          alert("注册成功!");
//          //this.GLOBAL.userName = localStorage.setItem("currentUser_name",this.username);
//        }
//        else{
//          alert("注册失败!");
//        })
//          function(o){
//            console.log(o.data);
//            return false;

            //接口返回信息
//            var res = o.data;
 //           this.GLOBAL.userName = localStorage.setItem("currentUser_name",this.username);

            //提示信息
//            this.msg = res.info;
////            window.setTimeout(function(){
////              $('#loadingToast').hide();
////              this.mag = '正在登陆中...';
////            },1000);
//            if(res.code == 200 ){
//                alert('success');
//             this.GLOBAL.userName = res.data.name;
////              this.load();
//            }
//
//          },function(res){
//            //请求失败
//            this.msg = '登录异常，请重新登录';
//            alert("shibai");
//            alert(res.info);
////            window.setTimeout(function(){
////              $('#loadingToast').hide();
////            },1000);
//          }
//        );
//        // end
//       this.login(userName)
//      }

    }
    }
  }

</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
