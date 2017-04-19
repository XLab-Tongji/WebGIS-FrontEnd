<template>
  <div class="wrapper wrapper-content animated fadeInRight">
    <div class="form-inline">
      <label>Google map</label>
      <label>
        <select class="form-control"  v-on:change="layerSelectChange">
          <option value="-1">选择图层</option>
          <option value="0">图层1</option>
          <option value="1">图层2</option>
        </select>
      </label>
    </div>
    <div class="ibox-content" id="map" style="position: relative; height: 820px"></div>
  </div>
</template>


<script>
  var map;
  var curLayer = -1;
  var flightLayer = [];
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 31.23, lng: 121.47 },
      zoom: 13
    });
  }

  export default {
    name: 'googleMapPage',
    methods: {
      layerSelectChange: function (event) {
        let selectVal = event.target.value;

        if (curLayer !== -1) {
          for (let pos in flightLayer[curLayer]) {
            flightLayer[curLayer][pos].setMap(null);
          }
        }
        curLayer = selectVal;
        if (selectVal !== -1) {
          for (let pos in flightLayer[curLayer]) {
            flightLayer[curLayer][pos].setMap(map);
          }
        }
      }
    },
    mounted(){
      initMap();
      this.$http.post('http://localhost:8080/layer/getLayer',
        {'mapId': 11}, {
          emulateJSON: true
        }
      ).then(function (response) {
        let responseBody = response.body
        console.log("success", responseBody);
        if (responseBody.code === 200) {
          let layerList = responseBody.data.layerList;
          const colorData = ['#0000ff', 'black'];

          layerList.forEach(function (layer, layerIndex) {
            let line = undefined;
            let prePoint = undefined;
            let curFlightLayer = [];
            layer.data.lineList.forEach(function (points) {
              if (prePoint === undefined || prePoint.x !== points.x || prePoint.y !== points.y) {
                if (line !== undefined) {
                  line.push({lat: prePoint.y, lng: prePoint.x});
                  let flightPath = new google.maps.Polyline({
                    path: line,
                    geodesic: true,
                    strokeColor: colorData[layerIndex],
                    strokeOpacity: 2,
                    strokeWeight: 3,
                  });
                  google.maps.event.addListener(flightPath,'click',function () {
                    if(confirm("是否删除这条轨迹？"))
                      flightPath.setMap(null);
                  });
                  curFlightLayer.push(flightPath);
                }
                line = [];
              }
              line.push({lat: points.y, lng: points.x});
              prePoint = {x: points.x2, y: points.y2};
            });
            line.push({lat: prePoint.y, lng: prePoint.x});
            let flightPath = new google.maps.Polyline({
              path: line,
              geodesic: true,
              strokeColor: colorData[layerIndex],
              strokeOpacity: 0.5,
              strokeWeight: 3,
            });
            google.maps.event.addListener(flightPath,'click',function () {
              if(confirm("是否删除这条轨迹？"))
                flightPath.setMap(null);
            });
            curFlightLayer.push(flightPath);
            flightLayer.push(curFlightLayer);
          });
        }
      });
    }

  }
</script>



