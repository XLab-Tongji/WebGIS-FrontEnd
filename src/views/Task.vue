<template>
  <div>
    <div class="hide" id="map-info-window-parent">
      <div id="map-info-window" class="">
        <div class="form-group">
          <p class="col-sm-2 ">
            <i class="fa fa-clock-o fa-lg" aria-hidden="true"></i></p>
          <p class="col-sm-10">{{task.dateStr}}</p>
        </div>
        <div class="form-group">
          <p class="col-sm-2 ">
            <i class="fa fa-user fa-lg" aria-hidden="true"></i>
          </p>
          <p class="col-sm-10">{{username}}</p>
        </div>
        <div class="form-group form-inline">
          <p class="col-sm-2 icon-wrap">
            <i class="fa fa-comment fa-lg"></i>
          </p>
          <p class="col-sm-10">
            <input placeholder="desc" class="form-control" v-model="task.desc">
          </p>
        </div>
        <div class="form-group form-inline">
          <p class="col-sm-2 icon-wrap">
            <i class="fa fa-map-marker fa-lg"></i>
          </p>
          <p class="col-sm-10">
            <input placeholder="address info" class="form-control" v-model="task.addressInfo">
          </p>
        </div>

        <div class="form-group form-group-sm col-sm-offset-2 col-sm-10">
          <button type="button" class="btn btn-info col-sm-5">创建</button>
          <button type="button" class="btn btn-danger col-sm-offset-2 col-sm-5" id="task-close-btn">关闭</button>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-default">
      <form class="form-inline">
        <button type="button" class="btn btn-info" @click="onCreateTaskClick">
          <i class="fa fa-pencil-square-o" aria-hidden="true"></i>创建任务
        </button>
        <span>{{task.curPos}}</span>
      </form>
    </nav>
    <div class="ibox-content" id="map" style="position: relative; height: 820px"></div>
  </div>
</template>

<script>
  import  MapService from '@/service/mapService'
  import utils from '@/service/utils'
  export default {
    data () {
      return {
        map: null,
        username: this.$store.state.session.userName,
        task: {
          curPos: null,
          addressInfo: '',
          date: null,
          dateStr: null,
          desc: ''
        }
      }
    },
    methods: {
      onCreateTaskClick () {
        let context = this
        let marker = null
        this.task.date = new Date()
        this.task.dateStr = utils.formatDate(this.task.date, 'yyyy-MM-dd hh:mm:ss')

        navigator.geolocation.getCurrentPosition(function(position) {
          context.task.curPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          context.map.setCenter(context.curPos)
          marker = MapService.createMarker(context.task.curPos, context.map, true, context.task.curPos)
          MapService.createInfoWindow('map-info-window', 'map-info-window-parent', 'task-close-btn',
            MapService.getUperPos(context.task.curPos, context.map.getZoom()), context.map)
          console.log(context.map.getZoom(), MapService.getScaleWithZoom(context.map.getZoom()))
        })
      }
    },
    mounted () {
      this.map = MapService.initMap('map')
    },
    computed: {
    }
  }
</script>

<style scoped>
  .navbar {
    margin-top: 10px;
  }

  .icon-wrap i {
    margin-top: 40%;
  }

</style>
