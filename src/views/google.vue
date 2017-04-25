<template>
  <div class="wrapper wrapper-content animated fadeInRight">
    <nav class="navbar navbar-default">
      Google map
      <select v-model="curLayerId">
      <option value="0">选择图层</option>
      <option v-for="selectLayer in selectLayers" v-bind:value="selectLayer.id">
        {{selectLayer.name}}
        </option>
    </select>

      <button type="button" v-on:click="deleteLayer">删除当前图层</button>

      <span class="dropdown">
        <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          创建图层
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
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

      <button type="button" v-on:click="submitChange">提交</button>

      <p>
        <strong>lng: </strong><span>{{ lng }}</span>
        <strong>lat: </strong><span>{{ lat }}</span>
        <select v-model="curPointStatus">
          <option value="0">选择状态</option>
          <option value="GOOD">状态GOOD</option>
          <option value="BAD">状态BAD</option>
        </select>
      </p>
    </nav>
    <div class="ibox-content" id="map" style="position: relative; height: 820px"></div>
  </div>
</template>

<script>
  export default {
    name: 'googleMapPage',
    data: function () {
      return {
        mapId:12,
        curLayerId:0,
        lng: "lng",
        lat: "lat",
        map: null,
        layerDatas:null,
        selectLayers:[],
        curLayerMapDatas:[],
        curPointStatus:0,
        curPoint: null
      }
    },
    methods: {
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
      clearMap:function (isRemoveFromMap) {
        if(isRemoveFromMap){
          this.curLayerMapDatas.forEach(function (curLayerMapData) {
            curLayerMapData.setMap(null);
          });
        }
        this.curLayerMapDatas = [];
      },
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

      setPointStatusGOOD:function () {
        this.curPoint.pointStaus = "GOOD";
      },
      addGoodPoint: function () {
        this.addPoint("GOOD");
      },
      addBadPoint: function () {
        this.addPoint("BAD");
      },
      getLayerData:function (layerId) {
        var layerList = this.layerDatas.layerList;
        for(let i = 0;i< layerList.length;i++){
          if(layerId===layerList[i].id)
            return layerList[i].data;
        }
        return null;
      },
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
            console.log("success",responseBody);
          }
          else{
            alert("提交失败！");
          }
        });
      },
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
        console.log(this.curPoint);
        this.curPoint.pointStaus = newValue;
        this.curPoint.fillColor = newValue==="GOOD"?"black":'#FF0000';
        console.log(this.curPoint.strokeColor);
        this.curPoint.setMap(null);
        this.curPoint.setMap(this.map);

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
</style>


