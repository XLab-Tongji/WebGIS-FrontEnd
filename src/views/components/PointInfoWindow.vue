<template>
  <div id="point-info-parent" class="hide">
    <div id="point-info-div" class="info-window">
      <div class="icon-group">
        <i class="fa fa-dot-circle-o"></i>
        <p>{{clickPoint.typeName}}</p>
      </div>
      <div class="icon-group">
        <img :src="clickPoint.url" :alt="clickPoint.typeName">
      </div>
      <div class="icon-group">
        <i class="fa fa-info"></i>
        <p>{{clickPoint.pointId}}</p>
      </div>
      <div class="icon-group">
        <i class="fa fa-flag"></i>
        <p v-if="!editable">{{clickPoint.status}}</p>
        <div v-if="editable">
          <select class="form-control" v-model="clickPoint.status" @change="onPointStatusChange">
            <option v-for="curStatus in pointStatus" :value="curStatus">{{curStatus}}</option>
          </select>
        </div>
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
  </div >
</template>

<script>
  import utils from '@/service/utils'
  export default {
    props: {
      clickPoint: {
        default: ''
      },
      editable: {
        default: false
      }
    },
    data () {
      return {
        showRepairs: false,
        pointStatus: ['LOST', 'BREAK', 'BLOCK', 'GOOD', 'SERVICE']
      }
    },
    methods: {
      formatDate (date) {
        return utils.formatDate(new Date(date), 'yyyy-MM-dd')
      },
      onPointStatusChange(event) {
        this.$emit('onCurPointStatusChange', event.target.value)
        console.log('change', event.target.value)
      }
    },
    watched: {
    }
  }
</script>

<style scoped>
  /* common */
  div {
    margin-bottom: 5px;
    margin-top: 5px;
  }
  p {
    margin: 0;
  }
  /* #common */


  /* icon-group */
  .icon-group {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .icon-group i{
    flex: 1;
  }
  .icon-group p, .icon-group div {
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

  img {
    width: 140px;
  }
</style>
