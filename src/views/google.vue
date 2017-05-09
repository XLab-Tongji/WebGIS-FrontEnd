<template>
  <div class="wrapper wrapper-content animated fadeInRight">
    <nav class="navbar navbar-default">
      <form class="form-inline">
        <label>mapId: {{mapId}}</label>
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

        <span class="dropdown" v-if="curLayerType==='YJG'">
        <button class="btn btn-default dropdown-toggle" type="button" id="createPointMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          添加点
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="createPointMenu">
          <li><a v-on:click="addGoodPoint">添加好点</a></li>
          <li><a v-on:click="addBadPoint">添加坏点</a></li>
        </ul>
      </span>

        <span class="dropdown" v-if="curLayerType==='XSG' && curPoint===null">
        <button class="btn btn-default dropdown-toggle" type="button" id="createLineMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          添加线
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="createLineMenu">
          <li><a v-on:click="addGoodLine">添加好线</a></li>
          <li><a v-on:click="addBadLine">添加坏线</a></li>
        </ul>
      </span>

        <button type="button" v-on:click="stopAddLine" class="btn btn-default" v-if="curLayerType==='XSG' && curPoint!==null">停止</button>

        <button type="button" v-on:click="submitChange" class="btn btn-info">提交</button>
      </form>
    </nav>

    <nav class="navbar navbar-default" id="pointNav" v-if="curPoint && curLayerType==='YJG'">
      <form class="form-inline">
        <div class="form-group form-group-sm ">
          <label>lng</label>
          <input type="text" v-model="lng" class="form-control inputPos" v-on:keyup="lngLatOnChange">
        </div>
        <div class="form-group form-group-sm">
          <label>lat</label>
          <input type="text" v-model="lat" class="form-control inputPos" v-on:keyup="lngLatOnChange">
        </div>

        <select v-model="curPointStatus" class="form-control">
          <option value="0">选择状态</option>
          <option value="GOOD">状态GOOD</option>
          <option value="BAD">状态BAD</option>
        </select>
        <button type="button" v-on:click="deletePointBtnClick" class="btn btn-danger">删除当前点</button>
      </form>
    </nav>
    <nav class="navbar navbar-default" id="lineNav" v-if="curLine">
      <form class="form-inline">
        <div class="form-group form-group-sm ">
          <label>lng</label>
          <input type="text" v-model="lng" class="form-control inputPos" v-on:keyup="lngLatOnChange">
        </div>
        <div class="form-group form-group-sm">
          <label>lat</label>
          <input type="text" v-model="lat" class="form-control inputPos" v-on:keyup="lngLatOnChange">
        </div>
        <div class="form-group form-group-sm ">
          <label>lng2</label>
          <input type="text" v-model="lng2" class="form-control inputPos" v-on:keyup="lngLat2OnChange">
        </div>
        <div class="form-group form-group-sm">
          <label>lat2</label>
          <input type="text" v-model="lat2" class="form-control inputPos" v-on:keyup="lngLat2OnChange">
        </div>

        <select v-model="curPointStatus" class="form-control">
          <option value="0">选择状态</option>
          <option value="GOOD">状态GOOD</option>
          <option value="BAD">状态BAD</option>
        </select>
        <button type="button" v-on:click="deleteLineBtnClick" class="btn btn-danger">删除当前线</button>
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
        mapId: this.$route.params.mapId,
        layerDatas:null,

        lng: "lng",
        lat: "lat",
        lng2: "lng2",
        lat2: "lat2",
        selectLayers:[],

        // 当前layer id以及map数据
        curLayerId:0,
        curLayerType:null,
        curLayerMapDatas:[],

        // 当前point 以及它的状态
        curPointStatus:0,
        curPoint: null,
        curLine: null,
        tmpPoint: null,
        mapClickListener: null
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
      createPointDetail: function (pointPos, pointStatus) {
        var cityCircle = this.createPoint(this.map,pointPos,this.getColorWithStatus(pointStatus));
        cityCircle.pointStatus = pointStatus;
        this.curLayerMapDatas.push(cityCircle);

        let self = this;
        google.maps.event.addListener(cityCircle,'drag',function () {
          self.lng = cityCircle.center.lng().toFixed(6);
          self.lat = cityCircle.center.lat().toFixed(6);
        });
        this.addPointClickListener(cityCircle);
      },
      createLine: function (map, pointList, color) {
        var flightPath = new google.maps.Polyline({
          path: pointList,
          geodesic: true,
          strokeColor: color,
          strokeOpacity: 1.0,
          strokeWeight: 10,
          editable: true
        });

        flightPath.setMap(map);
        this.addLineClickListener(flightPath);
        return flightPath;
      },

      //根据点的状态创建一个点
      getColorWithStatus: function (status) {
        return status==="GOOD"?"black":'#FF0000'
      },
      addPoint:function (pointStatus) {
        var self = this;
        var mapClickListener = google.maps.event.addListener(this.map, 'click', function(event) {
          var latLng = event.latLng;
          self.lng = latLng.lng().toFixed(6);
          self.lat = latLng.lat().toFixed(6);

          self.createPointDetail(latLng, pointStatus);
          google.maps.event.removeListener(mapClickListener);
        });
      },
      addGoodPoint: function () {
        this.addPoint("GOOD");
      },
      addBadPoint: function () {
        this.addPoint("BAD");
      },

      // 添加线
      // tmpPoint为第一个点，点击第二次以后删除该点
      addLine: function (lineStatus) {
        var self = this;
        self.mapClickListener = google.maps.event.addListener(this.map, 'click', function(event) {
          var latLng = event.latLng;
          let tmpPoint = {lng:latLng.lng(), lat:latLng.lat()}
          self.lng = latLng.lng().toFixed(6);
          self.lat = latLng.lat().toFixed(6);
          if(self.curPoint){
            let curLine = self.createLine(self.map, [self.curPoint, tmpPoint],self.getColorWithStatus(lineStatus));
            curLine.lineStatus = lineStatus;
            self.curLayerMapDatas.push(curLine);
            if(self.tmpPoint){
              self.tmpPoint.setMap(null);
              self.tmpPoint = null;
            }
          }
          else{
            self.tmpPoint= self.createPoint(self.map, latLng, self.getColorWithStatus(lineStatus));
          }
          self.curPoint = tmpPoint;
        });
      },
      addGoodLine: function () {
        this.addLine("GOOD");
      },
      addBadLine: function () {
        this.addLine("BAD");
      },

      stopAddLine: function () {
        google.maps.event.removeListener(this.mapClickListener);
        this.mapClickListener = null;
        if(this.tmpPoint!==null){
          this.tmpPoint.setMap(null);
          this.tmpPoint = null;
        }
        this.curPoint = null;
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
        var curLayerData = null;
        var self = this;
        var patchUrl = self.curLayerType==="YJG" ?
          "http://localhost:8080/layer/layers/point/id":
          "http://localhost:8080/layer/layers/line/id";
        curLayerData = {type:self.curLayerType, pointList:[], lineList: []};
        this.curLayerMapDatas.forEach(function (curData) {
          if(self.curLayerType==="YJG"){
            curLayerData.pointList.push({
              x:curData.center.lng(),
              y:curData.center.lat(),
              z:0,
              status:curData.pointStatus
            });
          }
          else if(self.curLayerType==="XSG"){
            let vertices = curData.getPath();
            let xy1 = vertices.getAt(0);
            let xy2 = vertices.getAt(1);
            curLayerData.lineList.push({
              x: xy1.lng(),
              y: xy1.lat(),
              z: 0,
              x2: xy2.lng(),
              y2: xy2.lat(),
              z2: 0,
              status: curData.lineStatus
            });
          }
        });
        var postData = {
          layerId: this.curLayerId,
          data: curLayerData
        }
        console.log("postData", postData);

        this.$http.patch(patchUrl, postData)
          .then(function (response){
            let responseBody = response.body;
            if (responseBody.code === 200) {
              self.getLayerDatas(self.mapId);
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
          self.curPointStatus = point.pointStatus||"BAD";
          self.curPoint.strokeColor = self.getColorWithStatus(self.curPoint.curPointStatus);
          self.curPoint.strokeOpacity = 0.8;
          self.curPoint.strokeWeight = 2;
          self.curPoint.setMap(null);
          self.curPoint.setMap(self.map);
          self.lng = point.center.lng().toFixed(6);
          self.lat = point.center.lat().toFixed(6);
        });
      },
      addLineClickListener: function (line) {
        var self = this;
        google.maps.event.addListener(line,'click',function () {
          self.curLine = line;
          self.curPointStatus = line.lineStatus||"BAD";
          let vertices = line.getPath();
          self.lat = vertices.getAt(0).lat().toFixed(6);
          self.lng = vertices.getAt(0).lng().toFixed(6);
          self.lat2 = vertices.getAt(1).lat().toFixed(6);
          self.lng2 = vertices.getAt(1).lng().toFixed(6);
        });
        google.maps.event.addListener(line.getPath(), 'set_at', function () {
          let vertices = line.getPath();
          self.lat = vertices.getAt(0).lat().toFixed(6);
          self.lng = vertices.getAt(0).lng().toFixed(6);
          self.lat2 = vertices.getAt(1).lat().toFixed(6);
          self.lng2 = vertices.getAt(1).lng().toFixed(6);
        })
      },

      lngLatOnChange: function () {
        if(this.curLayerType==="YJG") {
          this.curPoint.center = new google.maps.LatLng(this.lat, this.lng);
          this.curPoint.setMap(null);
          this.curPoint.setMap(this.map);
        }
        else if(this.curLayerType==="XSG"){
          let vertices = this.curLine.getPath();
          vertices.removeAt(0);
          vertices.insertAt(0, new google.maps.LatLng(this.lat, this.lng))
          this.curLine.setMap(null);
          this.curLine.setMap(this.map);
        }
      },

      lngLat2OnChange: function(){
        let vertices = this.curLine.getPath();
        vertices.removeAt(1);
        vertices.insertAt(1, new google.maps.LatLng(this.lat2, this.lng2))
        console.log("xy2", vertices.getAt(1).lat(),vertices.getAt(1).lng());
        this.curLine.setMap(null);
        this.curLine.setMap(this.map);
      },
      deletePointBtnClick: function () {
        this.curPoint.setMap(null);
        this.removeListByValue(this.curLayerMapDatas,this.curPoint);
        this.curPoint = null;
      },
      deleteLineBtnClick: function () {
        this.curLine.setMap(null);
        this.removeListByValue(this.curLayerMapDatas,this.curLine);
        this.curLine = null;
      },


      // utils
      removeListByValue: function (arr, val) {
        for(let i=0; i<arr.length; i++) {
          if(arr[i] === val) {
            arr.splice(i, 1);
            break;
          }
        }
        console.log(arr);
      }
    },
    watch:{
      curLayerId: function(newValue, oldValue) {
        var self = this;
        this.clearMap(true);

        this.curPoint = null;
        this.curLine = null;

        if(parseInt(newValue)=== 0){
          this.curLayerType = 0;
          return;
        }

        var layerDatas = this.getLayerData(newValue);
        this.curLayerType = layerDatas.type;

        if(this.curLayerType==="YJG"){
          layerDatas.pointList.forEach(function (layerData) {
            self.createPointDetail({lng:layerData.x,lat:layerData.y}, layerData.status);
          });
        }
        else if(this.curLayerType==="XSG"){
          layerDatas.lineList.forEach(function (layerData) {
            let curLine = self.createLine(self.map,[
              {lng:layerData.x, lat:layerData.y},
              {lng:layerData.x2, lat:layerData.y2}
            ],self.getColorWithStatus(layerData.status));
            curLine.lineStatus = layerData.status;
            self.curLayerMapDatas.push(curLine);
          });
        }

      },
      curPointStatus: function (newValue, oldValue) {
        if(this.curLayerType==="YJG"){
          this.curPoint.pointStatus = newValue;
          this.curPoint.fillColor = this.getColorWithStatus(newValue);
          this.curPoint.setMap(null);
          this.curPoint.setMap(this.map);
        }
        else if(this.curLayerType === "XSG"){
          this.curLine.lineStatus = newValue;
          this.curLine.strokeColor = this.getColorWithStatus(newValue);
          this.curLine.setMap(null);
          this.curLine.setMap(this.map);
        }
      }
    },
    mounted(){
      this.initMap();
      this.getLayerDatas(this.mapId);
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
