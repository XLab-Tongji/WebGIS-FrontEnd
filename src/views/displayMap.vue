<template>
  <div class="wrapper wrapper-content animated fadeInRight">
    <p>{{userInfo.userName}}'s Map</p>
      <div id="displayMap">mapId:  {{data}}
        <div class="ibox-content" id="map" style="position: relative; height: 600px">

        </div>
      </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
var map;
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 31.2855492031, lng: 121.2147505658 },
      zoom: 18
  });
}
var m1=new google.maps.LatLng(31.2857211186,121.2149965461);
var m2=new google.maps.LatLng(31.2858311434,121.2148248847);
var m3=new google.maps.LatLng(31.2858128060,121.2146478589);
var m4=new google.maps.LatLng(31.2857257030,121.21452984170);
var myTrip=[m1,m2,m3,m4];
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
    addPipe();
  },
  created () {
      this.$http.get('http://115.159.65.170:8080/layer/layers',{params:{mapId:1}}).then(response => (
        this.data = response.data.data.mapId
        // console.log(response.data.data.mapId)
        //console.log(response.data.data.layerList[1].id)
      ), response => {
        // error callback
      })
  }
}
</script>
