<template>
<div id="app-wrapper">
  <sideBar></sideBar>
  <div id="page-wrapper" class="gray-bg">
    <headBar></headBar>
    <router-view name="mainPage"></router-view>
    <footBar></footBar>
  </div>
</div>
</template>

<script>
  import headBar from '@/views/bar/headBar'
  import sideBar from '@/views/bar/sideBar'
  import footBar from '@/views/bar/footBar'

  export default {
    name: 'app',
    components: {
      'headBar': headBar,
      'sideBar': sideBar,
      'footBar': footBar
    }
  }
</script>

<style>

</style>
