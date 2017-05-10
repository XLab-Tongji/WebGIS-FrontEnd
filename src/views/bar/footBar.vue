<template>
  <div class="footer">
      <div class="pull-right">
        {{systemState}}
      </div>
      <div>
        <strong>Time: {{currentTime}}</strong>
      </div>
  </div>
</template>

<script>
export default {
  name: 'footBar',
  data () {
    return {
      systemState: 'System Connecting....    ',
      currentTime: new Date().toLocaleString()
    }
  },
  created () {
      setInterval(() => {
        this.currentTime = new Date().toLocaleString()
      }, 1000)
      this.$http.get('http://115.159.65.170:8080/test/state').then(response => {
        console.log(response)
        this.systemState = response.bodyText
      }, response => {
        // error callback
      })
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
