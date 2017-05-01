<template>
  <div class="wrapper wrapper-content animated fadeInRight">
    <p>{{userInfo.userName}}'s Map</p>
      <div id="displayMap">
        <div class="ibox-content" id="map" style="position: relative; height: 640px">

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
      center: sp,
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
      this.$http.get('http://115.159.65.170:8080/layer/layers',{params:{mapId:1}}).then(function(response){
        this.data = response.data.data;
        // console.log(response.data.data.layerList[1].data);
        var i;
        var count=0;
        for(i=0;i<this.data.layerList.length;i++){
          if(this.data.layerList[i].data==null){
            this.layerIndex[i]=0;
          }
          else {
            var j;
            this.layerIndex[i]=this.data.layerList[i].data.pointList.length;
            for(j=0;j<this.layerIndex[i];j++){
              this.pointsList.push({
                x:this.data.layerList[i].data.pointList[j].x,
                y:this.data.layerList[i].data.pointList[j].y
              })
              // console.log(this.pointsList[count].y);
              count=count+1;
            }
            // console.log(count);
          }
          // console.log(this.layerIndex[i]);

        }
        sp=new google.maps.LatLng(this.pointsList[1].x,this.pointsList[1].y);
        var k;
        count=0;
        for(i=0;i<this.layerIndex.length;i++){
          for(k=0;k<this.layerIndex[i];k++)
          {
            var p=new google.maps.LatLng(this.pointsList[count].x,this.pointsList[count].y);
            myTrip.push(p);
            count=count+1;
          }
          addPipe();
          myTrip=[];
        }
      }, function(response) {
        // error callback
      })

  }
}
</script>
