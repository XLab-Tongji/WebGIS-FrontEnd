<template>
  <div id="wrapper ">

    <!--顶部按钮条-->
    <div class="row btns white-bg ">
      <div class="col-lg-12 btn-content">
        <button type="button" class="btn btn-primary" id="showtoast" data-toggle="modal"
                data-target="#user-popup">Create User
        </button>
      </div>
    </div>

    <!--主体展示块-->
    <div class="wrapper-content animated fadeInRight  white-bg">
      <div class="row">
        <table id="listTable">
          <tr>
            <td class="thead"><input type="checkbox" class="toggleAll" v-on:click="toggleAll()"/></td>
            <td class="thead">Account</td>
            <td class="thead">Password</td>
            <td class="thead">Create Time</td>
            <td class="thead">Company</td>
            <td class="thead">Delete</td>
          </tr>
          <tr v-for="(user,index) in users">
            <td class="tList "><input type="checkbox" class="list-box"/></td>
            <td class="tList ">{{ user.Account }}</td>
            <td class="tList ">{{ user.Password }}</td>
            <td class="tList ">{{ user.CreateTime }}</td>
            <td class="tList ">{{ user.Company }}</td>
            <td class="tList ">
              <button type="button" class="btn btn-danger" v-on:click="deleteUser(index)">delete</button>
            </td>

          </tr>
        </table>
      </div>
    </div>


    <!--创建用户弹出框-->
    <div class="modal fade" id="user-popup" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">Create User</h4>
          </div>
          <div class="modal-body">
            <input class="form-control" v-model="newAccount" placeholder="user name"/><br/>
            <input class="form-control" type="password" v-model="newPassword" placeholder="password"/>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">&nbsp;Cancel&nbsp;</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="createUser()">
              &nbsp;confirm&nbsp;</button>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        accoundId: this.$store.state.session.userId,
        newAccount: "",                               //新建的用户信息
        newPassword: "",                              //新建的用户密码
        users: [],
        maps: []
      }
    },
    methods: {
      deleteUserMap: function (userId, mapId) {
        //删除管理员管理的地图
        this.$http.delete(baseUrl + '/account/accounts/map?mapId=' + mapId + '&adminId=' + userId,
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200) {
          }
          else if (responseBody.code == 500) {
            toastr.error("管理员不管理该地图！");
          }
          else toastr.error("未知错误！");
        });
      },
      deleteUserMaps: function (userId) {
        var self = this;
        this.$http.get(baseUrl + '/map/maps/admin?adminId=' + userId,
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200) {
            self.maps = [];
            for (var i = 0; i < responseBody.data.length; i++) {
              var item = responseBody.data[i];
              self.maps.push({
                id: item.id
              });
              this.deleteUserMap(userId, item.id);
            }
            toastr.success("移除管理员所有地图成功！");
          }
          else if (responseBody.code == 500) {
            toastr.error("您不是超级管理员，无权进行任何操作！");
          }
          else toastr.error("未知错误！");
        });
      },
      getUsers: function () {
        console.log("[ 获取管理员 ] - " + baseUrl + "/account/accounts/admin?superAdminId=" + this.accoundId);
        this.$http.get(baseUrl + '/account/accounts/admin?superAdminId=' + this.accoundId,
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200) {
            $(".list-box").prop("checked", false);
            this.users = [];
            for (var i = 0; i < responseBody.data.length; i++) {
              var item = responseBody.data[i];
              this.users.push({
                Account: item.name,
                Password: '*******',
                CreateTime: item.create_time,
                Company: item.company == null ? "none" : item.company,
                Id: item.id
              })
            }

            //更改时间格式
            var len = this.users.length;
            for (var i = 0; i < len; i++) {
              var time = new Date(this.users[i].CreateTime);
              this.users[i].CreateTime = time.getFullYear() + "-" + time.getMonth() + "-" + time.getDay() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
            }

            toastr.success("成功加载所有管理员！")
          }
          else if (responseBody.code == 500) {
            toastr.error("您不是超级管理员，无权进行任何操作！");
          }
          else toastr.error("未知错误！");
        });
      },
      createUser: function () {
        //alert("want to create a new user , username: " + this.newAccount + " password: " + this.newPassword);
        this.$http.post(baseUrl + '/account/accounts/admin?',
          {
            emulateJSON: true,
            "name": this.newAccount,
            "username": this.newAccount,
            "password": this.newPassword,
            "superAdminId": this.accoundId
          }
        ).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200) {
            toastr.success("账号创建成功！");
            this.getUsers();
          }
          else if (responseBody.code == 500) {
            toastr.error("账号已经存在！");
          }
          else toastr.error("创建管理员失败！");
        });
      },
      deleteUser: function (index) {
        var self = this;
        if (!$(".list-box").eq(index).is(":checked")) {
          $(".list-box").eq(index).prop("checked", "true");
        }
        for (var i = 0; i < $(".list-box").length; i++) {
          if ($(".list-box").eq(i).is(":checked")) {
            //alert("want to delete the user : " + this.users[i].Account);
            this.deleteUserMaps(this.users[i].Id);
            setTimeout(function(i){
              self.$http.delete(baseUrl + '/account/accounts?username=' + self.users[i].Account,
                {
                  emulateJSON: true,
                }
              ).then(function (response) {
                var responseBody = response.body;
                if (responseBody.code === 200) {
                  toastr.success("删除账号成功！");
                  self.getUsers();
                }
                else if (responseBody.code == 500) {
                  toastr.error("账号不存在！");
                }
                else toastr.error("未知错误！");
              });
            },100,i);
          }
        }
      },
      toggleAll: function () {
        if ($(".toggleAll").is(":checked")) {
          $(".list-box").prop("checked", true);
        }
        else {
          $(".list-box").prop("checked", false);
        }
      }
    },
    mounted(){
      this.getUsers();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper {
    margin-top: 10px;
  }

  .btns {
    padding: 0;
    margin: 10px 0 0;
  }

  .tList {
    height: 50px;
  }

  #listTable {
    text-align: center;
  }

</style>
