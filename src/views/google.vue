<template>
  <div class="wrapper wrapper-content animated fadeInRight">
      <p>Google map</p>
      <div class="ibox-content" id="map" style="position: relative; height: 820px"></div>
  </div>
</template>

<script>
  var map;
  function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 31.23, lng: 121.47 },
          zoom: 9
      });
  }


  export default {
      name: 'googleMapPage' ,
      mounted(){
          initMap();
      }
  }
</script>



