<template>
  <div class="container" id="displayMap">
    <div class="row">
      <div class="col-md-3 ">
         <ul class="list-group aside-bar" id="aside-b" >
           <li class="list-group-item" v-for="item in maps">
              <!-- <a href="#"> -->
                <strong class="mapName">{{item.name}}</strong>
                <div>
                  <p>{{item.description}}
                  </p>
                  <small class="maptime">create time:  {{item.create_time}}</small><small class="maptime"></small><br/>
                  <small class="maptime">update time:  {{item.update_time}}</small><small class="maptime"></small>
                </div>
              <!-- </a> -->
              <div>
              <p>choose a version:</p>
              <select class="form-control" >
                  <option></option>
              </select>

            </div>
            </li>
         </ul>
      </div>
    <div class="col-md-9 wrapper wrapper-content animated fadeInRight ">
      <p>{{userInfo.userName}}'s Map</p>
        <div>
          <div class="ibox-content" id="map" style="position: relative; height: 700px">

          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
var map;
var sp;
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 31.23, lng: 121.47 },
      zoom: 4
  });
}
var myTrip=[];
var myPath;
function addPipe(){
    myPath=new google.maps.Polyline({
    path:myTrip,
    strokeColor:"#000000",
    strokeOpacity:0.8,
    strokeWeight:2
    });
    myPath.setMap(map);
  }


export default {
  name: 'displayMap',
  data () {
    return {
      data:'',
      //maps
      mapsVersion:[],
      maps:[],
      //layers
      layerIndex:[],
      pointsList:[],
    }
  },

  computed: {
    ...mapGetters({
    userInfo: 'userInfo'
    }),
    isLoggedIn () {
      return this.userInfo.userName != "";
    },

  },
  mounted(){
    initMap();
    // addPipe();
  },
  created () {
      this.$http.get('http://wb.lab-sse.cn:8080/map/maps/accountid',{params:{accountId:1}}).then(function(response){
        this.data = response.data.data;
        var i,j;
        for(i=0;i<this.data.length;i++){
          this.maps.push({
            mapId:this.data[i].id,
            create_time:this.data[i].create_time,
            update_time:this.data[i].update_time,
            name:this.data[i].name,
            description:this.data[i].description
          });
        }
        var exit=0;
        for(i=0;i<this.maps.length;i++){
          for(j=0;j<this.mapsVersion.length;j++)
          {
            if(this.maps[i].name==this.mapsVersion[j]){
              exit=1;
              this.mapsVersion[j].id.push(this.map[i].id);
              break;
            }
          }
          if(exit==0){
            this.mapsVersion.push({
              name:this.maps[i].name,
              id:this.maps[i].id
            });
          }else if (exit==1) {
            exit=0;
          }
        }
        for( i = 0; i < this.maps.length; i++) {
          this.$http.get('http://wb.lab-sse.cn:8080/layer/layers',{params:{mapId:this.maps[i].mapId}}).then(function(response){
            var count=0;
            console.log(response.data.data.mapId);
            for(j=0;j<response.data.data.layerList.length;j++){
              if(response.data.data.layerList[j].data==null){
                this.layerIndex[j]=0;
              }
              else {
                var k;
                this.layerIndex[j]=response.data.data.layerList[j].data.pointList.length;
                for(k=0;k<this.layerIndex[j];k++){
                  this.pointsList.push({
                    x:response.data.data.layerList[j].data.pointList[k].x,
                    y:response.data.data.layerList[j].data.pointList[k].y
                  })
                  count=count+1;
                }
              }

            }
            
            // sp=new google.maps.LatLng(this.pointsList[1].x,this.pointsList[1].y);
            // var k;
            // count=0;
            // for(j=0;j<this.layerIndex.length;j++){
            //   for(k=0;k<this.layerIndex[i];k++)
            //   {
            //     var p=new google.maps.LatLng(this.pointsList[count].x,this.pointsList[count].y);
            //     myTrip.push(p);
            //     count=count+1;
            //   }
            //   addPipe();
            //   myTrip=[];
            // }
          },function(response) {
            // error callback
          })
        }

      }, function(response) {
        // error callback
      })

  }
}
</script>
