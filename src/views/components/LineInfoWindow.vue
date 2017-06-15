<template>
  <div id="line-info-parent" class="hide">
    <div id="line-info-div" class="info-window">
      <div class="icon-group">
        <i class="fa fa-dot-circle-o"></i>
        <p>道路维修</p>
      </div>
      <div class="icon-group">
        <i class="fa fa-map-marker"></i>
        <p>{{!clickLine.x || clickLine.x.toFixed(3)}}, {{!clickLine.y || clickLine.y.toFixed(3)}}</p>
      </div>
      <div class="icon-group">
        <i class="fa fa-map-marker"></i>
        <p>{{!clickLine.x2 || clickLine.x2.toFixed(3)}}, {{!clickLine.y2 || clickLine.y2.toFixed(3)}}</p>
      </div>
      <div class="icon-group">
        <i class="fa fa-flag"></i>
        <p>{{!clickLine || clickLine.status}}</p>
      </div>
      <div>
        <button id="line-info-close-btn" class="btn btn-danger btn-block">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      clickLine: {
        default: ''
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
</style>
