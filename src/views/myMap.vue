<template>
<div id="wrapper">

		<div class="row btns white-bg ">
			<div class="col-lg-12 btn-content">
			  <button type="button" class="btn btn-primary" id="showtoast" v-on:click="createMap">Create Map</button>
			  <button type="button" class="btn btn-white" id="cleartoasts" v-on:click="createFolder">Create Folder</button>
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
          <label class="name" title="单机修改名称" v-on:click="folderRename(index,$event)">{{ folderName }}</label>
        </div>

        <!--文件-->
        <div class="ibox" v-for="(mapName,index) in mapNames" >
          <div class="img-box" v-on:click="mapClick(index,$event)">
            <img class = "map-img" src="../assets/images/myMap/myMap.jpg">
          </div>
          <div class = "delete" v-on:click="deleteMap(index,$event)" />
          <label class="name" v-on:click="mapRename(index,$event)">{{ mapName }}</label>
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
            <td class="tList listName"  v-on:click="folderClick(index,$event)">{{ folderName }}</td>
            <td class="tList">文件夹</td>
            <td class="tList">2016-12-30 16:44:28</td>
            <td class="tList">2016-12-30 16:44:28</td>
            <td class="tList"><div class = "renameList" v-on:click="folderRename(index,$event)" /></td>
            <td class="tList"><div class = "deleteList" v-on:click="deleteFolder(index,$event)" /></td>
          </tr>

          <!--文件-->
          <tr v-for="(mapName,index) in mapNames">
            <td class="tList listName" v-on:click="mapClick(index,$event)">{{ mapName }}</td>
            <td class="tList">地图</td>
            <td class="tList">2016-12-30 16:44:28</td>
            <td class="tList">2016-12-30 16:44:28</td>
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
        isList:false,
        folderNames:['folder1'],
        mapNames:['map1','map2','map3','map4','map5','map6']
      }
    },
    methods:{
      createFolder:function(event){
        var newIndex = this.folderNames.length + 1;
        var newFolder = prompt("Input your folder name:","folder" + newIndex);
        if(newFolder != null && newFolder != "")this.folderNames.push(newFolder);
      },
      folderClick:function (index,event) {
        alert("you click the " + this.folderNames[index]);
      },
      deleteFolder:function(index,event){
        if(confirm("Do you really want to delete the folder: \n     " + this.folderNames[index])) {
          this.folderNames.splice(index, 1);
        }
      },
      folderRename:function(index,event){
        var newFolder = prompt("Input new folder name:",this.folderNames[index]);
        if(newFolder != null && newFolder != ""){
          this.folderNames.splice(index,1,newFolder);
        }
      },
      createMap:function(event){
        var newIndex = this.mapNames.length + 1;
        var newMap = prompt("Input your map name:","map" + newIndex);
        if(newMap != null && newMap != "")this.mapNames.push(newMap);
      },
      mapClick:function(index,event){
        alert("you click the " + this.mapNames[index]);
      },
      deleteMap:function(index,event){
        if(confirm("Do you really want to delete the map: \n     " + this.mapNames[index])) {
          this.mapNames.splice(index, 1);
        }
      },
      mapRename:function(index,event){
        var newMap = prompt("Input new map name:",this.mapNames[index]);
        if(newMap != null && newMap != ""){
          this.mapNames.splice(index,1,newMap);
        }
      },
      changeShowType:function(event){
        if(this.isList){
          this.isList = false;

        }else{
          this.isList = true;
        }
      }
    }
  }
</script>

<style>

</style>
