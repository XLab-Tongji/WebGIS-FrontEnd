<template>
  <div class="container" id="displayMap">
    <div class="row">
      <div class="col-md-3 ">
         <ul class="list-group aside-bar" id="aside-b" >
           <li class="list-group-item" v-for="item in mapsVersion">
              <!-- <a href="#"> -->
                <strong class="mapName">{{item.name}}</strong>
                <div >
                  <p>{{item.description[selected]}}
                  </p>
                  <small class="maptime">create time:  {{item.create_time[selected]}}</small><small class="maptime"></small><br/>
                  <small class="maptime">update time:  {{item.update_time[selected]}}</small><small class="maptime"></small>
                </div>
              <!-- </a> -->
              <div>
              <p>choose a version:</p>
              <select class="form-control" v-model="selected">
                  <option v-for="option in item.mapvid" v-bind:value="option.value">{{option.id}}</option>
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
      accoundId: this.$store.state.session.userId,
      data:'',
      selected:'',
      //maps
      maps:[],
      mapsVersion:[],
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
      this.$http.get('http://wb.lab-sse.cn:8080/map/maps/accountid',{params:{accountId:this.accoundId}}).then(function(response){
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
        var name=[];
        for(i=0;i<this.maps.length;i++){
          name.push({
            name:this.maps[i].name,
            index:i
          });
        }

        for(i =0 ; i< name.length-1; ++i) {
        for(j = 0; j< name.length-i-1; ++j) {
            if(name[j].name > name[j+1].name)
            {
                var tmp = name[j].name;
                var indextmp=name[j].index;
                name[j].name = name[j+1].name;
                name[j].index = name[j+1].index;
                name[j+1].name = tmp;
                name[j+1].index=indextmp;
            }
        }
    }
    var v=0;
    var mapsid=[];mapsid.push({id:this.maps[name[0].index].mapId,value:v});
    var mapscreate_time=[];mapscreate_time.push(this.maps[name[0].index].create_time);
    var mapsupdate_time=[];mapsupdate_time.push(this.maps[name[0].index].update_time);
    var mapsdescription=[];mapsdescription.push(this.maps[name[0].index].description);
    for(i=1;i<name.length;i++){
      if(name[i].name!==name[i-1].name){v++;
        this.mapsVersion.push({
          mapvid:mapsid,
          create_time:mapscreate_time,
          update_time:mapsupdate_time,
          name:this.maps[name[i-1].index].name,
          description:mapsdescription
        });
        mapsid=[];
        mapscreate_time=[];
        mapsupdate_time=[];
        mapsdescription=[];
        v=0;
        mapsid.push({id:this.maps[name[i].index].mapId,value:v});
        mapscreate_time.push(this.maps[name[i].index].create_time);
        mapsupdate_time.push(this.maps[name[i].index].update_time);
        mapsdescription.push(this.maps[name[i].index].description);
      }else {
        v++;
        mapsid.push({id:this.maps[name[i].index].mapId,value:v});
        mapscreate_time.push(this.maps[name[i].index].create_time);
        mapsupdate_time.push(this.maps[name[i].index].update_time);
        mapsdescription.push(this.maps[name[i].index].description);
      }
    }
        for( i = 0; i < this.maps.length; i++) {
          this.$http.get('http://wb.lab-sse.cn:8080/layer/layers',{params:{mapId:this.maps[i].mapId}}).then(function(response){
            var count=0;
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
