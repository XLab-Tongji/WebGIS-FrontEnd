<template>
<div id="wrapper">

		<div class="row btns white-bg ">
			<div class="col-lg-12 btn-content">
			  <button type="button" class="btn btn-primary" id="showtoast" v-on:click="createMap">Create Map</button>
			  <button type="button" class="btn btn-white" id="cleartoasts" v-on:click="createFolder">Create Folder</button>
        <button type="button" class="btn btn-white" id="back-btn" v-on:click="back"></button>
			  <button type="button" class="btn btn-white" v-bind:class="{list:!isList,thum:isList}" id="clearlasttoast" v-on:click="changeShowType"></button>
			</div>
		</div>

    <div class="wrapper-content animated fadeInRight  white-bg" >

      <!--缩略图模式-->
      <div class="row" v-if="!isList">
        <!--文件夹-->
        <div class="ibox" v-for="(folderName,index) in folderNames" >
          <div class="img-box" v-on:click="folderClick(index,$event)">
            <img class = "folder-img" src="../assets/images/myMap/folder.png">
          </div>
          <div class = "delete" v-on:click="deleteFolder(index,$event)" />
          <label class="name" title="单机修改名称" v-on:click="folderRename(index,$event)">{{ folderName.name }}</label>
        </div>

        <!--文件-->
        <div class="ibox" v-for="(mapName,index) in mapNames" >
          <div class="img-box" v-on:click="mapClick(index,$event)">
            <img class = "map-img" src="../assets/images/myMap/myMap.jpg">
          </div>
          <div class = "delete" v-on:click="deleteMap(index,$event)" />
          <label class="name" v-on:click="mapRename(index,$event)">{{ mapName.name }}</label>
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
            <td class="tList listName"  v-on:click="folderClick(index,$event)">{{ folderName.name }}</td>
            <td class="tList">文件夹</td>
            <td class="tList">{{ folderName.create_time }}</td>
            <td class="tList">{{ folderName.update_time }}</td>
            <td class="tList"><div class = "renameList" v-on:click="folderRename(index,$event)" /></td>
            <td class="tList"><div class = "deleteList" v-on:click="deleteFolder(index,$event)" /></td>
          </tr>

          <!--文件-->
          <tr v-for="(mapName,index) in mapNames">
            <td class="tList listName" v-on:click="mapClick(index,$event)">{{ mapName.name }}</td>
            <td class="tList">地图</td>
            <td class="tList">{{ mapName.create_time }}</td>
            <td class="tList">{{ mapName.update_time }}</td>
            <td class="tList"><div class = "renameList" v-on:click="mapRename(index,$event)" /></td>
            <td class="tList"><div class = "deleteList" v-on:click="deleteMap(index,$event)" /></td>
          </tr>
        </table>

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
        folderNames:[],
        mapNames:[]
      }
    },
    methods:{
      getFolders:function(ID){
        this.$http.get('http://wb.lab-sse.cn/folder/folders/accountidandupperfolder?accountId=1&upperFolder='+ID ,
          {
            emulateJSON: true
          }
        ).then(function (response){
          var responseBody = response.body
          if (responseBody.code === 200) {
            this.folderNames= responseBody.data;
          }
        });
      },
      createFolder:function(event){
        //弹出对话框并获取文件夹名
        var newIndex = this.folderNames.length + 1;
        var newFolder = prompt("Input your folder name:","folder" + newIndex);

        //获取创建文件夹的父文件夹编号
        var len = this.folderPath.length;
        var parentFolder = this.folderPath[len - 1];

        //如果文件夹名符合规范，则向后端请求创建文件夹
        if(newFolder != null && newFolder != ""){
          console.log("try to create a new folder");
          this.$http.post('http://wb.lab-sse.cn/folder/folders' ,
            {
              "accountId":this.accoundId,
              "name":newFolder,
              "upper_folder":parentFolder
            }
          ).then(function(response){
            console.log("get a response after create a folder");
            var responseBody = response.body;
            if (responseBody.code === 200 && responseBody.message == "successful") {
              this.getFolders(parentFolder);    //更新界面
            }
            else{
              alert("Fail to create a new folder!");
            }
          });
        }
      },
      folderClick:function (index,event) {
        //把当前文件夹编号存入历史路径中
        var folderId = this.folderNames[index].id;
        this.folderPath.push(folderId);
        this.getFolders(folderId);
        this.getMaps(folderId);
      },
      deleteFolder:function(index,event){
        if(confirm("Do you really want to delete the folder: \n     " + this.folderNames[index].name)) {
          this.$http.delete("http://wb.lab-sse.cn/folder/folders/id?folderId=" + this.folderNames[index].id,
            {
              emulateJSON: true
            }).then(function(response){
              console.log("delete folder " + this.folderNames[index].id + "successful");
              var len = this.folderPath.length;
              this.getFolders(this.folderPath[len - 1]);
          });
        }
      },
      folderRename:function(index,event){
        var newFolder = prompt("Input new folder name:",this.folderNames[index].name);
        var len = this.folderPath.length;
        if(newFolder != null && newFolder != ""){
          this.$http.patch("http://wb.lab-sse.cn/folder/folders/id",
            {
              emulateJSON: true,
              id:this.folderNames[index].id,
              name:newFolder,
              upper_folder:this.folderPath[len - 1],
              accoundId:this.accoundId
            }).then(function(response){
              this.getFolders(this.folderPath[len - 1]);
          });
        }
      },
      getMaps:function(ID){
        this.$http.get('http://wb.lab-sse.cn/map/maps/accountidandfolderid?accountId=1&folderId='+ ID ,
          {
            emulateJSON: true
          }
        ).then(function (response){
          var responseBody = response.body
          if (responseBody.code === 200) {
            this.mapNames= responseBody.data;
          }
        });
      },
      createMap:function(event){
        //弹出对话框并获取地图名
        var newIndex = this.mapNames.length + 1;
        var newMap = prompt("Input your map name:","map" + newIndex);

        //获取创建地图的父文件夹编号
        var len = this.folderPath.length;
        var parentFolder = this.folderPath[len - 1];

        //如果地图名符合规范，则向后端请求创建文件夹
        if(newMap != null && newMap != ""){
          console.log("try to create a new map");
          this.$http.post('http://wb.lab-sse.cn/map/maps' ,
            {
              "accountId":this.accoundId,
              "name":newMap,
              "folder":parentFolder
            }
          ).then(function(response){
            console.log("get a response after create a map");
            var responseBody = response.body;
            if (responseBody.code === 200 && responseBody.message == "successful") {
              this.getMaps(parentFolder);    //更新界面
            }
            else{
              alert("Fail to create a new map!");
            }
          });
        }
      },
      mapClick:function(index,event){
        alert("you click the " + this.mapNames[index].name);
      },
      deleteMap:function(index,event){
        if(confirm("Do you really want to delete the map: \n     " + this.mapNames[index].name)) {
          this.$http.delete("http://wb.lab-sse.cn/map/maps/id?mapId=" + this.mapNames[index].id,
            {
              emulateJSON: true
            }).then(function(response){
            var len = this.folderPath.length;
            this.getMaps(this.folderPath[len - 1]);
          });
        }
      },
      mapRename:function(index,event){
        var newMap = prompt("Input new map name:",this.mapNames[index].name);
        var len = this.folderPath.length;
        if(newMap != null && newMap != ""){
          this.$http.patch("http://wb.lab-sse.cn/map/maps/id",
            {
              emulateJSON: true,
              id:this.mapNames[index].id,
              name:newMap,
              folder:this.folderPath[len - 1],
              accoundId:this.accoundId
            }).then(function(response){
            this.getMaps(this.folderPath[len - 1]);
          });
        }
      },
      back:function(){
        var len = this.folderPath.length;
        if(len > 1){
          this.folderPath.splice(len - 1);
          len = this.folderPath.length;
          this.getFolders(this.folderPath[len - 1]);
          this.getMaps(this.folderPath[len - 1]);
        }
      },
      changeShowType:function(event){
        if(this.isList){
          this.isList = false;

        }else{
          this.isList = true;
        }
      }
    },
    mounted(){
      var len = this.folderPath.length;
      this.getFolders(this.folderPath[len - 1]);

      var len = this.folderPath.length;
      this.getMaps(this.folderPath[len - 1]);
    }
  }
</script>

<style>

</style>
