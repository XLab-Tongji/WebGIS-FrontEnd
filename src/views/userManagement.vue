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
            <button type="button" class="btn btn-default" data-dismiss="modal">&nbsp;取消&nbsp;</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="createUser()">
              &nbsp;确认&nbsp;</button>
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
        newAccount: "",                               //新建的用户信息
        newPassword: "",                              //新建的用户密码
        users: [{                                     //所有用户信息
          Account: '11',
          Password: '111',
          CreateTime: '2017-06-03 21:26:32',
          Company: 'TJUN'
        }, {
          Account: '12',
          Password: '111',
          CreateTime: '2017-06-03 21:26:32',
          Company: 'TJUN'
        }, {
          Account: '13',
          Password: '111',
          CreateTime: '2017-06-03 21:26:32',
          Company: 'TJUN'
        }, {
          Account: '14',
          Password: '111',
          CreateTime: '2017-06-03 21:26:32',
          Company: 'TJUN'
        }, {
          Account: '15',
          Password: '111',
          CreateTime: '2017-06-03 21:26:32',
          Company: 'TJUN'
        }]
      }
    },
    methods: {
      createUser: function () {
        alert("want to create a new user , username: " + this.newAccount + " password: " + this.newPassword);
      },
      deleteUser: function (index) {
        if(!$(".list-box").eq(index).is(":checked")){
          $(".list-box").eq(index).attr("checked","true");
        }
        for (var i = 0; i < $(".list-box").length; i++) {
          if($(".list-box").eq(i).is(":checked")){
            alert("want to delete the user : " + this.users[i].Account);
          }
        }
      },
      toggleAll:function(){
        if($(".toggleAll").is(":checked")){
          $(".list-box").prop("checked",true);
        }
        else{
          $(".list-box").prop("checked",false);
        }
      }
    },
    mounted(){
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
