<template>
  <div>
    <PointInfoWindow :clickPoint="clickPoint"></PointInfoWindow>
    <LineInfoWindow :clickLine="clickLine"></LineInfoWindow>

    <nav class="tools-nav">
      <div class="form-group tools-nav-item">
        <select v-model="curSelectLayerId"  class="form-control">
          <option value="0">选择图层</option>
          <option v-for="selectLayer in selectLayers" :value="selectLayer.type">
            {{selectLayer.name}}
          </option>
        </select>
      </div>
      <div class="form-group tools-nav-item">
        <button class="btn btn-info" @click="isShowingOwnRepairs = true"><i class="fa fa-eye"></i>我的报修</button>
      </div>
    </nav>
    <div class="ibox-content" id="map" style="position: relative; height: 820px"></div>

    <vodal :show="isShowingOwnRepairs"
           :animation="'zoom'"
           @hide="isShowingOwnRepairs = false"
           :width="800"
           :height="500">
      <RepairTable :ownRepairs="ownRepairs" @onUpdateCenterClick="onUpdateCenterClick"></RepairTable>
    </vodal>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Vodal from 'vodal'
  import MapService from '@/service/mapService'
  import LayerService from '@/service/httpService/LayerService'
  import RepairService from '@/service/httpService/RepairService'
  import utils from '@/service/utils'
  import RepairTable from './components/RepairTable.vue'
  import PointInfoWindow from './components/PointInfoWindow.vue'
  import LineInfoWindow from './components/LineInfoWindow.vue'
  export default {
    data () {
      return {
        map: null,
        curSelectLayerId: 0,
        selectLayers: [],

        layerDatas: [],
        ownRepairs: [],

        mapPoints: [],
        clickPoint: {},
        showRepairs: false,
        isShowingOwnRepairs: false,

        clickLine: [],
        mapLines: []
      }
    },
    components: {
      Vodal,
      RepairTable,
      PointInfoWindow,
      LineInfoWindow
    },
    methods: {
      ...mapGetters([
        'getUserId'
      ]),
      async getLayerDatas () {
        let responseBody = await LayerService.getCommonAll(this)
        let layerTypeMap = {}
        if(responseBody.code === 200) {
          this.layerDatas = responseBody.data
          this.layerDatas.forEach((layer) => {
            layerTypeMap[layer.data.type] = true
          })
          this.selectLayers = []
          for(let layerType in layerTypeMap) {
            if(layerTypeMap.hasOwnProperty(layerType)) {
              this.selectLayers.push({
                type: layerType,
                name: utils.getLayerNameFromType(layerType)
              })
            }
          }
        }
        else {
          toastr.error('加载图层信息失败!')
        }
      },

      async getOwnRepairs () {
        let respBody = await RepairService.getAllByUserId(this, this.getUserId())
        if(respBody.code === 200) {
          respBody.data.forEach((repair) => {
            repair.originState = repair.state
          })
          this.ownRepairs = respBody.data
        } else {
          toastr.error('加载用户报修失败！')
        }
      },

      clearMap () {
        MapService.clearMapDataList(this.mapPoints)
        MapService.clearMapDataList(this.mapLines)
        this.mapPoints = []
        this.mapLines = []
      },

      formatDate (date) {
        return utils.formatDate(new Date(date), 'yyyy-MM-dd')
      },

      onUpdateCenterClick (repairIndex) {
        MapService.updateCenter(this.map, {
          lng: this.ownRepairs[repairIndex].point.x,
          lat: this.ownRepairs[repairIndex].point.y
        })
        this.isShowingOwnRepairs = false
        console.log(repairIndex)
      }
    },
    watch: {
      curSelectLayerId (newValue) {
        this.clearMap()
        if (newValue === '0') {
          return
        }
        this.layerDatas.forEach((layer) => {
          if(newValue === 'YJG') {
            if(layer.data.type === newValue && layer.data.pointList) {
              layer.data.pointList.forEach((point) => {
                let wellMarker = MapService.createWellMarker({
                    lat: point.y, lng: point.x
                  },
                  this.map,
                  MARKER_COLOR[point.status]
                )
                MapService.addListener(wellMarker, 'click', () => {
                  this.clickPoint = point
                  this.curInfoWindow = MapService.createInfoWindow(
                    'point-info-div', 'point-info-parent', 'point-info-close-btn',
                    MapService.getUperPos({lat: point.y, lng: point.x}, this.map.getZoom()), this.map)
                })
                this.mapPoints.push(wellMarker)
              })
            }
          } else if (newValue === 'XSG') {
            if(layer.data.type === newValue && layer.data.lineList) {
              console.log(layer.data.lineList)
              layer.data.lineList.forEach((line) => {
                let curLine = MapService.createLine(line.y, line.y2, line.x, line.x2, MARKER_COLOR[line.status], this.map)
                MapService.addListener(curLine, 'click', () => {
                  this.clickLine = line
                  this.curInfoWindow = MapService.createInfoWindow(
                    'line-info-div', 'line-info-parent', 'line-info-close-btn',
                    MapService.getUperPos({lat: line.y, lng: line.x}, this.map.getZoom()), this.map)
                })
                this.mapLines.push(curLine)
              })
            }
          }
        })
      }
    },
    mounted () {
      this.map = MapService.initMap('map')
      this.getLayerDatas()
      this.getOwnRepairs()
      toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 4000
      }
    }
  }
</script>

<style scoped>
  @import "../../node_modules/vodal/common.css";
  @import "../../node_modules/vodal/rotate.css";
  /* common */
  div {
    margin-bottom: 5px;
    margin-top: 5px;
  }
  /* #common */

  /* tools-nav */
  .tools-nav {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 5px 0;
  }
  .tools-nav .tools-nav-item {
    margin-right: 3%;
  }
  /* #tools-nav */

  /* icon-group */
  .icon-group {
    display: flex;
    justify-content: space-around;
  }
  .icon-group i{
    flex: 1;
  }
  .icon-group p {
    flex: 5;
  }
  .icon {
    color: #1ab394;
  }
  /* #icon-group */



</style>
