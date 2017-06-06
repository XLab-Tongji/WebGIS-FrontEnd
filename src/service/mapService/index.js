let addListener = google.maps.event.addListener

function initMap (mapId) {
  return new google.maps.Map(document.getElementById(mapId), {
    center: {lat: global.MAP.INIT_LAT, lng: global.MAP.INIT_LNG },
    zoom: global.MAP.INIT_ZOOM
  })
}

function addClickListenerOnce (map, listener) {
  let mapClickListener = google.maps.event.addListener(map, 'click', function(event) {
    listener(event)
    google.maps.event.removeListener(mapClickListener);
  })
}

function createInfoWindow (infoWindowId, infoWindowParentId, closeBtnId, pos, map) {
  let infowindow = new google.maps.InfoWindow({
    content: document.getElementById(infoWindowId),
    position: pos
  })

  infowindow.open(map)

  google.maps.event.addListener(infowindow, 'domready', function () {
    var closeBtn = $('.gm-style-iw').next()
    closeBtn.hide()
    $('#' + closeBtnId).on('click', function (event) {
      document.getElementById(infoWindowParentId).append(document.getElementById(infoWindowId))
      infowindow.close()
    })
  })
}

function createMarker (pos, map, draggable, curPos, title) {
  let marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: title || '',
    draggable: draggable || false,
    animation: google.maps.Animation.DROP
  });
  addListener(marker, 'drag', () => {
    curPos.lat = marker.getPosition().lat()
    curPos.lng = marker.getPosition().lng()
  })
}

function getScaleWithZoom (zoom) {
  let scales = [1e7, 5e6, 2e6, 1e6, 5e5, 2e5, 1e5, 5e4, 2e4, 1e4, 5e3, 2e3, 1e3,
    500, 200, 200, 100, 50, 20, 10, 5, 2, 1, 1, 1, 1]
  return scales[zoom]
}

function getUperPos (pos, zoom) {
  return {
    lat: pos.lat + 0.000006 * getScaleWithZoom(zoom),
    lng: pos.lng
  }
}


export default {
  initMap,
  addClickListenerOnce,
  createInfoWindow,
  createMarker,
  getScaleWithZoom,
  getUperPos,
  addListener: addListener
}
