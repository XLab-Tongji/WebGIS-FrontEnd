<template>
  <div class="wrapper wrapper-content animated fadeInRight">
      <p>{{userInfo.userName}}'s map</p>

      <div id="displayMap">{{data}}</div>
  </div>
</template>

<script>
export default {
  name: 'displayMap',
  data () {
    return {
      data:'',
    }
  },
  created () {
      this.$http.get('http://115.159.65.170:8080/layer/layers?mapId=1').then(response => (
        this.data = response.bodyText
      ), response => {
        // error callback
      })
  }
}
</script>
