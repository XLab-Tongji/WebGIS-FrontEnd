<template>
  <div id="wrapper">

    <!--顶部按钮条-->
    <div v-if="role == 'SUPER_ADMIN'" class="row btns white-bg ">
      <div class="col-lg-12 btn-content">
        <button type="button" class="btn btn-primary" id="showtoast" v-on:click="createMapInit" data-toggle="modal"
                data-target="#popup">创建地图
        </button>
        <button type="button" class="btn btn-white" id="cleartoasts" v-on:click="createFolderInit" data-toggle="modal"
                data-target="#popup">创建文件夹
        </button>
        <button type="button" class="btn btn-white" id="check-icon" v-on:click="checkIconClick($event)"></button>
        <button type="button" class="btn btn-white" id="back-btn" v-on:click="back"
                v-on:mouseup="dragBack($event)"></button>
        <button type="button" class="btn btn-white" v-bind:class="{list:!isList,thum:isList}" id="clearlasttoast"
                v-on:click="changeShowType"></button>
        <div class="path">
          <label></label>
          <ul>
            <li v-on:click="RootClick($event)"><label class="path-item">根 </label></li>
            <li v-on:click="pathClick(index,$event)" v-for="(item,index) in folderPathName">&nbsp;<span
              class='split'>/</span> <label class="path-item">{{ item }} </label></li>
          </ul>
        </div>
      </div>
    </div>

    <!--主体展示块-->
    <div class="wrapper-content animated fadeInRight  white-bg">
      <!--loading 部分-->
      <div class="loading" v-if="isLoading">
        <div class="sk-circle">
          <div class="sk-circle1 sk-child"></div>
          <div class="sk-circle2 sk-child"></div>
          <div class="sk-circle3 sk-child"></div>
          <div class="sk-circle4 sk-child"></div>
          <div class="sk-circle5 sk-child"></div>
          <div class="sk-circle6 sk-child"></div>
          <div class="sk-circle7 sk-child"></div>
          <div class="sk-circle8 sk-child"></div>
          <div class="sk-circle9 sk-child"></div>
          <div class="sk-circle10 sk-child"></div>
          <div class="sk-circle11 sk-child"></div>
          <div class="sk-circle12 sk-child"></div>
        </div>
      </div>

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
            <div v-if="role == 'SUPER_ADMIN'" class="op" v-on:click="opClick('folder',index,$event)" v-on:mouseenter="fileMouseEnter(index,$event)"
                 v-on:mouseleave="fileMouseLeave(index,$event)">
              <img class="op-icon" src="../assets/images/myMap/op-icon.png">
            </div>
          </div>
        </div>

        <!--文件-->
        <div class="ibox-div-map">
          <div class="ibox ibox-map" v-for="(mapName,index) in mapNames">
            <div class="img-box img-box-map" v-on:click="mapClick(index,$event)"
                 v-on:mousedown="fileMouseDown('map',index,$event) " v-on:mouseenter="mapMouseEnter(index,$event)"
                 v-on:mouseleave="mapMouseLeave(index,$event)">
              <img class="map-img" src="../assets/images/myMap/myMap.jpg">
            </div>
            <!--<label class="name" v-on:click="mapRename(index,$event)">{{ mapName.name }}</label>-->
            <label class="name">{{ mapName.name }}</label>
            <div class="checkBox-map" v-if="isCheck"><input type="checkbox"
                                                            v-on:click="checkBoxCLick('map',index,$event)"/></div>
            <div class="op-map" v-if="role == 'SUPER_ADMIN'" v-on:click="opClick('map',index,$event)" v-on:mouseenter="opMapMouseEnter(index,$event)"
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
            <td class="thead"><input v-if="isCheck" id="checkBoxAll" type="checkbox"
                                     v-on:click="checkBoxAllClick($event)"/></td>
            <td class="thead">文件名</td>
            <td class="thead">创建时间</td>
            <td class="thead">最近更新时间</td>
            <td class="thead">重命名</td>
            <td class="thead">删除</td>
          </tr>

          <!--文件夹-->
          <tr v-for="(folderName,index) in folderNames">
            <td class="tList listBox"></td>
            <td class="tList listName" v-on:click="folderClick(index,$event)"
                v-on:mousedown="fileMouseDown('folder',index,$event)" v-on:mouseup="fileMouseUp(index,$event)">
              <img class="folder-img-list" src="../assets/images/myMap/folder-icon.png"/>{{ folderName.name }}
            </td>
            <td class="tList listTime" v-on:click="folderClick(index,$event)">{{ folderName.create_time }}</td>
            <td class="tList listTime" v-on:click="folderClick(index,$event)">{{ folderName.update_time }}</td>
            <td class="tList listBtn">
              <div class="renameList" v-on:click="RenameList('folder',index,$event)" data-toggle="modal"
                   data-target="#popup"></div>
            </td>
            <td class="tList listBtn">
              <div class="deleteList" v-on:click="DeleteList('folder',index,$event)" data-toggle="modal"
                   data-target="#popup"></div>
            </td>
          </tr>

          <!--文件-->
          <tr v-for="(mapName,index) in mapNames">
            <td class="tList listBox">
              <div class="checkBox-map" v-if="isCheck"><input type="checkbox"
                                                              v-on:click="checkBoxCLick('map',index,$event)"/></div>
            </td>
            <td class="tList listName" v-on:click="mapClick(index,$event)"
                v-on:mousedown="fileMouseDown('map',index,$event)">
              <img class="map-img-list" src="../assets/images/myMap/map-icon.png"/>{{ mapName.name }}
            </td>
            <td class="tList listTime">{{ mapName.create_time }}</td>
            <td class="tList listTime">{{ mapName.update_time }}</td>
            <td class="tList listBtn">
              <div class="renameList" v-on:click="RenameList('map',index,$event)" data-toggle="modal"
                   data-target="#popup"/>
            </td>
            <td class="tList listBtn">
              <div class="deleteList" v-on:click="DeleteList('map',index,$event)" data-toggle="modal"
                   data-target="#popup"/>
            </td>
          </tr>
        </table>
      </div>


      <!--分页-->
      <div class="pages" v-if="role == 'SUPER_ADMIN'">
        <ul class="pagination">
          <li v-if="pages.isLeft" v-on:click="getMapsByPage(pages.currentPage - 1,$event)"><a>&laquo;</a></li>
          <li v-if="pages.pages.length > 1" v-bind:class="{pageChoosed:index == pages.currentPage}"
              v-for="(item,index) in pages.pages" v-on:click="getMapsByPage(index,$event)"><a>{{ item }}</a></li>
          <li v-if="pages.isRight" v-on:click="getMapsByPage(pages.currentPage + 1,$event)"><a>&raquo;</a></li>
        </ul>
      </div>
    </div>


    <!--拖拽浮窗-->
    <div id="dragDiv"
         v-bind:style="{ left: dragDiv.dragLeft + 'px', top: dragDiv.dragTop + 'px',display:draged.isdrag ? 'block' : 'none' }">
      <label>
        <pre>{{ dragDiv.dragValue }}</pre>
      </label>
    </div>

    <!--文件操作列表-->
    <ul class="op-list" v-on:mouseleave="hideOpList($event)">
      <li v-on:click="Rename($event)" data-toggle="modal" data-target="#popup"><img
        src="../assets/images/myMap/rename-icon.png"><label>重命名</label></li>
      <li v-on:click="Delete($event)" data-toggle="modal" data-target="#popup"><img
      src="../assets/images/myMap/delete-icon.png"><label>删除</label></li>
      <li v-on:click="MoveUpperFoler($event)" data-toggle="modal" data-target="#popup"><img
        src="../assets/images/myMap/movefolder-icon.png"><label>移至上层文件夹</label></li>
      <li v-on:click="getUsers()" v-if="currentFile.type == 'map'" data-toggle="modal" data-target="#manage-popup"><img
        src="../assets/images/myMap/manage-icon.png"><label>分配管理员</label></li>
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
            <input v-if="popup.type != 'delete'" class="form-control" v-model="popup.input"
                   v-bind:placeholder="popup.msg"/>
            <p v-if="popup.type == 'delete'">{{ popup.msg }}</p>
            <label>{{ popup.errorMsg }}</label>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">&nbsp;取消&nbsp;</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="popupConfirm($event)">&nbsp;确认&nbsp;</button>
          </div>
        </div>
      </div>
    </div>

    <!--分配管理员弹出框-->
    <div class="modal fade" id="manage-popup" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Manage User</h4>
          </div>
          <div class="modal-body user-body">
            <table id="user-table">
              <tr>
                <th class="list-name thead">Account</th>
                <th class="thead list-btns">Operator</th>
              </tr>
              <tr v-for="(assigneduser,index) in assignedUsers">
                <td class="list-name">{{ assigneduser.name }}</td>
                <td class="list-btns">
                  <button type="button" class="btn btn-danger" v-on:click="deleteUserFromMap(index)">Delete</button>
                </td>
              </tr>
              <tr v-for="(user,index) in allUsers">
                <td class="list-name">{{ user.name }}</td>
                <td class="list-btns">
                  <button type="button" class="btn btn-info " v-on:click="addUserToMap(index)">&nbsp;&nbsp;Add&nbsp;&nbsp; </button>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
  export default{
    name: "myWeb",
    data(){
      return {
        role:this.$store.state.session.role,
        accoundId: this.$store.state.session.userId,      //账户ID
        isList: false,    //查看类型，为True代表列表模式，否则为缩略图模式
        folderPath: [0],   //存储访问路径，最后一个元素代表当前所在文件夹ID，根目录为0
        folderPathName: [], //存储路径名称
        folderNames: [],   //当前文件夹中的所有文件夹信息
        mapNames: [],      //当前文件夹中的所有地图信息
        assignedUsers: [],
        allUsers: [],
        draged: {          //辅助拖拽功能
          isdrag: false,  //是否正在拖拽
          type: "",        //被拖拽的文件类型
          index: 0,         //最后被选中的文件序号
          mapIndex: [],        //被拖拽的文件序号
          folderIndex: []         //被拖拽的文件夹序号
        },
        dragDiv: {         //拖拽浮窗
          move: false,     //按下鼠标等待1s才能移动
          dragValue: "drag value",
          dragLeft: -100,
          dragTop: -100
        },
        currentFile: {     //当前选中的文件
          type: "folder",
          index: 0
        },
        pages: {           //分页信息
          currentPage: 0,
          isLeft: false,
          isRight: true,
          pages: [1],
          total: 20
        },
        popup: {         //弹出框相关信息
          type: "",
          title: "",
          msg: "",
          errorMsg: "",
          input: ""
        },
        isCheck: false,    //判断是否是批处理
        isLoading: true    //是否正在加载
      }
    },
    methods: {
      /*文件夹事件*/
      getFolders: function (ID) {
        this.isLoading = true;
        this.isCheck = false;
        this.draged.mapIndex = [];
        this.draged.folderIndex = [];
        //this.folderNames = [{name:"folder1"},{name:"folder2"}];   //模拟数据，仅用作测试
        this.$http.get(baseUrl + '/folder/folders/accountidandupperfolder?accountId=' + this.accoundId + '&upperFolder=' + ID,
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200) {
            this.folderNames = responseBody.data;

            //更改时间格式
            var len = this.folderNames.length;
            for (var i = 0; i < len; i++) {
              var time = new Date(this.folderNames[i].create_time);
              this.folderNames[i].create_time = time.getFullYear() + "-" + time.getMonth() + "-" + time.getDay() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
              time = new Date(this.folderNames[i].update_time);
              this.folderNames[i].update_time = time.getFullYear() + "-" + time.getMonth() + "-" + time.getDay() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
            }
          }
        });
        this.isLoading = false;
      },
      createFolderInit: function (event) {
        this.popup.type = "folder";
        this.popup.title = "Create Folder";
        this.popup.msg = "please input your folder name";
      },
      createFolder: function (name, parentFolder, event) {
        this.isLoading = true;
        this.$http.post(baseUrl + '/folder/folders',
          {
            "accountId": this.accoundId,
            "name": name,
            "upper_folder": parentFolder
          }
        ).then(function (response) {
          console.log("get a response after create a folder");
          var responseBody = response.body;
          if (responseBody.code === 200 && responseBody.message == "successful") {
            this.getFolders(parentFolder);    //更新界面
            this.msgResult("success", "Successful to create the folder " + name + "!")
          }
          else {
            this.msgResult("error", "Failed to create the folder " + name + "!")
          }
        });
        this.isLoading = false;
      },
      folderClick: function (index, event) {
        //console.log("Click the folder " + this.folderNames[index].name);
        //更新路径
        this.folderPathName.push(this.folderNames[index].name);
        this.pages.currentPage = 0;

        //把当前文件夹编号存入历史路径中
        var folderId = this.folderNames[index].id;
        this.folderPath.push(folderId);

        //获取内容
        this.getFolders(folderId);
        this.getMaps(folderId);
      },
      deleteFolder: function (index, event) {
        this.isLoading = true;
        this.$http.delete(baseUrl + "/folder/folders/id?folderId=" + this.folderNames[index].id,
          {
            emulateJSON: true
          }).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200 && responseBody.message == "successful") {
            console.log("delete folder " + this.folderNames[index].id + " successful");
            this.getFolders(this.folderPath[this.folderPath.length - 1]);
            this.msgResult("success", "Successful to delete the folder " + this.folderNames[index].name + "!")
          }
          else {
            this.msgResult("error", "Failed to delete the folder " + this.folderNames[index].name + "!")
          }
        });
        this.isLoading = false;
      },
      folderRename: function (name, event) {
        this.isLoading = true;
        this.$http.patch(baseUrl + "/folder/folders/id",
          {
            emulateJSON: true,
            id: this.folderNames[this.currentFile.index].id,
            name: name,
            upper_folder: this.folderPath[this.folderPath.length - 1],
            accoundId: this.accoundId
          }).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200 && responseBody.message == "successful") {
            console.log("rename folder " + name + " successful");
            this.getFolders(this.folderPath[this.folderPath.length - 1]);
            this.msgResult("success", "Successful to rename the folder " + name + "!")
          }
          else {
            this.msgResult("error", "Failed to rename the folder " + name + "!")
          }
        });
        this.isLoading = false;
      },
      moveFolder: function (folderId, folderName, event) {
        this.isLoading = true;
        this.isCheck = false;
        if (folderName == "")folderName = "parent folder";
        //拖拽文件夹
        var names = []
        for (var i = 0; i < this.draged.folderIndex.length; i++) {
          names.push(this.folderNames[this.draged.folderIndex[i]].name);
          this.$http.patch(baseUrl + "/folder/folders/id",
            {
              emulateJSON: true,
              id: this.folderNames[this.draged.folderIndex[i]].id,
              name: this.folderNames[this.draged.folderIndex[i]].name,
              upper_folder: folderId,
              accoundId: this.accoundId
            }).then(function (response) {
            console.log(response);
            var responseBody = response.body;
            if (responseBody.code === 200 && responseBody.message == "successful") {
              this.getFolders(this.folderPath[this.folderPath.length - 1]);
              this.msgResult("success", "Successful to move the folder " + names[0] + " to " + folderName + "!");
            }
            else {
              this.msgResult("error", "Failed to move the folder " + names[0] + " to " + folderName + "!");
            }
            names.splice(0, 1);
          });
        }

        //清空选中列表
        this.draged.folderIndex = [];

        this.isLoading = false;
      },

      /*地图事件*/
      getMaps: function (ID, event) {
        this.isCheck = false;
        this.draged.mapIndex = [];
        this.draged.folderIndex = [];
        this.getMapsByPage(this.pages.currentPage, event);
        //this.mapNames = [{name:"map1"},{name:"map2"}];  //模拟数据，仅用作测试
      },
      createMapInit: function (event) {
        this.popup.type = "map";
        this.popup.title = "Create Map";
        this.popup.msg = "please input your map name";
      },
      createMap: function (name, parentFolder, event) {
        this.isLoading = true;
        this.$http.post(baseUrl + '/map/maps',
          {
            "accountId": this.accoundId,
            "name": name,
            "folder": parentFolder
          }
        ).then(function (response) {
          console.log("get a response after create a map");
          var responseBody = response.body;
          if (responseBody.code === 200 && responseBody.message == "successful") {
            this.getMaps(parentFolder);    //更新界面
            this.msgResult("success", "Successful to create the map " + name + "!")
          }
          else {
            this.msgResult("error", "Failed to create the map " + name + "!")
          }
        });
        this.isLoading = false;
      },
      mapClick: function (index, event) {
        this.$router.push({name: 'google', params: {mapId: this.mapNames[index].id}});
//        alert("you click the " + this.mapNames[index].name + this.mapNames[index].id);
      },
      mapRename: function (name, event) {
        this.isLoading = true;
        this.$http.patch(baseUrl + "/map/maps/id",
          {
            emulateJSON: true,
            id: this.mapNames[this.currentFile.index].id,
            name: name,
            folder: this.folderPath[this.folderPath.length - 1],
            accoundId: this.accoundId
          }).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200 && responseBody.message == "successful") {
            this.getMaps(this.folderPath[this.folderPath.length - 1]);
            this.msgResult("success", "Successful to rename the map " + name + "!")
          }
          else {
            this.msgResult("error", "Failed to rename the map " + name + "!")
          }
        });
        this.isLoading = false;
      },
      mapUpperFolder: function (event) {
        this.isLoading = true;
        let folderIndex = this.folderPath.length - 2;
        if(folderIndex<0) folderIndex=0;
        this.$http.patch(baseUrl + "/map/maps/id",
          {
            emulateJSON: true,
            id: this.mapNames[this.currentFile.index].id,
            name: this.mapNames[this.currentFile.index].name,
            folder: this.folderPath[folderIndex],
            accoundId: this.accoundId
          }).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200 && responseBody.message == "successful") {
            this.getMaps(this.folderPath[this.folderPath.length - 1]);
            this.msgResult("success", "Successful move the map " + name + "!")
          }
          else {
            this.msgResult("error", "Failed to move the map " + name + "!")
          }
        });
        this.isLoading = false;
      },
      deleteMap: function (index, event) {
        this.isLoading = true;
//        this.$http.delete(baseUrl + "/map/maps/id?mapId=" + this.mapNames[index].id,
        this.$http.post(baseUrl + "/recycle/recycles/" + this.mapNames[index].id,
          {
            emulateJSON: true
          }).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200 && responseBody.message == "successful") {
            var len = this.folderPath.length;
            this.getMaps(this.folderPath[len - 1]);
            this.msgResult("success", "Successful to delete the map " + this.mapNames[index].name + "!")
          }
          else {
            this.msgResult("error", "Failed to delete the map " + this.mapNames[index].name + "!")
          }
        });
        this.isLoading = false;
      },
      mapMouseEnter: function (index, event) {
        $(".op-map").eq(index).css("display", "block");
        $(".img-box-map").eq(index).css("margin-top", "-8px");
      },
      mapMouseLeave: function (index, event) {
        $(".op-map").eq(index).css("display", "none");
        $(".img-box-map").eq(index).css("margin-top", "0px");
      },
      moveMap: function (folderId, folderName, event) {
        this.isLoading = true;
        this.isCheck = false;
        if (folderName == "")folderName = "parent folder";
        //拖拽文件
        var names = []
        for (var i = 0; i < this.draged.mapIndex.length; i++) {
          names.push(this.mapNames[this.draged.mapIndex[i]].name);
          this.$http.patch(baseUrl + "/map/maps/id",
            {
              emulateJSON: true,
              id: this.mapNames[this.draged.mapIndex[i]].id,
              name: this.mapNames[this.draged.mapIndex[i]].name,
              folder: folderId,
              accoundId: this.accoundId
            }).then(function (response) {
            var responseBody = response.body;
            if (responseBody.code === 200 && responseBody.message == "successful") {
              this.getMaps(this.folderPath[this.folderPath.length - 1]);
              this.msgResult("success", "Successful to move the map " + names[0] + " to " + folderName + "!");
            }
            else {
              this.msgResult("error", "Failed to move the map " + names[0] + " to " + folderName + "!");
            }
            names.splice(0, 1);
          });

        }
        //清空选中列表
        this.draged.mapIndex = [];
        this.isLoading = false;
      },

      /*拖拽事件*/
      fileMouseDown: function (type, index, event) {
        console.log("Mouse down type : " + type + " index: " + index);
        //设置选中属性
        this.draged.type = type;
        this.draged.index = index;
        if (type == "folder" && this.draged.folderIndex.indexOf(index) == -1)this.draged.folderIndex.push(index);
        else if (type == "map" && this.draged.mapIndex.indexOf(index) == -1)this.draged.mapIndex.push(index);
        this.draged.isdrag = true;

        //500ms后如果还是选中状态，则修改样式
        function changeStatus(outThis) {
          if (outThis.draged.isdrag == true && outThis.draged.type == type && outThis.draged.index == index) {
            //修改被选中模块的样式
            for (var i = 0; i < outThis.draged.folderIndex.length; i++) {
              $(".ibox").eq(outThis.draged.folderIndex[i]).css("opacity", "0.5");
            }
            for (var i = 0; i < outThis.draged.mapIndex.length; i++) {
              $(".ibox").eq(outThis.folderNames.length + outThis.draged.mapIndex[i]).css("opacity", "0.5");
            }

            //修改窗口鼠标形状
            $("body").css("cursor", "move");
            outThis.dragDiv.move = true;
          }
        }

        setTimeout(changeStatus, 200, this);

        //隐藏拖拽浮窗，只有移动超过5个像素点才会显示
        var msg = "";
        for (var i = 0; i < this.draged.folderIndex.length; i++) {
          msg += "<" + this.folderNames[this.draged.folderIndex[i]].name + ">";
          if (i != this.draged.folderIndex.length - 1)msg += ",";
        }
        if (this.draged.folderIndex.length > 0)msg += "\n"
        for (var i = 0; i < this.draged.mapIndex.length; i++) {
          msg += this.mapNames[this.draged.mapIndex[i]].name;
          if (i != this.draged.mapIndex.length - 1)msg += ",";
        }
        console.log(msg);
        this.dragDiv.dragValue = msg;
        this.dragDiv.dragLeft = -100;
        this.dragDiv.dragTop = -100;
      },
      fileMouseUp: function (index, event) {
        console.log("Mouse up on folder " + this.folderNames[index].name);
        if (this.draged.isdrag == true && (this.draged.type == "map" || this.draged.index != index)) {
          //修改目录
          this.moveMap(this.folderNames[index].id, this.folderNames[index].name, event);
          this.moveFolder(this.folderNames[index].id, this.folderNames[index].name, event);
        }
        //清除拖拽属性
        this.clearDrop();
      },
      fileMouseEnter: function (index, event) {
        if (this.draged.isdrag == true) {
          if (this.draged.type == "folder" && this.draged.index == index)return;
          $(".ibox").eq(index).css("border", "2px dotted");
          $(".ibox").eq(index).css("opacity", "0.7");
          $(".ibox").eq(index).find(".img-box").css("cursor", "default");
          $(".ibox").eq(index).find(".img-box").css("margin-top", "0");
          $(".ibox").eq(index).find(".delete").css("bottom", "0");
        }
        else if ($(".op-list").css("display") == "none") {
          $(".op").eq(index).css("display", "block");
          $(".ibox").eq(index).find(".img-box").css("margin-top", "-8px");
          $(".ibox").eq(index).find(".delete").css("bottom", "9px");
        }
      },
      fileMouseLeave: function (index, event) {
        if (this.draged.isDrag == true && this.draged.type == "folder" && this.draged.index == index)return;
        if ($(".op-list").css("display") == "none")$(".op").eq(index).css("display", "none");
        $(".ibox").eq(index).css("border", "none");
        $(".ibox").eq(index).css("opacity", "1");
        $(".ibox").eq(index).find(".img-box").css("cursor", "pointer");
        $(".ibox").eq(index).find(".img-box").css("margin-top", "0");
        $(".ibox").eq(index).find(".delete").css("bottom", "0");
      },
      dragBack: function (event) {
        if (this.draged.isdrag == true) {
          //修改目录
          var len = this.folderPath.length;
          var parentFolder = len <= 1 ? 0 : this.folderPath[len - 2];
          this.moveMap(parentFolder, "", event);
          this.moveFolder(parentFolder, "", event);
        }
        this.clearDrop();
      },
      clearDrop: function () {
        //修改窗口鼠标样式
        $("body").css("cursor", "default");

        //取消拖拽属性
        this.draged.isdrag = false;
        this.draged.index = 0;
        this.dragDiv.move = false;

        //重新计算被选中文件
        this.draged.mapIndex = [];
        this.draged.folderIndex = [];
        var mapBoxes = $(".checkBox-map input");
        for (var i = 0; i < mapBoxes.length; i++) {
          if (mapBoxes.eq(i).is(':checked')) {
            this.draged.mapIndex.push(i);
          }
        }
        /*var folderBoxes = $(".checkBox-folder input");
         for(var i = 0;i < folderBoxes.length;i++){
         if(folderBoxes.eq(i).is(':checked')){
         this.draged.folderIndex.push(i);
         }
         }*/

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

          this.pages.currentPage = 0;
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
          $(".op-list").css("top", top + 12 + "px");
        }
        this.currentFile.index = index;
        this.currentFile.type = type;
        $(".op-list").css("left", left - wrapperLeft + 127 + "px");
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
      Rename: function (event) {
        this.popup.type = "rename";
        this.popup.title = "Rename";
        this.popup.msg = "please input the new name";
      },
      Delete: function (event) {
        this.popup.type = "delete";
        this.popup.title = "Delete";
        var name = this.currentFile.type == "folder" ? this.folderNames[this.currentFile.index].name : this.mapNames[this.currentFile.index].name;
        this.popup.msg = "Do you really want to delete the " + name;
      },
      MoveUpperFoler: function (event) {
        this.popup.type = "moveUpperFolder";
        this.popup.title = "MoveUpperFolder";
        var name = this.mapNames[this.currentFile.index].name;
        this.popup.msg = "Do you really want to move the " + name+" to upper folder?";
      },
      RenameList: function (type, index, event) {
        this.currentFile.type = type;
        this.currentFile.index = index;
        this.popup.type = "rename";
        this.popup.title = "Rename";
        this.popup.msg = "please input the new name";
      },
      DeleteList: function (type, index, event) {
        this.currentFile.type = type;
        this.currentFile.index = index;
        this.popup.type = "delete";
        this.popup.title = "Delete";
        var name = this.currentFile.type == "folder" ? this.folderNames[this.currentFile.index].name : this.mapNames[this.currentFile.index].name;
        this.popup.msg = "Do you really want to delete the " + name;
      },

      /*批处理事件*/
      checkIconClick: function (event) {
        this.isCheck = this.isCheck == true ? false : true;
        this.draged.mapIndex = [];
        this.draged.folderIndex = [];
      },
      checkBoxCLick: function (type, index, event) {
        if (type == "map") {
          if (this.draged.mapIndex.indexOf(index) == -1)this.draged.mapIndex.push(index);
          else this.draged.mapIndex.splice(this.draged.mapIndex.indexOf(index), 1);
        }
      },
      checkBoxAllClick: function (event) {
        if ($("#checkBoxAll").is(':checked')) {
          $(".checkBox-map input").attr("checked", "true");
          this.clearDrop();
        }
        else {
          $(".checkBox-map input").prop("checked", function () {
            return false;
          });
          this.clearDrop();
        }
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
      },

      /*分页事件*/
      getMapsByPage: function (index, event) {
        this.isLoading = true;
        this.isCheck = false;
        this.draged.mapIndex = [];
        this.draged.folderIndex = [];

        //计算实际页数和父文件夹ID
        var page = this.pages.pages.length > index ? this.pages.pages[index] : 1;
        var folderId = this.folderPath.length > 0 ? this.folderPath[this.folderPath.length - 1] : 0;

        //访问后端获取地图数据
        var url = "";
        if(this.role == "SUPER_ADMIN")url = baseUrl + '/map/maps/accountidandfolderidandpageid?accountId=' + this.accoundId + '&folderId=' + folderId + '&pageId=' + page;
        else url = baseUrl + '/map/maps/admin?adminId=' + this.accoundId;
        console.log(url);
        this.$http.get(url,
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body
          if (responseBody.code === 200) {
            console.log(response);
            if(this.role == "SUPER_ADMIN")this.mapNames = responseBody.data.map;
            else this.mapNames = responseBody.data;
            if (this.mapNames.length == 0 && page > 1)this.getMapsByPage(index - 1, event);
            this.pages.total = responseBody.data.pageNum;

            //更改时间格式
            var len = this.mapNames.length;
            for (var i = 0; i < len; i++) {
              var time = new Date(this.mapNames[i].create_time);
              this.mapNames[i].create_time = time.getFullYear() + "-" + time.getMonth() + "-" + time.getDay() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
              time = new Date(this.mapNames[i].update_time);
              this.mapNames[i].update_time = time.getFullYear() + "-" + time.getMonth() + "-" + time.getDay() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
            }

            //如果页面总数小于等于1，则格式化pages属性
            if (this.pages.total <= 1) {
              this.pages.pages = [1];
              this.pages.isRight = false;
              this.pages.isLeft = false;
              return;
            }

            //更新当前被选中页
            this.pages.currentPage = index;

            //如果选中的是第一页，要么更新目录结构，要么取消左箭头
            if (index == 0) {
              if (this.pages.pages[0] == 1)this.pages.isLeft = false;
              else this.pages.isLeft = true;

              //更新目录结构
              var begin = page - 5 > 0 ? page - 5 : 1;        //分页栏起始页面
              var end = 9 + begin > this.pages.total ? this.pages.total : 9 + begin;  //分页栏结束页面
              this.pages.currentPage = page - begin
              this.pages.pages = [];
              for (var i = begin; i <= end; i++) {
                this.pages.pages.push(i);
              }
            }
            else {
              this.pages.isLeft = true;
            }

            //如果选中的是最后一页，要么更新目录结构，要么取消右箭头
            var len = this.pages.pages.length;
            if (index + 1 == len) {
              if (this.pages.pages[len - 1] == this.pages.total) this.pages.isRight = false;
              else this.pages.isRight = true;

              //更新目录结构
              var end = page + 4 > this.pages.total ? this.pages.total : page + 4; //分页栏结束页面
              var begin = end - 9 > 0 ? end - 9 : 1;        //分页栏起始页面
              this.pages.currentPage = page - begin
              this.pages.pages = [];
              for (var i = begin; i <= end; i++) {
                this.pages.pages.push(i);
              }

            }
            else {
              this.pages.isRight = true;
            }

          }
        });
        this.isLoading = false;
      },

      /*弹出框*/
      popupConfirm: function (event) {

        var name = this.popup.input;                    //用户输入信息
        var len = this.folderPath.length;               //文件路径长度
        var parentFolder = this.folderPath[len - 1];

        //创建地图文件
        if (this.popup.type == "map" && name != null && name != "") {
          this.createMap(name, parentFolder, event);
        }

        //创建文件夹
        else if (this.popup.type == "folder" && name != null && name != "") {
          this.createFolder(name, parentFolder, event);
        }

        //重命名
        else if (this.popup.type == "rename") {
          if (this.currentFile.type == "folder" && name != null && name != "") {
            this.folderRename(name, event);
          }
          else if (this.currentFile.type == "map" && name != null && name != "") {
            this.mapRename(name, event);
          }
        }

        //移动文件
        else if (this.popup.type === "moveUpperFolder") {
//          if (this.currentFile.type == "folder" && name != null && name != "") {
//            this.folderRename(name, event);
//          }
//          else if (this.currentFile.type == "map" && name != null && name != "") {
//            this.mapRename(name, event);
//          }
          if (this.currentFile.type === "map") {
            this.mapUpperFolder(event);
          }
        }

        //删除
        else if (this.popup.type == "delete") {
          if (this.currentFile.type == "folder") {
            this.deleteFolder(this.currentFile.index, event);
          }
          else if (this.currentFile.type == "map") {
            this.deleteMap(this.currentFile.index, event);
          }
        }

        this.popup.input = "";
      },
      msgResult: function (type, msg, event) {
        toastr.options = {
          closeButton: true,
          progressBar: true,
          showMethod: 'slideDown',
          timeOut: 4000
        };
        if (type == "success")toastr.success(msg);
        else if (type == "error")toastr.error(msg);
        else if (type == "info")toastr.info(msg);
      },

      /*分配管理员*/
      removeDuplicateInUsers(id){
        for(var i = 0; i < this.allUsers.length;i++){
          if(this.allUsers[i].id == id){
            this.allUsers.splice(i,1);
            break;
          }
        }
      },
      getMapUsers: function () {
        var self = this;
        this.$http.get(baseUrl + '/account/accounts/map?mapId=' + this.mapNames[this.currentFile.index].id,
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200) {
            self.assignedUsers = [];
            for (var i = 0; i < responseBody.data.length; i++) {
              var item = responseBody.data[i];
              this.removeDuplicateInUsers(item.id);
              self.assignedUsers.push({name:item.name,id:item.id});
            }
          }
          else if (responseBody.code == 500) {
            toastr.error("您不是超级管理员，无权进行任何操作！");
          }
          else toastr.error("未知错误！");
        });
      },
      getUsers: function () {
        var self = this;
        this.$http.get(baseUrl + '/account/accounts/admin?superAdminId=' + this.accoundId,
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200) {
            self.allUsers = [];
            for (var i = 0; i < responseBody.data.length; i++) {
              var item = responseBody.data[i];
              self.allUsers.push({name:item.name,id:item.id});
            }
            this.getMapUsers();
          }
          else if (responseBody.code == 500) {
            toastr.error("您不是超级管理员，无权进行任何操作！");
          }
          else toastr.error("未知错误！");
        });

      },
      deleteUserFromMap: function (index) {
        var self = this;
        this.$http.delete(baseUrl + '/account/accounts/map?mapId=' + this.mapNames[this.currentFile.index].id + '&adminId=' + this.assignedUsers[index].id,
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200) {
            toastr.success("移除管理员成功！");
            this.getUsers();
          }
          else if (responseBody.code == 500) {
            toastr.error("管理员不管理该地图！");
          }
          else toastr.error("未知错误！");
        });
      },
      addUserToMap: function (index) {
        var self = this;
        this.$http.post(baseUrl + '/account/accounts/map?mapId=' + this.mapNames[this.currentFile.index].id + '&adminId=' + this.allUsers[index].id,
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body;
          if (responseBody.code === 200) {
            toastr.success("分配管理员成功！");
            this.getUsers();
          }
          else if (responseBody.code == 500) {
            toastr.error("管理员已经管理该地图了！");
          }
          else toastr.error("未知错误！");
        });
      }
    },
    mounted(){

      //初始化文件夹和文件
      var len = this.folderPath.length;
      this.getFolders(this.folderPath[len - 1]);
      this.getMaps(this.folderPath[len - 1]);
      //初始化窗口鼠标事件
      this.windowMouseMoveAndUp();

      //欢迎
      this.msgResult("info", "Welcome to my map page!")
      console.log(this.accountId)
    },
    updated(){
    }
  }
</script>

<style>
  /*用户表格*/
  .user-body {
    max-height: 500px;
    overflow-y: scroll;
    padding: 10px 15px 5px 15px;
  }

  #user-table {
    width: 100%;
  }

  #user-table td {
    height: 35px;
  }

  #user-table tr:hover {
    background: rgba(0, 0, 0, 0.1);
    font-weight: 700;
    color: white;
  }

  .list-name {
    width: 80%;
    padding-left: 10px;
  }

  .list-btns {
    text-align: center;
  }

  .list-btns button {
    padding: 1px 6px 1px 6px;
  }
</style>
