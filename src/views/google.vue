<template>
  <div class="wrapper wrapper-content animated fadeInRight">
    <nav class="navbar navbar-default">
      <form class="form-inline">
        <select v-model="curLayerId"  class="form-control">
          <option value="0">选择图层</option>
          <option v-for="selectLayer in selectLayers" v-bind:value="selectLayer.id">
            {{selectLayer.name}}
          </option>
        </select>

        <button type="button" v-on:click="deleteLayer" class="btn btn-danger">删除当前图层</button>

        <span class="dropdown">
        <button class="btn btn-success dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          创建图层
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu dropdown-menu-info" aria-labelledby="dropdownMenu1">
          <li><a v-on:click="createPointLayer">创建YJG图层</a></li>
          <li><a v-on:click="createLineLayer">创建XSG图层</a></li>
        </ul>
      </span>

        <span class="dropdown">
        <button class="btn btn-default dropdown-toggle" type="button" id="cheatePointMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          添加点
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="cheatePointMenu">
          <li><a v-on:click="addGoodPoint">添加好点</a></li>
          <li><a v-on:click="addBadPoint">添加坏点</a></li>
        </ul>
      </span>
        <button type="button" v-on:click="submitChange" class="btn btn-info">提交</button>
      </form>
    </nav>

    <nav class="navbar navbar-default" id="pointNav" v-if="curPoint">
      <form class="form-inline">
        <div class="form-group form-group-sm ">
          <label>lng</label>
          <input type="text" v-model="lng" class="form-control inputPos">
        </div>
        <div class="form-group form-group-sm">
          <label>lat</label>
          <input type="text" v-model="lat" class="form-control inputPos">
        </div>

        <select v-model="curPointStatus" class="form-control">
          <option value="0">选择状态</option>
          <option value="GOOD">状态GOOD</option>
          <option value="BAD">状态BAD</option>
        </select>
        <button type="button" v-on:click="deletePointBtnClick" class="btn btn-danger">删除当前点</button>
      </form>
    </nav>
    <div class="ibox-content" id="map" style="position: relative; height: 820px"></div>
  </div>
</template>

<script>
  export default {
    name: 'googleMapPage',
    data: function () {
      return {
        map: null,
        mapId:12,
        layerDatas:null,

        lng: "lng",
        lat: "lat",
        selectLayers:[],

        // 当前layer id以及map数据
        curLayerId:0,
        curLayerMapDatas:[],

        // 当前point 以及它的状态
        curPointStatus:0,
        curPoint: null
      }
    },
    methods: {
      // 初始化 地图 从数据库得到layerDatas 初始化selectList
      initMap: function () {
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 31.23, lng: 121.47 },
          zoom: 20
        });
      },
      getLayerDatas:function (mapId) {
        var self = this;
        this.$http.get('http://localhost:8080/layer/layers?mapId='+mapId,
          {
            emulateJSON: true
          }
        ).then(function (response){
          let responseBody = response.body
          if (responseBody.code === 200) {
            self.layerDatas= responseBody.data;
            this.setLayerSelect();
          }
        });
      },
      setLayerSelect: function () {
        this.selectLayers = [];
        var selectLayers = this.selectLayers;
        var count = 1;
        this.layerDatas.layerList.forEach(function (layerData) {
          selectLayers.push({
            id:layerData.id,
            "name":"Layer"+ (count++)
          });
        })
      },

      //添加图层
      createLayer:function (layerType) {
        var self = this;
        this.$http.post('http://localhost:8080/layer/emptyLayers',
          {
            mapId:this.mapId,
            type:layerType
          },
          {
            emulateJSON: true
          }
        ).then(function (response){
          let responseBody = response.body
          if (responseBody.code === 200) {
            self.getLayerDatas(self.mapId);
            alert("创建成功！");
          }
          else{
            alert("创建失败！");
          }
        });
      },
      createPointLayer:function () {
        this.createLayer("YJG");
      },
      createLineLayer:function () {
        this.createLayer("XSG");
      },

      // 删除图层
      deleteLayer:function () {
        var self = this;
        if(this.curLayerId!==0) {
          this.$http.delete('http://localhost:8080/layer/layers/id?mapId=' + this.mapId +"&layerId="+this.curLayerId,
            {
              emulateJSON: true
            }
          ).then(function (response){
            let responseBody = response.body
            if (responseBody.code === 200) {
              self.getLayerDatas(self.mapId);
              self.curLayerId = 0;
              alert("删除成功！");
            }
          });
        }
      },

      clearMap:function (isRemoveFromMap) {
        if(isRemoveFromMap){
          this.curLayerMapDatas.forEach(function (curLayerMapData) {
            curLayerMapData.setMap(null);
          });
        }
        this.curLayerMapDatas = [];
      },

      // 创建一个point
      createPoint:function (map,centerPos, color) {
        return new google.maps.Circle({
          strokeWeight: 0,
          fillColor: color,
          fillOpacity: 0.35,
          map: map,
          center: centerPos,
          radius: 2,
          draggable:true
        });
      },

      //根据点的状态创建一个点
      addPoint:function (pointStatus) {
        var self = this;
        var mapClickListener = google.maps.event.addListener(this.map, 'click', function(event) {
          var latLng = event.latLng;
          self.lng = latLng.lng().toFixed(6);
          self.lat = latLng.lat().toFixed(6);

          var cityCircle = self.createPoint(self.map,latLng,pointStatus==="GOOD"?"black":'#FF0000');
          cityCircle.pointStaus = pointStatus;
          self.curLayerMapDatas.push(cityCircle);

          google.maps.event.addListener(cityCircle,'drag',function () {
            self.lng = cityCircle.center.lng().toFixed(6);
            self.lat = cityCircle.center.lat().toFixed(6);
          });
          self.addPointClickListener(cityCircle);

          google.maps.event.removeListener(mapClickListener);
        });
      },
      addGoodPoint: function () {
        this.addPoint("GOOD");
      },
      addBadPoint: function () {
        this.addPoint("BAD");
      },

      // 根据layer id得到某一图层的数据
      getLayerData:function (layerId) {
        var layerList = this.layerDatas.layerList;
        for(let i = 0;i< layerList.length;i++){
          if(layerId===layerList[i].id)
            return layerList[i].data;
        }
        return null;
      },

      //提交当前图层的更改
      submitChange: function () {
        var curLayerData = this.getLayerData(this.curLayerId);
        curLayerData.pointList =  [];
        this.curLayerMapDatas.forEach(function (curData) {
          if(curLayerData.type==="YJG"){
            curLayerData.pointList.push({
              x:curData.center.lng(),
              y:curData.center.lat(),
              z:0,
              status:curData.pointStaus
            });
          }
        });
        var postData = {
          layerId:this.curLayerId,
          data:curLayerData
        }

        this.$http.patch('http://localhost:8080/layer/layers/point/id',
          postData
        ).then(function (response){
          let responseBody = response.body
          if (responseBody.code === 200) {
            alert("提交成功！");
          }
          else{
            alert("提交失败！");
          }
        });
      },

      // 为点添加动态效果
      addPointClickListener: function (point) {
        var self = this;
        google.maps.event.addListener(point,'click',function () {
          if(self.curPoint){
            self.curPoint.strokeWeight = 0;
            self.curPoint.setMap(null);
            self.curPoint.setMap(self.map);
          }
          self.curPoint = point;
          self.curPointStatus = point.pointStaus||"BAD";
          self.curPoint.strokeColor = self.curPoint.curPointStatus==="GOOD"?"black":'#FF0000';
          self.curPoint.strokeOpacity = 0.8;
          self.curPoint.strokeWeight = 2;
          self.curPoint.setMap(null);
          self.curPoint.setMap(self.map);
          self.lng = point.center.lng().toFixed(6);
          self.lat = point.center.lat().toFixed(6);
        });
      },
      lngLatOnChange: function () {
        this.curPoint.center = new google.maps.LatLng(this.lat, this.lng);
        this.curPoint.setMap(null);
        this.curPoint.setMap(this.map);
      },
      deletePointBtnClick: function () {
        this.curPoint.setMap(null);
        this.removeListByValue(this.curLayerMapDatas,this.curPoint);
        this.curPoint = null;
      },


      // utils
      removeListByValue: function (arr, val) {
        for(let i=0; i<arr.length; i++) {
          if(arr[i] === val) {
            arr.splice(i, 1);
            break;
          }
        }
      }
    },
    watch:{
      curLayerId: function(newValue, oldValue) {
        var self = this;
        this.clearMap(true);
        var layerDatas = this.getLayerData(newValue);
        layerDatas.pointList.forEach(function (layerData) {
          var cityCircle = self.createPoint(self.map,{lng:layerData.x,lat:layerData.y},
            layerData.status==="GOOD"?"black":'#FF0000');
          cityCircle.pointStaus = layerData.status;
          self.curLayerMapDatas.push(cityCircle);
          google.maps.event.addListener(cityCircle,'drag',function () {
            self.lng = cityCircle.center.lng().toFixed(6);
            self.lat = cityCircle.center.lat().toFixed(6);
          });
          self.addPointClickListener(cityCircle);
        })
      },
      curPointStatus: function (newValue, oldValue) {
        this.curPoint.pointStaus = newValue;
        this.curPoint.fillColor = newValue==="GOOD"?"black":'#FF0000';
        this.curPoint.setMap(null);
        this.curPoint.setMap(this.map);

      },
      lng: function () {
        this.lngLatOnChange();
      },
      lat: function () {
        this.lngLatOnChange();
      }
    },
    mounted(){
      this.initMap();
      this.getLayerDatas(12);
    }
  }
</script>

<style>
  .navbar{
    margin-bottom: 0;
  }
  form >div.form-group>input.inputPos{
    width:100px;
  }
</style>


