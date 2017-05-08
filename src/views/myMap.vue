<template>
  <div id="wrapper">

    <!--顶部按钮条-->
    <div class="row btns white-bg ">
      <div class="col-lg-12 btn-content">
        <button type="button" class="btn btn-primary" id="showtoast" v-on:click="createMap">Create Map</button>
        <button type="button" class="btn btn-white" id="cleartoasts" v-on:click="createFolder">Create Folder</button>
        <button type="button" class="btn btn-white" id="back-btn" v-on:click="back"
                v-on:mouseup="dragBack($event)"></button>
        <button type="button" class="btn btn-white" v-bind:class="{list:!isList,thum:isList}" id="clearlasttoast"
                v-on:click="changeShowType"></button>
        <div class="path">
          <label></label>
          <ul>
            <li v-on:click="RootClick($event)"><label class="path-item">Root </label></li>
            <li v-on:click="pathClick(index,$event)" v-for="(item,index) in folderPathName">&nbsp;<span
              class='split'>/</span> <label class="path-item">{{ item }} </label></li>
          </ul>
        </div>
      </div>
    </div>

    <!--主体展示块-->
    <div class="wrapper-content animated fadeInRight  white-bg">

      <!--缩略图模式-->
      <div class="row" v-if="!isList">

        <!--文件夹-->
        <div class="ibox-div-folder">
          <div class="ibox ibox-folder" v-for="(folderName,index) in folderNames">
            <div class="folder-body" v-on:click="folderClick(index,$event)"
                 v-on:mousedown="fileMouseDown('folder',index,$event)" v-on:mouseup="fileMouseUp(index,$event)"
                 v-on:mouseenter="fileMouseEnter(index,$event)" v-on:mouseleave="fileMouseLeave(index,$event)">
              <div class=" img-box-folder">
                <img class="folder-img" src="../assets/images/myMap/folder-icon.png">
              </div>
              <label class="name name-folder">{{ folderName.name }}</label>
            </div>
            <div class="op" v-on:click="opClick(index,$event)" v-on:mouseenter="fileMouseEnter(index,$event)" v-on:mouseleave="fileMouseLeave(index,$event)">
              <img class="op-icon" src="../assets/images/myMap/op-icon.png">
            </div>
          </div>
        </div>

        <!--文件-->
        <div class="ibox-div-map">
          <div class="ibox" v-for="(mapName,index) in mapNames">
            <div class="img-box img-box-map" v-on:click="mapClick(index,$event)"
                 v-on:mousedown="fileMouseDown('map',index,$event)">
              <img class="map-img" src="../assets/images/myMap/myMap.jpg">
            </div>
            <div class="delete" v-on:click="deleteMap(index,$event)"/>
            <label class="name" v-on:click="mapRename(index,$event)">{{ mapName.name }}</label>
          </div>
        </div>
      </div>

      <!--列表模式-->
      <div class="row" v-if="isList">
        <table id="listTable">
          <tr>
            <td class="thead">Name</td>
            <td class="thead">Type</td>
            <td class="thead">Create Time</td>
            <td class="thead">Latest Change Time</td>
            <td class="thead">Rename</td>
            <td class="thead">Delete</td>
          </tr>

          <!--文件夹-->
          <tr v-for="(folderName,index) in folderNames">
            <td class="tList listName" v-on:click="folderClick(index,$event)"
                v-on:mousedown="fileMouseDown('folder',index,$event)" v-on:mouseup="fileMouseUp(index,$event)">{{
              folderName.name }}
            </td>
            <td class="tList">文件夹</td>
            <td class="tList">{{ folderName.create_time }}</td>
            <td class="tList">{{ folderName.update_time }}</td>
            <td class="tList">
              <div class="renameList"></div>
            </td>
            <td class="tList">
              <div class="deleteList"></div>
            </td>
          </tr>

          <!--文件-->
          <tr v-for="(mapName,index) in mapNames">
            <td class="tList listName" v-on:click="mapClick(index,$event)"
                v-on:mousedown="fileMouseDown('map',index,$event)">{{ mapName.name }}
            </td>
            <td class="tList">地图</td>
            <td class="tList">{{ mapName.create_time }}</td>
            <td class="tList">{{ mapName.update_time }}</td>
            <td class="tList">
              <div class="renameList" v-on:click="mapRename(index,$event)"/>
            </td>
            <td class="tList">
              <div class="deleteList" v-on:click="deleteMap(index,$event)"/>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!--拖拽浮窗-->
    <div id="dragDiv"
         v-bind:style="{ left: dragDiv.dragLeft + 'px', top: dragDiv.dragTop + 'px',display:draged.isdrag ? 'block' : 'none' }">
      <label>{{ dragDiv.dragValue }}</label>
    </div>

    <!--文件夹操作列表-->
    <ul class="op-list" v-on:mouseleave="hideOpList($event)">
      <li v-on:click="folderRename($event)"><img src="../assets/images/myMap/rename-icon.png"><label>重命名</label></li>
      <li v-on:click="deleteFolder($event)"><img src="../assets/images/myMap/delete-icon.png"><label>删除</label></li>
    </ul>

  </div>

</template>

<script>
  export default{
    name: "myWeb",
    data(){
      return {
        accoundId: 1,      //账户ID
        isList: false,    //查看类型，为True代表列表模式，否则为缩略图模式
        folderPath: [0],   //存储访问路径，最后一个元素代表当前所在文件夹ID，根目录为0
        folderPathName: [], //存储路径名称
        folderNames: [],   //当前文件夹中的所有文件夹信息
        mapNames: [],      //当前文件夹中的所有地图信息
        draged: {          //辅助拖拽功能
          isdrag: false,  //是否正在拖拽
          type: "",        //被拖拽的文件类型
          index: 0         //被拖拽的文件序号
        },
        dragDiv: {         //拖拽浮窗
          move: false,     //按下鼠标等待1s才能移动
          dragValue: "drag value",
          dragLeft: -100,
          dragTop: -100
        },
        currentFolder: 0   //当前选中的文件夹
      }
    },
    methods: {
      /*文件夹事件*/
      getFolders: function (ID) {
        //this.folderNames = [{name:"folder1"},{name:"folder2"}];   //模拟数据，仅用作测试
        this.$http.get('http://wb.lab-sse.cn/folder/folders/accountidandupperfolder?accountId=1&upperFolder=' + ID,
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body
          if (responseBody.code === 200) {
            this.folderNames = responseBody.data;
          }
        });
      },
      createFolder: function (event) {
        //弹出对话框并获取文件夹名
        var newIndex = this.folderNames.length + 1;
        var newFolder = prompt("Input your folder name:", "folder" + newIndex);

        //获取创建文件夹的父文件夹编号
        var len = this.folderPath.length;
        var parentFolder = this.folderPath[len - 1];

        //如果文件夹名符合规范，则向后端请求创建文件夹
        if (newFolder != null && newFolder != "") {
          console.log("try to create a new folder");
          this.$http.post('http://wb.lab-sse.cn/folder/folders',
            {
              "accountId": this.accoundId,
              "name": newFolder,
              "upper_folder": parentFolder
            }
          ).then(function (response) {
            console.log("get a response after create a folder");
            var responseBody = response.body;
            if (responseBody.code === 200 && responseBody.message == "successful") {
              this.getFolders(parentFolder);    //更新界面
            }
            else {
              alert("Fail to create a new folder!");
            }
          });
        }
      },
      folderClick: function (index, event) {
        console.log("Click the folder " + this.folderNames[index].name);
        //更新路径
        this.folderPathName.push(this.folderNames[index].name);

        //把当前文件夹编号存入历史路径中
        var folderId = this.folderNames[index].id;
        this.folderPath.push(folderId);

        //获取内容
        this.getFolders(folderId);
        this.getMaps(folderId);

        console.log("Get the folders and maps");
      },
      deleteFolder: function (event) {
        if (confirm("Do you really want to delete the folder: \n     " + this.folderNames[this.currentFolder].name)) {
          this.$http.delete("http://wb.lab-sse.cn/folder/folders/id?folderId=" + this.folderNames[this.currentFolder].id,
            {
              emulateJSON: true
            }).then(function (response) {
            console.log("delete folder " + this.folderNames[this.currentFolder].id + "successful");
            var len = this.folderPath.length;
            this.getFolders(this.folderPath[len - 1]);
          });
        }
      },
      folderRename: function (event) {
        var newFolder = prompt("Input new folder name:", this.folderNames[this.currentFolder].name);
        var len = this.folderPath.length;
        if (newFolder != null && newFolder != "") {
          this.$http.patch("http://wb.lab-sse.cn/folder/folders/id",
            {
              emulateJSON: true,
              id: this.folderNames[this.currentFolder].id,
              name: newFolder,
              upper_folder: this.folderPath[len - 1],
              accoundId: this.accoundId
            }).then(function (response) {
            this.getFolders(this.folderPath[len - 1]);
          });
        }
      },

      /*地图事件*/
      getMaps: function (ID) {
        //this.mapNames = [{name:"map1"},{name:"map2"}];  //模拟数据，仅用作测试
        this.$http.get('http://wb.lab-sse.cn/map/maps/accountidandfolderid?accountId=1&folderId=' + ID,
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
      createMap: function (event) {
        //弹出对话框并获取地图名
        var newIndex = this.mapNames.length + 1;
        var newMap = prompt("Input your map name:", "map" + newIndex);

        //获取创建地图的父文件夹编号
        var len = this.folderPath.length;
        var parentFolder = this.folderPath[len - 1];

        //如果地图名符合规范，则向后端请求创建文件夹
        if (newMap != null && newMap != "") {
          console.log("try to create a new map");
          this.$http.post('http://wb.lab-sse.cn/map/maps',
            {
              "accountId": this.accoundId,
              "name": newMap,
              "folder": parentFolder
            }
          ).then(function (response) {
            console.log("get a response after create a map");
            var responseBody = response.body;
            if (responseBody.code === 200 && responseBody.message == "successful") {
              this.getMaps(parentFolder);    //更新界面
            }
            else {
              alert("Fail to create a new map!");
            }
          });
        }
      },
      mapClick: function (index, event) {
        this.$router.push({name: 'google', params: {mapId: this.mapNames[index].id}});
//        alert("you click the " + this.mapNames[index].name + this.mapNames[index].id);
      },
      deleteMap: function (index, event) {
        if (confirm("Do you really want to delete the map: \n     " + this.mapNames[index].name)) {
          this.$http.delete("http://wb.lab-sse.cn/map/maps/id?mapId=" + this.mapNames[index].id,
            {
              emulateJSON: true
            }).then(function (response) {
            var len = this.folderPath.length;
            this.getMaps(this.folderPath[len - 1]);
          });
        }
      },
      mapRename: function (index, event) {
        var newMap = prompt("Input new map name:", this.mapNames[index].name);
        var len = this.folderPath.length;
        if (newMap != null && newMap != "") {
          this.$http.patch("http://wb.lab-sse.cn/map/maps/id",
            {
              emulateJSON: true,
              id: this.mapNames[index].id,
              name: newMap,
              folder: this.folderPath[len - 1],
              accoundId: this.accoundId
            }).then(function (response) {
            this.getMaps(this.folderPath[len - 1]);
          });
        }
      },

      /*拖拽事件*/
      fileMouseDown: function (type, index, event) {
        console.log("Mouse down type : " + type + " index: " + index);
        //设置选中属性
        this.draged.type = type;
        this.draged.index = index;
        this.draged.isdrag = true;

        //500ms后如果还是选中状态，则修改样式
        function changeStatus(outThis) {
          if (outThis.draged.isdrag == true && outThis.draged.type == type && outThis.draged.index == index) {
            //修改被选中模块的样式
            var eq = type == "folder" ? index : outThis.folderNames.length + index;
            $(".ibox").eq(eq).css("opacity", "0.5");

            //修改窗口鼠标形状
            $("body").css("cursor", "move");
            outThis.dragDiv.move = true;
          }
        }

        setTimeout(changeStatus, 500, this);

        //隐藏拖拽浮窗，只有移动超过5个像素点才会显示
        this.dragDiv.dragValue = type == "folder" ? this.folderNames[index].name : this.mapNames[index].name;
        this.dragDiv.dragLeft = -100;
        this.dragDiv.dragTop = -100;
      },
      fileMouseUp: function (index, event) {
        console.log("Mouse up on folder " + this.folderNames[index].name);
        if (this.draged.isdrag == true && (this.draged.type == "map" || this.draged.index != index)) {
          //清除拖拽属性
          this.clearDrop();

          //二次确认是否移入文件夹
          if (confirm("是否确定将 " + (this.draged.type == "folder" ? this.folderNames[this.draged.index].name : this.mapNames[this.draged.index].name) + " 移入" + this.folderNames[index].name)) {
            var len = this.folderPath.length;

            //修改目录
            if (this.draged.type == "map") {
              this.$http.patch("http://wb.lab-sse.cn/map/maps/id",
                {
                  emulateJSON: true,
                  id: this.mapNames[this.draged.index].id,
                  name: this.mapNames[this.draged.index].name,
                  folder: this.folderNames[index].id,
                  accoundId: this.accoundId
                }).then(function (response) {
                this.getMaps(this.folderPath[len - 1]);
              });
            }
            else if (this.draged.type == "folder") {
              this.$http.patch("http://wb.lab-sse.cn/folder/folders/id",
                {
                  emulateJSON: true,
                  id: this.folderNames[this.draged.index].id,
                  name: this.folderNames[this.draged.index].name,
                  upper_folder: this.folderNames[index].id,
                  accoundId: this.accoundId
                }).then(function (response) {
                this.getFolders(this.folderPath[len - 1]);
              });
            }
          }
        }
      },
      fileMouseEnter: function (index, event) {
        if (this.draged.isdrag == true) {
          $(".ibox").eq(index).css("border", "2px dotted");
          $(".ibox").eq(index).css("opacity", "0.7");
          $(".ibox").eq(index).find(".img-box").css("cursor", "default");
          $(".ibox").eq(index).find(".img-box").css("margin-top", "0");
          $(".ibox").eq(index).find(".delete").css("bottom", "0");
        }
        else {
          $(".op").eq(index).css("display","block");
          $(".ibox").eq(index).find(".img-box").css("margin-top", "-8px");
          $(".ibox").eq(index).find(".delete").css("bottom", "9px");
        }
      },
      fileMouseLeave: function (index, event) {
        if($(".op-list").css("display") == "none")$(".op").eq(index).css("display","none");
        $(".ibox").eq(index).css("border", "none");
        $(".ibox").eq(index).css("opacity", "1");
        $(".ibox").eq(index).find(".img-box").css("cursor", "pointer");
        $(".ibox").eq(index).find(".img-box").css("margin-top", "0");
        $(".ibox").eq(index).find(".delete").css("bottom", "0");
      },
      dragBack: function (event) {
        if (this.draged.isdrag == true) {
          console.log("move type " + this.draged.type + " index " + this.draged.index + " to upper folder");
          this.clearDrop();
          if (confirm("是否确定将 " + (this.draged.type == "folder" ? this.folderNames[this.draged.index].name : this.mapNames[this.draged.index].name) + " 移到父文件夹")) {
            var len = this.folderPath.length;
            var parentFolder = len <= 1 ? 0 : this.folderPath[len - 2];
            //修改目录
            if (this.draged.type == "map") {
              this.$http.patch("http://wb.lab-sse.cn/map/maps/id",
                {
                  emulateJSON: true,
                  id: this.mapNames[this.draged.index].id,
                  name: this.mapNames[this.draged.index].name,
                  folder: parentFolder,
                  accoundId: this.accoundId
                }).then(function (response) {
                this.getMaps(this.folderPath[len - 1]);
              });
            }
            else if (this.draged.type == "folder") {
              this.$http.patch("http://wb.lab-sse.cn/folder/folders/id",
                {
                  emulateJSON: true,
                  id: this.folderNames[this.draged.index].id,
                  name: this.folderNames[this.draged.index].name,
                  upper_folder: parentFolder,
                  accoundId: this.accoundId
                }).then(function (response) {
                this.getFolders(this.folderPath[len - 1]);
              });
            }
          }

        }
      },
      clearDrop: function () {
        //修改窗口鼠标样式
        $("body").css("cursor", "default");

        //取消拖拽属性
        this.draged.isdrag = false;
        this.dragDiv.move = false;

        $(".ibox").css("opacity", "1");
      },
      updatedragDivPos: function (e) {
        //更新拖拽浮窗位置
        if (this.draged.isdrag == true && this.dragDiv.move == true) {
          if (Math.abs(e.pageX - this.dragDiv.dragLeft) + Math.abs(e.pageY - this.dragDiv.dragTop) >= 10) {
            var sideLen = parseInt($(".navbar-default").css("width"));
            this.dragDiv.dragLeft = e.pageX - (sideLen > 100 ? sideLen : 0) + 5;
            this.dragDiv.dragTop = e.pageY + 5;
            //console.log(e.pageX + " " + e.pageY);
          }

        }
      },
      windowMouseMoveAndUp: function () {
        //清空拖拽属性，因为事件中没办法获取到this中的变量，所以先申明一遍
        var clear = this.clearDrop;

        //禁用文本选择功能
        function disableselect(e) {
          if (omitformtags.indexOf(e.target.tagName.toLowerCase()) == -1)
            return false
        }

        function reEnable() {
          return true
        }

        var omitformtags = ["input", "textarea", "select"];
        omitformtags = omitformtags.join("|");
        if (typeof document.onselectstart != "undefined")
          document.onselectstart = new Function("return false")
        else {
          document.onmousedown = disableselect
          document.onmouseup = reEnable
        }

        //禁止页面拖拽 & 自定义鼠标弹起事件
        document.ondragstart = function () {
          return false
        };

        //页面弹起事件
        document.onmouseup = function (e) {
          console.log("Window mouse UP");
          clear();
        };

        //页面移动事件
        var update = this.updatedragDivPos;
        document.onmousemove = function (e) {
          update(e);    //更新浮窗位置
        }
      },

      /*按钮事件*/
      back: function () {
        //返回上一级
        var len = this.folderPath.length;
        if (len > 1) {
          //更新目录
          var pathLen = this.folderPathName.length;
          this.folderPathName.splice(pathLen - 1);

          //获取内容
          this.folderPath.splice(len - 1);
          len = this.folderPath.length;
          this.getFolders(this.folderPath[len - 1]);
          this.getMaps(this.folderPath[len - 1]);
        }
      },
      changeShowType: function (event) {
        if (this.isList) {
          this.isList = false;

        } else {
          this.isList = true;
        }
      },

      /*文件操作列表事件*/
      opClick: function (index, event) {
        var wrapperLeft = $(".wrapper-content").offset().left;
        var wrapperTop = $(".wrapper-content").offset().top;
        var left = $(".ibox-folder").eq(index).offset().left;
        var top = $(".ibox-folder").eq(index).offset().top;
        $(".op-list").css("left", left - wrapperLeft + 152 + "px");
        $(".op-list").css("top", top + 40 + "px");
        $(".op").eq(index).css("display","block");
        $(".op-list").css("display","block");
        this.currentFolder = index;
      },
      hideOpList:function(evnent){
        $(".op").css("display","none");
        $(".op-list").css("display","none");
      },

      /*文件路径事件*/
      RootClick: function (event) {
        this.folderPathName = [];
        this.folderPath = [0];
        this.getFolders(0);
        this.getMaps(0);
      },
      pathClick: function (index, event) {
        var Len = this.folderPathName.length;

        //更新路径名
        for (var i = index + 1; i < Len; i++) {
          this.folderPathName.splice(i);
        }

        //更新路径ID
        for (var i = index + 2; i < Len + 1; i++) {
          this.folderPath.splice(i);
        }

        this.getFolders(this.folderPath[index + 1]);
        this.getMaps(this.folderPath[index + 1]);
      }
    },
    mounted(){
      //初始化文件夹和文件
      var len = this.folderPath.length;
      this.getFolders(this.folderPath[len - 1]);
      this.getMaps(this.folderPath[len - 1]);

      //初始化窗口鼠标事件
      this.windowMouseMoveAndUp();
    },
    updated(){
    }
  }
</script>

<style>

</style>
