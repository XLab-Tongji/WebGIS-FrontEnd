<template>
  <div id="wrappper">
    <!--主体展示块-->
    <div class="wrapper-content animated fadeInRight  white-bg">
      <div class="row">
        <form class="form-horizontal" role="form">
          <div class="form-group">
            <label class="col-sm-2 control-label">Name</label>
            <div class="col-sm-8">
              <input class="form-control"type="text" v-bind:value="name" disabled>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Username</label>
            <div class="col-sm-8">
              <input class="form-control" type="text" v-bind:value="username" disabled>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Company</label>
            <div class="col-sm-8">
              <input class="form-control" type="text" v-bind:value="company" disabled>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Role</label>
            <div class="col-sm-8">
              <input class="form-control" type="text" v-bind:value="role" disabled>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">SuperAdminName</label>
            <div class="col-sm-8">
              <input class="form-control" type="text" v-bind:value="superAdminName" disabled>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Old Password</label>
            <div class="col-sm-8">
              <input v-model="oldPass" class="form-control" type="password" placeholder="please input your old password">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">New Password</label>
            <div class="col-sm-8">
              <input v-model="newPass" class="form-control" type="password" placeholder="please input your new password">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">Confirm Password</label>
            <div class="col-sm-8">
              <input v-model="confirmPass" class="form-control" type="password" placeholder="please input your new password again">
            </div>
            <div class="col-sm-2">
              <button type="button" class="btn btn-white" v-on:click="changePassword()">Change Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        name: '111',
        username: '222',
        company: '333',
        role: "ADMIN",
        superAdminName:"444",
        oldPass:'',
        newPass:'',
        confirmPass:''
      }
    },
    methods:{
      changePassword:function(){
        this.$http.put(baseUrl + '/account/account/',
          {
            emulateJSON: true,
            "accountId":this.$store.state.session.userId,
            "oldPassword":this.oldPass,
            "newPassword":this.newPass,
            "confirmPassword":this.confirmPass
          }
        ).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200) {
              toastr.success("修改密码成功");
          }
          else if(responseBody.code === 500){
            toastr.error(responseBody.message);
          }
        });
      }
    },
    mounted(){
      this.$http.get(baseUrl + '/account/account/' + this.$store.state.session.userId,
        {
          emulateJSON: true
        }
      ).then(function (response) {
        var responseBody = response.body;
        if (responseBody.code === 200) {
          var data =  responseBody.data;
          this.name = data.name;
          this.role = data.role;
          this.company = data.company;
          this.superAdminName = data.superAdminName;
          this.username = data.username;
          console.log( responseBody.data)
        }
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #wrappper {
    padding-top: 10px;
  }
  .row{
    padding-top:50px;
  }
  .value input{
    height:30px;
    margin-top:10px;
    border:1px solid gray;
  }
</style>
