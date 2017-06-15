let addListener = google.maps.event.addListener

function initMap (mapId) {
  let map = new google.maps.Map(document.getElementById(mapId), {
    center: {lat: global.MAP.INIT_LAT, lng: global.MAP.INIT_LNG },
    zoom: global.MAP.INIT_ZOOM
  })
  return map
}

function updateCenter (map, position) {
  map.setCenter(position)
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
    position: pos,
    maxWidth: 900
  })

  infowindow.open(map)

  infowindow.ownClose = () => {
    document.getElementById(infoWindowParentId).append(document.getElementById(infoWindowId))
    infowindow.close()
  }

  google.maps.event.addListener(infowindow, 'domready', function () {
    var closeBtn = $('.gm-style-iw').next()
    closeBtn.hide()
    $('#' + closeBtnId).on('click', function (event) {
      infowindow.ownClose()
    })
  })

  return infowindow
}

function createMarker (pos, map, iconUrl) {
  iconUrl = iconUrl || '../../static/img/well_black.png'
  return new google.maps.Marker({
    position: pos,
    map: map,
    icon: {
      url: iconUrl,
      scaledSize: new google.maps.Size(SIZE.WELL, SIZE.WELL)
    },
    animation: google.maps.Animation.DROP
  })
}

function createWellMarker (pos, map, color) {
  let iconUrl = `../../static/img/well_${color}.png`
  return createMarker(pos, map, iconUrl)
}

function changeWellColor (marker, color, map) {
  let iconUrl = `../../static/img/well_${color}.png`
  changeMarkerColor(marker, iconUrl, map)
}
function changeMarkerColor (marker, iconUrl, map) {
  marker.setIcon({
    url: iconUrl,
    scaledSize: new google.maps.Size(SIZE.WELL, SIZE.WELL)
  })
  refreshComponent(marker, map)
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

function refreshComponent (component, map) {
  component.setMap(null)
  component.setMap(map)
}

function clearMapDataList (mapDataList) {
  if(!mapDataList) {
    return
  }
  mapDataList.forEach((mapData) => {
    mapData.setMap(null)
  })
}


function createLine (lat, lat2, lng, lng2, color, map) {
  let flightPath = new google.maps.Polyline({
    path: [{lat: lat, lng: lng}, {lat: lat2, lng: lng2}],
    geodesic: true,
    strokeColor: color,
    strokeOpacity: 1.0,
    strokeWeight: 10,
    // editable: true
  })

  flightPath.setMap(map)
  return flightPath
}

export default {
  initMap,
  addClickListenerOnce,
  createInfoWindow,
  getScaleWithZoom,
  getUperPos,
  updateCenter,

  createWellMarker,
  createMarker,
  changeMarkerColor,
  changeWellColor,

  clearMapDataList,

  refreshComponent,

  createLine,

  addListener: addListener
}
