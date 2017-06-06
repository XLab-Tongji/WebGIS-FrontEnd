<template>
  <div>
    <div class="hide" id="map-info-window-parent">
      <div id="map-info-window">
        <div class="form-group form-inline">
          <p class="col-sm-2 ">
            <i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>
          </p>
          <p class="col-sm-10">{{task.dateStr}}</p>
        </div>
        <div class="form-group form-inline">
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
            <input placeholder="desc" class="form-control" v-model="task.taskDesc">
          </p>
        </div>
        <div class="form-group form-inline">
          <p class="col-sm-2 icon-wrap">
            <i class="fa fa-map-marker fa-lg"></i>
          </p>
          <p class="col-sm-10">
            <input placeholder="address info" class="form-control" v-model="task.addressDesc">
          </p>
        </div>
        <div class="form-group form-inline">
          <p class="col-sm-2 icon-wrap">
            <i class="fa fa-jpy fa-lg"></i>
          </p>
          <p class="col-sm-10">
            <input placeholder="value" class="form-control" v-model="task.value">
          </p>
        </div>

        <div class="form-group form-group-sm col-sm-offset-2 col-sm-10">
          <button type="button" class="btn btn-info col-sm-5" @click="onCreateTaskBtnClick">创建</button>
          <button type="button" class="btn btn-danger col-sm-offset-2 col-sm-5" id="task-close-btn">关闭</button>
        </div>
      </div>
    </div>

    <div class="hide" id="task-detail-window-parent">
      <div id="task-detail-window">
        <div class="task-row">
          <p class="col-sm-2">
            <i class="fa fa-clock-o fa-lg" aria-hidden="true"></i>
          </p>
          <p class="col-sm-10">{{curTask.dateStr}}</p>
        </div>
        <div class="task-row">
          <p class="col-sm-2">
            <i class="fa fa-user fa-lg" aria-hidden="true"></i>
          </p>
          <p class="col-sm-10">{{curTask.creatorId}}</p>
        </div>
        <div class="task-row">
          <p class="col-sm-2 icon-wrap">
            <i class="fa fa-comment fa-lg"></i>
          </p>
          <p class="col-sm-10">{{curTask.taskDesc}}</p>
        </div>
        <div class="task-row">
          <p class="col-sm-2 icon-wrap">
            <i class="fa fa-map-marker fa-lg"></i>
          </p>
          <p class="col-sm-10">{{curTask.addressDesc}} </p>
        </div>
        <div class="task-row">
          <p class="col-sm-2 icon-wrap">
            <i class="fa fa-jpy fa-lg"></i>
          </p>
          <p class="col-sm-10">{{curTask.value}}</p>
        </div>

        <div class="task-row">
          <p class="col-sm-2 icon-wrap">
            <i class="fa fa-check fa-lg"></i>
          </p>
          <p class="col-sm-4">{{curTask.state}}</p>
          <button type="button"
                  class="btn col-sm-offset-2 col-sm-4"
                  @click="onAcceptTaskClick"
                  v-if="curTask.state==='WAITING'&&curTask.creatorId!=userId">accept</button>
          <button type="button"
                  class="btn col-sm-offset-2 col-sm-4"
                  @click="onFinishTaskClick"
                  v-if="curTask.state==='ACCEPTED'&&curTask.accpeterId==userId">finish</button>
          <button type="button"
                  class="btn col-sm-offset-2 col-sm-4"
                  @click="onPayClick"
                  v-if="curTask.state==='FINISHED'&&curTask.creatorId==userId">pay</button>
        </div>

        <div class="task-row col-sm-offset-2 col-sm-10">
          <button type="button" class="btn btn-danger col-sm-5"
                  v-if="curTask.state==='ACCEPTED'&&curTask.accpeterId==userId" @click="onGiveUpClick">放弃</button>
          <button type="button" class="btn btn-danger col-sm-5"
                  v-if="curTask.state==='WAITING'&&curTask.creatorId==userId" @click="onCancelClick">取消</button>
          <button type="button" class="btn btn-danger  col-sm-offset-2 col-sm-5" id="task-detail-close-btn">关闭</button>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-default">
      <button type="button" class="btn btn-info" @click="onCreateTaskClick">
        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>创建任务
      </button>
      <button type="button" class="btn btn-info" data-toggle="modal" data-target="#task-list-modal">
        <i class="fa fa-eye" aria-hidden="true"></i>查看任务
      </button>
      <ul>
        <li v-for="(color,state) in markerColors" :style="'color:#'+color">{{state}}</li>
      </ul>
    </nav>

    <div class="ibox-content" id="map" style="position: relative; height: 820px"></div>

    <div class="modal fade bs-example-modal-lg" id="task-list-modal" tabindex="-1" role="dialog" aria-labelledby="taskList">
      <div class="modal-dialog modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">查看任务</h4>
          </div>
          <div class="modal-body">
            <table class="table table-striped table-bordered table-hover">
              <thead>
              <tr>
                <th>创建者</th>
                <th>lat</th>
                <th>lng</th>
                <th>地址</th>
                <th>描述</th>
                <th>价格</th>
                <th>创建时间</th>
                <th>状态</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="task in tasks">
                <td>{{task.creatorId}}</td>
                <td>{{task.lat}}</td>
                <td>{{task.lng}}</td>
                <td>{{task.addressDesc}}</td>
                <td>{{task.taskDesc}}</td>
                <td>{{task.value}}</td>
                <td>{{task.createDate}}</td>
                <td :style="'color:#'+getColorFromState(task.state)">{{task.state}}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">&nbsp;取消&nbsp;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import  MapService from '@/service/mapService'
  import utils from '@/service/utils'
  import TaskService from '@/service/httpService/taskService'
  export default {
    data () {
      return {
        map: null,
        username: this.$store.state.session.userName,
        userId: this.$store.state.session.userId,
        task: {
          curPos: null,
          addressDesc: '',
          taskDesc: '',
          value: '',
          createDate: null,
          dateStr: null
        },
        newMarker: null,
        curTask: {},
        curInfoWindow: null,
        tasks: [],
        markers: {},
        markerColors: MARKER_COLOR
      }
    },
    methods: {
      getColorFromState (state) {
        return MARKER_COLOR[state]
      },
      onCreateTaskClick () {
        let context = this
        this.task.createDate = Date.parse(Date())
        this.task.dateStr = utils.formatDate(new Date(this.task.createDate), 'yyyy-MM-dd hh:mm:ss')

        navigator.geolocation.getCurrentPosition(function(position) {
          context.task.curPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          context.map.setCenter(context.curPos)
          context.newMarker = MapService.createMarker(context.task.curPos, context.map, MARKER_COLOR['WAITING'], true, context.task.curPos)
          context.curInfoWindow = MapService.createInfoWindow('map-info-window', 'map-info-window-parent', 'task-close-btn',
            MapService.getUperPos(context.task.curPos, context.map.getZoom()), context.map)
        })
      },
      async onCreateTaskBtnClick () {
        let postData = {
          lat: this.task.curPos.lat,
          lng: this.task.curPos.lng,
          addressDesc: this.task.addressDesc,
          taskDesc: this.task.taskDesc,
          value: this.task.value,
          createDate: this.task.createDate,
          creatorId: this.$store.state.session.userId
        }
        let responseBody = await TaskService.create(this, postData)
        if (responseBody.code === 200) {
          console.log('success create task', responseBody)
          if (this.curInfoWindow) {
            this.curInfoWindow.ownClose()

            postData.id = responseBody.data.taskId
            postData.state = responseBody.data.taskState
            postData.dateStr = this.task.dateStr
            let marker = this.newMarker

            this.tasks.push(postData)
            this.markers[postData.id] = this.newMarker
            this.newMarker = null

            MapService.addListener(marker, 'click', () => {
              this.curTask = postData
              this.curInfoWindow = MapService.createInfoWindow(
                'task-detail-window', 'task-detail-window-parent', 'task-detail-close-btn',
                MapService.getUperPos({lat: parseFloat(postData.lat), lng: parseFloat(postData.lng)},
                  this.map.getZoom()), this.map)
            })
          }
          alert('create success!')
        }
      },
      async onAcceptTaskClick () {
        let responseBody = await TaskService.acceptTask(this, {
          taskId: this.curTask.id,
          date: Date.parse(new Date()),
          accepterId: this.$store.state.session.userId
        })
        if (responseBody.code === 200) {
          this.curTask.state = responseBody.data.taskState
          this.curTask.accepterId = responseBody.data.accepterId
          MapService.changeMarkerColor(this.markers[this.curTask.id], MARKER_COLOR[responseBody.data.taskState], this.map)
        }
        console.log(responseBody)
      },
      async onFinishTaskClick () {
        let responseBody = await TaskService.finishTask(this, {
          taskId: this.curTask.id,
          date: Date.parse(new Date())
        })
        if (responseBody.code === 200) {
          this.curTask.state = responseBody.data.taskState
          MapService.changeMarkerColor(this.markers[this.curTask.id], MARKER_COLOR[responseBody.data.taskState], this.map)
        }
      },
      async onPayClick () {
        let responseBody = await TaskService.payTask(this, {
          taskId: this.curTask.id,
          date: Date.parse(new Date())
        })
        if (responseBody.code === 200) {
          this.curTask.state = responseBody.data.taskState
          MapService.changeMarkerColor(this.markers[this.curTask.id], MARKER_COLOR[responseBody.data.taskState], this.map)
        }
      },
      async onGiveUpClick () {
        let responseBody = await TaskService.giveUpTask(this, {
          taskId: this.curTask.id
        })
        if (responseBody.code === 200) {
          this.curTask.state = responseBody.data.taskState
          MapService.changeMarkerColor(this.markers[this.curTask.id], MARKER_COLOR[responseBody.data.taskState], this.map)
        }
      },
      async onCancelClick () {
        let responseBody = await TaskService.cancelTask(this, {
          taskId: this.curTask.id
        })
        if (responseBody.code === 200) {
          this.curTask.state = responseBody.data.taskState
          MapService.changeMarkerColor(this.markers[this.curTask.id], MARKER_COLOR[responseBody.data.taskState], this.map)
        }
      },
      async getTasks () {
        let responseBody = await TaskService.getAll(this)
        if (responseBody.code === 200) {
          responseBody.data.forEach((task) => {
            task.dateStr = utils.formatDate(new Date(task.createDate), 'yyyy-MM-dd hh:mm:ss')
            let curMarker = MapService.createMarker({lat: task.lat, lng: task.lng}, this.map, MARKER_COLOR[task.state])
            MapService.addListener(curMarker, 'click', () => {
              this.curTask = task
              this.curInfoWindow = MapService.createInfoWindow(
                'task-detail-window', 'task-detail-window-parent', 'task-detail-close-btn',
                MapService.getUperPos({lat: task.lat, lng: task.lng}, this.map.getZoom()), this.map)
            })
            this.markers[task.id] = curMarker
          })
          this.tasks = responseBody.data
          console.log(this.tasks)
        }
      }
    },
    async mounted () {
      this.map = MapService.initMap('map')
      this.getTasks()
    },
    watched: {
    }
  }
</script>

<style scoped>
  .navbar {
    margin-top: 10px;
    display: flex;
    align-items: center;
  }

  .navbar button {
    margin-right: 2%;
  }

  .navbar ul {
    display: flex;
    align-items: center;
  }
  .navbar ul li {
    list-style: none;
    margin-right: 3%;
  }

  .icon-wrap i {
    margin-top: 40%;
  }

  .task-row {
    display: flex;
    align-items: center;
    margin-bottom: 3%;
  }

</style>
