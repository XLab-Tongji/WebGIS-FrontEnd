<template>
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
</template>

<script>
  import utils from '@/service/utils'
  export default {
    props: {
      clickPoint: {
        default: ''
      }
    },
    data () {
      return {
        showRepairs: false
      }
    },
    methods: {
      formatDate (date) {
        return utils.formatDate(new Date(date), 'yyyy-MM-dd')
      }
    }
  }
</script>

<style scoped>
  /* common */
  div {
    margin-bottom: 5px;
    margin-top: 5px;
  }
  /* #common */


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
</style>
