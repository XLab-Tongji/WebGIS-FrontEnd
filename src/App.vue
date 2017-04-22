<template>

<div id="app-wrapper">

    <router-view name="navigation"></router-view>

    <div id="page-wrapper" class="gray-bg">
        <router-view name="header"></router-view>
        <router-view name="mainPage"></router-view>
        <router-view name="footer"></router-view>
    </div>
</div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

</style>
