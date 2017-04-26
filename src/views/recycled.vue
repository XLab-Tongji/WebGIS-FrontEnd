<template>
  <div class="wrapper wrapper-content animated fadeInUp">
    <div class="mail-box">
      <div class="ibox-title">
        <h3>All maps deleted by {{userInfo.userName}}</h3>
      </div>

      <div class="ibox-content">
        <div class="pull-right">
          <div class="btn btn-white btn-sm" v-on:click="Refresh" data-toggle="tooltip" data-placement="top" title="Refresh trash">
            <i class="fa fa-refresh"></i> Refresh
          </div>
          <button type="button" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="restore the file">
            <i class="fa fa-pencil"></i>
          </button>
          <div class="btn btn-white btn-sm" v-on:click="deleteMaps" data-toggle="tooltip" data-placement="top" title="Delete the file">
            <i class="fa fa-trash-o"></i>
          </div>
        </div>

        <!--//读取自定义的数据-->
        <div class="trash-list" >
          <table class="table table-hover">
            <tbody>
            <tr v-for="(deletedName,index) in deletedNames">
              <td class="check-mail">
                <input type="checkbox" class="i-checks">
              </td>
              <td class="trash-title">
                <h4>{{deletedName}}</h4>
              </td>
              <td class="delete-time">
                <h5>Deleted time: {{deletedTimes[index]}}</h5>
              </td>
              <td class="trash-actions">
                <a href="#" class="btn btn-white btn-sm"><i class="fa fa-folder"></i> View </a>
                <div class="btn btn-white btn-sm" v-on:click="deleteMap(index)"><i class="fa fa-trash"></i> Delete </div>
              </td>
            </tr>

            <!--//尝试读取数据库中layer的数据-->
            <tr>
              <td class="check-mail">
                <input type="checkbox" class="i-checks">
              </td>
              <td class="trash-title">
                <h4>{{map}}</h4>
              </td>
              <td class="delete-time">
                <h5>Deleted time: {{time}}</h5>
              </td>
              <td class="trash-actions">
                <a href="#" class="btn btn-white btn-sm"><i class="fa fa-folder"></i> View </a>
                <a href="#" class="btn btn-white btn-sm"><i class="fa fa-trash"></i> Delete </a>
              </td>
            </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>

</template>



<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'trash',
    data () {
      return {
        map: '',
        time: '',

        status: '1',
        deletedMapId: ['1', '2'],//删除地图的id
        deletedTimes: ['25.04.2017', '24.04.2017'],//删除时间
        deletedNames: ['The first deleted map', 'The second deleted map'],//删除地图的标题
        account_id: '0',//用户名
      }

    },
    created () {
      this.$http.get('http://wb.lab-sse.cn/layer/layers',{params:{mapId:1}}).then(response => {
        console.log(response)
        this.map = response.data.message
      }, response => {
        // error callback
      })
      this.$http.get('http://wb.lab-sse.cn/layer/layers',{params:{mapId:1}}).then(response => {
        console.log(response)
        this.time = response.data.data.layerList[0].updateTime
      }, response => {
        // error callback
      })
    },

    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      }),
      isLoggedIn () {
        return this.userInfo.userName != "";
      }
    },

    methods: {
      Refresh: function () {
        window.location.reload();
      },
      deleteMap: function (index) {
        this.deletedNames.splice(index, 1);
      },
      deleteMaps: function () {
        var that = this;
        for (var i = that.deletedNames.length - 1; i >= 0; i--) {
          var index = that.deletedNames[i];
          if (index.checked) {
            that.deletedNames.splice(i, 1);
          }
        }
      },

    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
