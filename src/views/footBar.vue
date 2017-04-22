<template>
  <div class="footer">
      <div class="pull-right">
        Footer Left.
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
      currentTime: new Date().toLocaleString()
    }
  },
  created () {
    setInterval(() => {
      this.currentTime = new Date().toLocaleString()
    }, 1000)
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
