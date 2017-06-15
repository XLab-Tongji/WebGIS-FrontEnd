<template>
  <div>
    <div id="point-info-parent" class="hide">
      <div id="point-info-div" class="info-window">
        <div class="icon-group">
          <i class="fa fa-dot-circle-o"></i>
          <p>窨井盖</p>
        </div>
        <div class="icon-group">
          <i class="fa fa-info"></i>
          <p>{{clickPoint.pointId}}</p>
        </div>
        <div class="icon-group">
          <i class="fa fa-flag"></i>
          <p>{{clickPoint.status}}</p>
        </div>
        <div class="icon-group">
          <i class="fa fa-map-marker"></i>
          <p>{{!clickPoint.x || clickPoint.x.toFixed(3)}}, {{!clickPoint.y || clickPoint.y.toFixed(3)}}</p>
        </div>
        <div>
          <a @click="showRepairs = !showRepairs">报修({{!clickPoint.repairIds || clickPoint.repairIds.length}}个)</a>
          <div v-if="showRepairs">
            <div v-for="repair in clickPoint.repairs" class="repair-group">
              <div class="icon-group">
                <i class="fa fa-comment"></i>
                <p>{{repair.desc}}</p>
              </div>
              <div class="icon-group">
                <i class="fa fa-calendar"></i>
                <p>{{formatDate(repair.createDate)}}</p>
              </div>
              <div class="icon-group">
                <i class="fa fa-flag"></i>
                <p>{{repair.state}}</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <button id="point-info-close-btn" class="btn btn-danger btn-block">关闭</button>
        </div>
      </div>
    </div>
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

      <div class="vodal-container">
        <div>
          <a @click="onSubmitRepairChange" class="icon"><i class="fa fa-check fa-lg" aria-hidden="true"></i></a>
        </div>
        <table class="table table-striped table-bordered table-hover">
          <thead>
          <tr>
            <th><input type="checkbox"></th>
            <th>lat</th>
            <th>lng</th>
            <th>物品状态</th>
            <th>描述</th>
            <th>创建时间</th>
            <th>报修状态</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="ownRepair,index in ownRepairs" :class="ownRepair.originState!==ownRepair.state?'green':''">
            <td>
              <input type="checkbox">
            </td>
            <td>{{!ownRepair.point || ownRepair.point.y}}</td>
            <td>{{!ownRepair.point || ownRepair.point.x}}</td>
            <td>{{!ownRepair.point || ownRepair.point.status}}</td>
            <td>{{ownRepair.desc}}</td>
            <td>{{formatDate(ownRepair.createDate)}}</td>
            <td>
              <select v-model="ownRepair.state" class="form-control">
                <option
                  :value="repairState"
                  v-for="repairState in repairStates">{{repairState}}</option>
              </select>
            </td>
            <td>
              <a class="icon" @click="onUpdateCenterClick($event,index)"><i class="fa fa-map-marker fa-lg"></i></a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
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

        repairStates: ['LOST', 'BLOCK', 'DAMAGE', 'FINISH']
      }
    },
    components: {
      Vodal
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
        this.mapPoints = []
      },

      formatDate (date) {
        return utils.formatDate(new Date(date), 'yyyy-MM-dd')
      },

      async onSubmitRepairChange () {
        let isSuccess = true
        for(let i = 0; i < this.ownRepairs.length; i++) {
          if (this.ownRepairs[i].originState !== this.ownRepairs[i].state) {
            let respBody = await RepairService.updateState(this, this.ownRepairs[i].id, this.ownRepairs[i].state)
            if (respBody.code !== 200) {
              toastr.error('提交修改失败！')
              isSuccess = false
              break
            }
            this.ownRepairs[i].originState = this.ownRepairs[i].state
          }
        }
        if (isSuccess) {
          toastr.success('提交修改成功！')
        }
      },

      onUpdateCenterClick(event, repairIndex){
        console.log('onUpdateCenterClick', repairIndex)
        MapService.updateCenter(this.map, {
          lat: this.ownRepairs[repairIndex].point.y,
          lng: this.ownRepairs[repairIndex].point.x
        })
        this.isShowingOwnRepairs = false
      }
    },
    watch: {
      curSelectLayerId (newValue) {
        this.clearMap()
        if (newValue === '0') {
          return
        }
        this.layerDatas.forEach((layer) => {
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

  .repair-group {
    width: 90%;
    padding: 3%;
    background: #F2F1EF;
    border-radius: 10px;
  }

  /* info-window */
  .info-window {
    width: 250px;
    max-height: 250px;
    overflow: auto;
  }
  /* #info-window */

  /* vodal-container */
  .vodal-container {
    width: 95%;
    overflow: auto;
  }
  /* #vodal-container */

  table tr.green {
    background-color: greenyellow;
  }
</style>
