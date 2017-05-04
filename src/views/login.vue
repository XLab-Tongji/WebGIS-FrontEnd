<template>
  <div class="middle-box text-center loginscreen animated fadeInDown">
    <div>
      <div>
        <h1 class="logo-name">WebGIS</h1>
      </div>
      <h3>Welcome to WebGIS</h3>

      <form class="m-t" role="form" action="index.html">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="用户名" required="" v-model="username">
        </div>
        <div class="form-group">
          <input type="password" class="form-control" placeholder="密码" required="" v-model="password">
        </div>
        <button type="submit" class="btn btn-primary block full-width m-b">登录</button>

        <!--<a href="#"><small>忘记密码?</small></a>-->
        <p class="text-muted text-center"><small>没有账号?</small></p>
        <router-link to="/signup" class="btn btn-sm btn-white btn-block" >注册</router-link>
        <!--<a class="btn btn-sm btn-white btn-block" href="register.html">Create an account</a>&ndash;&gt;-->
      </form>


    </div>
  </div>
</template>

<script>

  export default{
    name: "login",
    data () {
      return {
        loginForm: {
          userName: '',
          password: ''
        },
        loginRule: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 16 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ]
        }
      }

    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var data = {
              'usr': this.loginForm.userName,
              'pwd': this.loginForm.pwd
            }
            Axios.post('http://wb.lab-sse.cn/account/sessions', data)
              .then(res => {
                if (res.data.code === 0) {
                  sessionStorage.setItem('accessToken', res.data.access_token)
                  sessionStorage.setItem('username', res.data.data.username)
                  sessionStorage.setItem('uid', res.data.data._id)
                  this.$store.dispatch('showLogin')
                  this.$message({
                    showClose: true,
                    message: '登录成功',
                    type: 'success'
                  })
                  router.push({path: '/p/index', params: { username: res.data.username }})
                } else {
                  this.$message({
                    showClose: true,
                    message: '登录失败，账号或密码错误',
                    type: 'error'
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            return false
          }
        })
      }
    }

  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
