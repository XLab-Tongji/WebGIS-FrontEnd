<template>
  <div class="wrapper wrapper-content">
    <div class="row">
      <div class="col-lg-15">

        <div class="ibox float-e-margins" v-for="(mapName,index) in mapNames">

          <!--Title-->
          <div class="ibox-title">
            <h5>{{mapName.name}}</h5>

            <!--button-->
            <div class="ibox-tools">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                <i class="fa fa-bars"></i>
              </a>
              <ul class="dropdown-menu dropdown-user">
                <li><a class="fa fa-trash-o" v-on:click="deleteMap(index,$event)">   Delete Completely</a>
                </li>
                <li><a class="fa fa-wrench">   Restore the Map</a>
                </li>
              </ul>
            </div>
          </div>

          <!--Thumbnails-->
          <div class="ibox-content">
                <div class="item">
                  <img alt="image"  class="img-responsive" src="../assets/images/recycled/map.jpg">
                </div>
          </div>
        </div>
      </div>

      <!--Get maps from pages(调用地图的接口)-->
      <div class="pages">
        <ul class="pagination">
          <li v-if="pages.isLeft" v-on:click="getMapsByPage(pages.currentPage - 1,$event)"><a>&laquo;</a></li>
          <li v-if="pages.pages.length > 1" v-bind:class="{pageChoosed:index == pages.currentPage}" v-for="(item,index) in pages.pages" v-on:click="getMapsByPage(index,$event)"><a>{{ item }}</a></li>
          <li v-if="pages.isRight" v-on:click="getMapsByPage(pages.currentPage + 1,$event)"><a>&raquo;</a></li>
        </ul>
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
        folderPath:[0],
        mapNames:[],
        pages:{
          currentPage:0,
          isLeft:false,
          isRight:true,
          pages:[1],
          total:20
        },
      }
    },

    methods: {
      getMaps: function (ID,event) {
        this.getMapsByPage(this.pages.currentPage,event);
      },
      /*分页事件*/
      getMapsByPage:function(index,event){
        //计算实际页数和父文件夹ID
        var page = this.pages.pages.length > index ? this.pages.pages[index] : 1;
        var folderId = this.folderPath.length > 0 ? this.folderPath[this.folderPath.length - 1] : 0;

        //访问后端获取地图数据
        this.$http.get('http://wb.lab-sse.cn/map/maps/accountidandfolderidandpageid?accountId=1&folderId=69&pageId=' + page,
          {
            emulateJSON: true
          }
        ).then(function (response) {
          var responseBody = response.body
          if (responseBody.code === 200) {
            this.mapNames = responseBody.data.map;
            if(this.mapNames.length == 0 && page > 1)this.getMapsByPage(index - 1,event);
            this.pages.total = responseBody.data.pageNum;

            //更改时间格式
            var len = this.mapNames.length;
            for(var i = 0;i < len; i++){
              var time = new Date(this.mapNames[i].create_time);
              this.mapNames[i].create_time = time.getFullYear() + "-" + time.getMonth() + "-" + time.getDay() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
              time = new Date(this.mapNames[i].update_time);
              this.mapNames[i].update_time = time.getFullYear() + "-" + time.getMonth() + "-" + time.getDay() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
            }

            //如果页面总数小于等于1，则格式化pages属性
            if(this.pages.total <= 1){
              this.pages.pages = [1];
              this.pages.isRight = false;
              this.pages.isLeft = false;
              return;
            }

            //更新当前被选中页
            this.pages.currentPage = index;

            //如果选中的是第一页，要么更新目录结构，要么取消左箭头
            if(index == 0){
              if(this.pages.pages[0] == 1)this.pages.isLeft = false;
              else this.pages.isLeft = true;

              //更新目录结构
              var begin = page - 5 > 0 ? page - 5 : 1;        //分页栏起始页面
              var end = 9 + begin > this.pages.total ? this.pages.total : 9 + begin;  //分页栏结束页面
              this.pages.currentPage = page - begin
              this.pages.pages = [];
              for(var i = begin; i <= end;i++){
                this.pages.pages.push(i);
              }
            }
            else{
              this.pages.isLeft = true;
            }

            //如果选中的是最后一页，要么更新目录结构，要么取消右箭头
            var len = this.pages.pages.length;
            if(index + 1 == len ){
              if(this.pages.pages[len - 1] == this.pages.total) this.pages.isRight = false;
              else this.pages.isRight = true;

              //更新目录结构
              var end = page + 4 > this.pages.total ? this.pages.total : page + 4; //分页栏结束页面
              var begin = end - 9 > 0 ? end - 9 : 1;        //分页栏起始页面
              this.pages.currentPage = page - begin
              this.pages.pages = [];
              for(var i = begin; i <= end;i++){
                this.pages.pages.push(i);
              }

            }
            else{
              this.pages.isRight = true;
            }

          }
        });
      },
      deleteMap: function (index, event) {
        if (confirm("Do you really want to delete the map completely: \n     " + this.mapNames[index].name)) {
          this.$http.delete("http://wb.lab-sse.cn/map/maps/id?mapId=" + this.mapNames[index].id,
            {
              emulateJSON: true
            }).then(function (response) {
            var len = this.folderPath.length;
            this.getMaps(this.folderPath[len - 1]);
          });
        }
      }
    },

      mounted(){
      var len = this.folderPath.length;
      this.getMaps(this.folderPath[len - 1]);
    }
  }
</script>
