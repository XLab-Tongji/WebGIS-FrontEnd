<template>
  <div id="wrapper">

    <!--顶部按钮条-->
    <div class="row btns white-bg ">
      <div class="col-lg-12 btn-content">
        <button type="button" class="btn btn-white" id="check-icon" v-on:click="checkIconClick($event)"></button>
        <button type="button" class="btn btn-white" v-model="selectArr" v-bind:class="{list:!isList,thum:isList}" id="clearlasttoast"
                v-on:click="changeShowType"></button>
      </div>
    </div>

    <!--主体展示块-->
    <div class="wrapper-content animated fadeInRight  white-bg">
      <!--缩略图模式-->
      <div class="row" v-if="!isList">

        <!--文件-->
        <div class="ibox-div-map">
          <div class="ibox ibox-map" v-for="(mapName,index) in mapNames">
            <div class="img-box img-box-map"  v-on:mouseenter="mapMouseEnter(index,$event)"
                 v-on:mouseleave="mapMouseLeave(index,$event)">
              <img class="map-img" src="../assets/images/recycled/map.jpg">
            </div>
            <label class="name" v-on:click="mapRename(index,$event)">{{ mapName.name }}</label>
            <div class="checkBox-map" v-if="isCheck"><input type="checkbox" v-on:click="checkBoxCLick('map',index,$event)"/></div>
            <div class="op-map" v-on:click="opClick('map',index,$event)" v-on:mouseenter="opMapMouseEnter(index,$event)"
                 v-on:mouseleave="opMapMouseLeave(index,$event)">
              <img class="op-icon" src="../assets/images/myMap/op-icon.png">
            </div>
          </div>
        </div>
      </div>

      <!--列表模式-->
      <div class="row" v-if="isList">
        <table id="listTable">
          <tr>
            <td class="thead"><input v-if="isCheck" id = "checkBoxAll" type="checkbox" v-on:click="checkBoxAllClick($event)"/></td>
            <td class="thead">Name</td>
            <td class="thead">Create Time</td>
            <td class="thead">Latest Change Time</td>
            <td class="thead">Recover</td>
            <td class="thead">Delete</td>
          </tr>

          <!--文件-->
          <tr v-for="(mapName,index) in mapNames">
            <td class="tList listBox"><div class="checkBox-map" v-if="isCheck"><input type="checkbox" v-on:click="checkBoxCLick('map',index,$event)"/></div></td>
            <td class="tList listName">
              <img class="map-img-list" src="../assets/images/myMap/map-icon.png"/>{{ mapName.name }}
            </td>
            <td class="tList listTime">{{ mapName.create_time }}</td>
            <td class="tList listTime">{{ mapName.update_time }}</td>
            <td class="tList listBtn">
              <div class="renameList" v-on:click="RecoverList('map',index,$event)" data-toggle="modal"
                   data-target="#popup" />
            </td>
            <td class="tList listBtn">
              <div class="deleteList" v-on:click="DeleteList('map',index,$event)" data-toggle="modal"
                   data-target="#popup"/>
            </td>
          </tr>
        </table>
      </div>


    <!--文件操作列表-->
    <ul class="op-list" v-on:mouseleave="hideOpList($event)">
      <li v-on:click="Recover($event)" data-toggle="modal" data-target="#popup"><img
        src="../assets/images/recycled/recover.png"><label>恢复</label></li>
      <li v-on:click="Delete($event)" data-toggle="modal" data-target="#popup"><img
        src="../assets/images/myMap/delete-icon.png"><label>删除</label></li>
    </ul>

    <!--通用弹出框-->
    <div class="modal fade" id="popup" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">{{ popup.title }}</h4>
          </div>
          <div class="modal-body">
            <p v-if="popup.type == 'delete'">{{ popup.msg }}</p>
            <p v-if="popup.type != 'delete'">{{ popup.msg }}</p>
            <label>{{ popup.errorMsg }}</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">&nbsp;取消&nbsp;</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="popupConfirm($event)">&nbsp;确认&nbsp;</button>
          </div>
        </div>
      </div>
    </div>

  </div>
  </div>
</template>

<script>
  export default{
    name:"myWeb",
    data(){
      return {
        accoundId:1,
        isList:false,
        folderPath:[0],
        mapNames:[],
        currentFile: {     //当前选中的文件
          type: "folder",
          index: 0
        },
        popup: {         //弹出框相关信息
          type: "",
          title: "",
          msg: "",
          errorMsg: "",
          input: ""
        },
        isCheck:false,
      }
    },

    methods: {
        //获取回收站内地图
      getMaps: function (ID) {
        this.$http.get(baseUrl + '/recycle/recycles/1',
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body
          if (responseBody.code === 200) {
            this.mapNames = responseBody.data;
          }
        });
      },
      //彻底删除
      deleteMap: function (index, event) {
          this.$http.delete(baseUrl + "/recycle/recycles/" + this.mapNames[index].id,
            {
              emulateJSON: true
            }).then(function (response) {
            var len = this.folderPath.length;
            this.getMaps(this.folderPath[len - 1]);
          });
      },
      //恢复地图
      recoverMap: function (index, event) {
          this.$http.post(baseUrl + '/recycle/recover/' + this.mapNames[index].id,
            {
              emulateJSON: true
            }).then(function (response) {
            var len = this.folderPath.length;
            this.getMaps(this.folderPath[len - 1]);
          });
      },

      //更换显示格式
      changeShowType: function (event) {
        if (this.isList) {
          this.isList = false;

        } else {
          this.isList = true;
        }
      },

      mapMouseEnter: function (index, event) {
        $(".op-map").eq(index).css("display", "block");
        $(".img-box-map").eq(index).css("margin-top", "-8px");
      },
      mapMouseLeave: function (index, event) {
        $(".op-map").eq(index).css("display", "none");
        $(".img-box-map").eq(index).css("margin-top", "0px");
      },

      //操作
      opClick: function (type, index, event) {
        var wrapperLeft = $(".wrapper-content").offset().left;
        var wrapperTop = $(".wrapper-content").offset().top;
        var left, top;
        if (type == "folder") {
          left = $(".ibox-folder").eq(index).offset().left;
          top = $(".ibox-folder").eq(index).offset().top;
          $(".op").eq(index).css("display", "block");
          $(".op-list").css("top", top + 40 + "px");
        }
        else if (type == 'map') {
          left = $(".ibox-map").eq(index).offset().left;
          top = $(".ibox-map").eq(index).offset().top;
          $(".op-map").eq(index).css("display", "block");
        }
        this.currentFile.index = index;
        this.currentFile.type = type;
        $(".op-list").css("left", left - wrapperLeft + 140 + "px");
        $(".op-list").css("top", top - wrapperTop +15+ "px");
        $(".op-list").css("display", "block");
      },
      opMapMouseEnter: function (index, event) {
        $(".op-map").eq(index).css("display", "block");
        $(".img-box-map").eq(index).css("margin-top", "-8px");
      },
      opMapMouseLeave: function (index, event) {
        if ($(".op-list").css("display") == "none") {
          $(".op-map").eq(index).css("display", "none");
          $(".img-box-map").eq(index).css("margin-top", "0px");
        }
      },
      hideOpList: function (evnent) {
        $(".op").css("display", "none");
        $(".op-map").css("display", "none");
        $(".op-list").css("display", "none");
        $(".img-box-map").css("margin-top", "0px");
      },


      Delete: function (event) {
        this.popup.type = "delete";
        this.popup.title = "Delete";
        var name = this.currentFile.type == "folder" ? this.folderNames[this.currentFile.index].name : this.mapNames[this.currentFile.index].name;
        this.popup.msg = "Do you really want to delete the " + name;
      },

      DeleteList: function (type, index, event) {
        this.currentFile.type = type;
        this.currentFile.index = index;
        this.popup.type = "delete";
        this.popup.title = "Delete";
        var name = this.currentFile.type == "folder" ? this.folderNames[this.currentFile.index].name : this.mapNames[this.currentFile.index].name;
        this.popup.msg = "Do you really want to delete the " + name + "completely";
      },

      Recover: function (event) {
        this.popup.type = "recover";
        this.popup.title = "Recover";
        var name = this.currentFile.type == "folder" ? this.folderNames[this.currentFile.index].name : this.mapNames[this.currentFile.index].name;
        this.popup.msg = "Do you really want to recover the " + name;
      },

      RecoverList: function (type, index, event) {
        this.currentFile.type = type;
        this.currentFile.index = index;
        this.popup.type = "recover";
        this.popup.title = "Recover";
        var name = this.currentFile.type == "folder" ? this.folderNames[this.currentFile.index].name : this.mapNames[this.currentFile.index].name;
        this.popup.msg = "Do you really want to recover the " + name;
      },

      popupConfirm: function (event) {
        //删除
        if (this.popup.type == "delete") {
          this.deleteMap(this.currentFile.index, event);
        }

        else if(this.popup.type=='recover'){
            this.recoverMap(this.currentFile.index,event);
        }
        this.popup.input = "";
      },

      checkIconClick:function(event){
        this.isCheck = this.isCheck == true ? false : true;
      },
      checkBoxCLick:function(type,index,event){
      },
      checkBoxAllClick:function(event){
        if($("#checkBoxAll").is(':checked')){
          $(".checkBox-map input").attr("checked","true");
          this.clearDrop();
        }
        else{
          $(".checkBox-map input").prop("checked",function(){
            return false;
          });
          this.clearDrop();
        }
      },
    },

      mounted(){
      var len = this.folderPath.length;
      this.getMaps(this.folderPath[len - 1]);
    }
  }
</script>
