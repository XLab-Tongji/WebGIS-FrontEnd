<template>
  <div class="wrapper wrapper-content animated fadeInRight">
    <div class="hide" id="map-msg-parent">
      <div id="map-msg">
        <div class="form-group form-group-sm ">
          <label>lng</label>
          <span>{{ lng }}</span>
          <!--<input type="text" v-model="lng" class="form-control inputPos" v-on:keyup="lngLatOnChange">-->
        </div>
        <div class="form-group form-group-sm">
          <label>lat</label>
          <span>{{ lat }}</span>
          <!--<input type="text" v-model="lat" class="form-control inputPos" v-on:keyup="lngLatOnChange">-->
        </div>
        <div class="form-group form-group-sm">
          <label>radius</label>
          <span>{{ radius }}</span>
          <!--<input type="text" v-model="lat" class="form-control inputPos" v-on:keyup="lngLatOnChange">-->
        </div>
        <div class="form-group form-group-sm">
          <select v-model="curPointStatus" class="form-control">
            <option value="0">选择状态</option>
            <option value="GOOD">状态GOOD</option>
            <option value="BAD">状态BAD</option>
          </select>
        </div>

        <div class="form-group form-group-sm">
          <button type="button" v-on:click="deletePointBtnClick" class="btn btn-info btn-half-left">删除</button>
          <button type="button" class="btn btn-danger btn-half-right" id="pointMapMsgBtn">关闭</button>
        </div>
      </div>
    </div>

    <nav class="map-navbar half-nav">
      <form class="form-inline">
        <select v-model="curHistoryId[0]"  class="form-control">
          <option value="1">选择历史版本</option>
          <option v-for="history in histories" v-bind:value="history.id">
            {{history.description}}
          </option>
        </select>

        <select v-model="curLayerId1"  class="form-control">
          <option value="0">选择图层</option>
          <option v-for="selectLayer in selectLayers[0]" v-bind:value="selectLayer.id">
            {{selectLayer.name}}
          </option>
        </select>
      </form>
    </nav>

    <nav class="map-navbar half-nav">
      <form class="form-inline">
        <select v-model="curHistoryId[1]"  class="form-control">
          <option value="1">选择历史版本</option>
          <option v-for="history in histories" v-bind:value="history.id">
            {{history.description}}
          </option>
        </select>

        <select v-model="curLayerId2"  class="form-control">
          <option value="0">选择图层</option>
          <option v-for="selectLayer in selectLayers[1]" v-bind:value="selectLayer.id">
            {{selectLayer.name}}
          </option>
        </select>

        <a v-on:click="backToMapBtn" class="right-float gis-icon">
          <i class="fa fa-chevron-circle-left fa-2x" aria-hidden="true"></i>
        </a>
        <a v-on:click="compareBtn" class="right-float gis-icon">
          <i class="fa fa-compass fa-2x" aria-hidden="true"></i>
        </a>
      </form>
    </nav>

    <div class="ibox-content" id="map"></div>
    <div class="ibox-content" id="map2"></div>
  </div>
</template>

<script>
  export default {
    name: 'mapCompare',
    data: function () {
      return {
        mapId: this.$route.params.mapId,
        maps: [],
        mapIndexes: [0,1],

        histories: [],
        curHistoryId: new Array(2).fill(1),

        selectLayers1: [],
        selectLayers2: [],
        curLayerId1: 0,
        curLayerId2: 0,

        mapData: [[], []],
        curLayerMapDatas: [[],[]],

        curPoint: [null,null],
        curLayerType: [null,null],
        curPointStatus: null,

        lat: null,
        lng: null,
        radius: null
      }
    },
    methods: {
      initMap: function (mapDivId) {
        return new google.maps.Map(document.getElementById(mapDivId), {
          center: {lat: 31.23, lng: 121.47 },
          zoom: 20
        });
      },
      setHistoriesByMapId: function (mapId) {
        let self = this;
        this.$http.get('http://localhost:8080/history/histories/mapId?mapId='+this.mapId, {
          emulateJSON: true
        }).then(function (response) {
          let responseBody = response.body
          if(responseBody.code===200){
            self.histories = responseBody.data;
          }
        });
      },
      getHistoryMapDataByHistoryId: function (historyId, mapIndex) {
        console.log('getHistoryMapDataByHistoryId', historyId, mapIndex)
        var self = this;
        this.$http.get('http://localhost:8080/history/histories/id?historyId='+historyId,
          {
            emulateJSON: true
          }
        ).then(function (response){
          let responseBody = response.body
          if (responseBody.code === 200) {
            self.mapData[mapIndex] = responseBody.data;
            self.setLayerSelect(responseBody.data, mapIndex);
          }
        });
      },
      setLayerSelect: function (layerList, mapIndex) {
        let curSelectLayers = null;
        if(mapIndex===0){
          this.selectLayers1 = [];
          curSelectLayers = this.selectLayers1;
        }
        else{
          this.selectLayers2 = [];
          curSelectLayers = this.selectLayers2;
        }
        let self = this;
        layerList.data.forEach(function (layerData, index) {
          curSelectLayers.push({
            id: index + 1,
            "name": self.getLayerNameWithType(layerData.type)
          });
        });
      },

      /* google map */
      getLayerData: function (layerId, mapIndex) {
        return this.mapData[mapIndex].data[layerId-1];
      },
      createPointDetail: function (pointPos, pointStatus, radius, mapIndex) {
        console.log('in createPointDetail',pointPos, pointStatus, radius, mapIndex)
        var cityCircle = this.createPoint(this.maps[mapIndex], pointPos, this.getColorWithStatus(pointStatus), radius);
        cityCircle.pointStatus = pointStatus;
        this.curLayerMapDatas[mapIndex].push(cityCircle);
        this.addPointClickListener(cityCircle, mapIndex);
      },
      createPoint:function (map, centerPos, color, radius) {
        return new google.maps.Circle({
          strokeWeight: 0,
          fillColor: color,
          fillOpacity: 0.35,
          map: map,
          center: centerPos,
          radius: radius || 2,
        });
      },
      addPointClickListener: function (point, mapIndex) {
        let self = this;
        google.maps.event.addListener(point,'click',function () {
          if(self.curPoint[mapIndex]){
            self.curPoint[mapIndex].strokeWeight = 0;
            self.curPoint[mapIndex].setMap(null);
            self.curPoint[mapIndex].setMap(self.maps[mapIndex]);
          }
          self.curPoint[mapIndex] = point;
          self.curPointStatus = point.pointStatus||"BAD";
          self.curPoint[mapIndex].strokeColor = self.getColorWithStatus(self.curPoint.curPointStatus);
          self.curPoint[mapIndex].strokeOpacity = 0.8;
          self.curPoint[mapIndex].strokeWeight = 2;
          self.curPoint[mapIndex].setMap(null);
          self.curPoint[mapIndex].setMap(self.maps[mapIndex]);
          self.lng = point.center.lng().toFixed(6);
          self.lat = point.center.lat().toFixed(6);
          self.radius = point.radius;
          var infowindow = new google.maps.InfoWindow({
            content: document.getElementById("map-msg"),
            position: point.center
          });

          infowindow.open(self.maps[mapIndex]);

          google.maps.event.addListener(infowindow, 'domready', function () {
            var closeBtn = $('.gm-style-iw').next();
            closeBtn.hide();
            $('#pointMapMsgBtn').on('click', function (event) {
              document.getElementById('map-msg-parent').append(document.getElementById('map-msg'));
              infowindow.close();
            });
          })
        });
      },
      /* #google map */

      /* event listener */
      deletePointBtnClick: function () {
        this.curPoint.setMap(null);
        this.removeListByValue(this.curLayerMapDatas,this.curPoint);
        this.curPoint = null;
      },
      layerChange: function (mapIndex, newValue) {
        let self = this;
        this.clearMap(mapIndex);

        this.curPoint[mapIndex] = null;

        if(parseInt(newValue)=== 0){
          this.curLayerType[mapIndex] = 0;
          return;
        }

        let layerDatas = this.getLayerData(newValue, mapIndex);
        this.curLayerType[mapIndex] = layerDatas.type;

        if(this.curLayerType[mapIndex] === "YJG"){
          layerDatas.pointList.forEach(function (layerData) {
            self.createPointDetail({lng:layerData.x,lat:layerData.y}, layerData.status, layerData.z, mapIndex);
          });
        }
      },
      backToMapBtn: function () {
        this.$router.push({name: 'google', params: {mapId: this.mapId}});
      },
      compareBtn: function () {
        this.curLayerMapDatas[0].sort(this.com2PointWithBool);
        this.curLayerMapDatas[1].sort(this.com2PointWithBool);
        let point;
        let point2=null;
        for(let i=0; (point=this.curLayerMapDatas[0][i]) || point2;) {
          console.log('point ', point.center.lat(), point.center.lng(), point.radius);
          ++i;
        }

        for(let i=0, j=0; i<this.curLayerMapDatas[0].length || j<this.curLayerMapDatas[1].length;) {
          let point = this.curLayerMapDatas[0][i];
          let point2 = this.curLayerMapDatas[1][j];
          let comResult = this.com2PointsWithInt(point, point2);

            if(!comResult){
              ++i;
              ++j;
            }
            else if(comResult>0){
              this.changePointColor(point, this.getChangeColorWithStatus(point.pointStatus), this.maps[0]);
              ++i;
            }
            else{
              this.changePointColor(point2, this.getChangeColorWithStatus(point2.pointStatus), this.maps[1]);
              ++j;
            }
        }

      },
      /* #event listener */

      /* utils */
      getLayerNameWithType: function (type) {
        return type==='YJG' ? '窨井盖' : '道路维修';
      },
      clearMap: function (index) {
        this.curLayerMapDatas[index].forEach(function (curLayerMapData) {
          curLayerMapData.setMap(null);
        });
        this.curLayerMapDatas[index] = [];
      },
      getColorWithStatus: function (status) {
        return status==="GOOD"?"black":'#FF0000'
      },
      getChangeColorWithStatus: function (status) {
        return status==="GOOD"?"blue":'yellow'
      },
      com2PointWithBool: function (point, point2) {
        if(point.center.lat()===point2.center.lat()){
          if(point.center.lng()===point2.center.lng())
            return point.radius <= point2.radius;
          return point.center.lng() <= point2.center.lng();
        }
        return point.center.lat() <= point2.center.lat();
      },
      com2PointsWithInt: function (point, point2) {
        if(!point)
          return -1;
        if(!point2)
          return 1;
        if(point.center.lat()===point2.center.lat()){
          if(point.center.lng()===point2.center.lng())
            return point.radius - point2.radius;
          return point.center.lng() - point2.center.lng();
        }
        return point.center.lat() - point2.center.lat();
      },
      changePointColor: function (point, color, map) {
        point.fillColor = color;
        point.setMap(null);
        point.setMap(map);
      },
      /* #utils */
    },
    computed: {
      curHistoryIdCom: function () {
        let results = {};
        this.curHistoryId.forEach(function (historyId, index) {
          results[index] = historyId;
        })
        return results;
      },
      selectLayers: function () {
        return [this.selectLayers1, this.selectLayers2];
      }
    },
    watch: {
      curHistoryIdCom: {
        handler (newValue, oldValue) {
          for(let index in newValue){
            if(oldValue[index] !== newValue[index]){
              this.getHistoryMapDataByHistoryId(newValue[index], parseInt(index))
            }
          }
        },
        deep: true
      },
      curLayerId2: function (newValue, oldValue) {
        this.layerChange(1, newValue);
      },
      curLayerId1: function (newValue, oldValue) {
        this.layerChange(0, newValue);
      }

    },
    mounted () {
      this.maps[0] = this.initMap('map');
      this.maps[1] = this.initMap('map2');
      this.setHistoriesByMapId(this.mapId);
    }
  }
</script>

<style scoped>
  #map, #map2 {
    position: relative;
    display: inline-block;
    height: 820px;
    width: 48%;
  }
  #map {
    margin-right: 20px;
  }

  .map-navbar{
    margin-bottom: 10px;
  }
  .map-navbar.half-nav{
    display: inline-block;
    width: 48%;
  }
  .map-navbar.half-nav:nth-child(2n){
    margin-right: 20px;
  }


</style>
