<template>
  <div class="wrapper wrapper-content">

    <div class="row">
      <div class="wrapper-content animated fadeInRight white-bg">

        <div class="col-lg-12">
          <!--缩略图模式-->
          <div class="row">
            <div class="col-lg-15">

              <!--文件-->
              <div class="file-box" v-for="(mapName,index) in mapNames" >
                <div class="file">
                  <span class="corner"></span>

                  <div class="image">
                    <img alt="img" class="img-responsive" src="../assets/images/recycled/map.jpg">
                  </div>

                  <div class="file-name">
                    {{ mapName.name }}<br/>
                    <small>Deleted:{{mapName.update_time}}</small>
                    <div class="btn-group pull-right" data-toggle="tooltip" data-placement="left" title="Remove Comletely">
                      <i class="fa fa-trash-o" v-on:click="deleteMap(index,$event)"></i>
                    </div>
                  </div>

                </div>
              </div>

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
        mapNames:[]
      }
    },

    methods: {
      getMaps: function (ID) {
        this.$http.get(baseUrl + '/map/maps/accountidandfolderid?accountId=1&folderId=' + ID,
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
      deleteMap: function (index, event) {
        if (confirm("Do you really want to delete the map completely: \n     " + this.mapNames[index].name)) {
          this.$http.delete(baseUrl + "/map/maps/id?mapId=" + this.mapNames[index].id,
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
