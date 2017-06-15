/**
 * Created by Administrator on 2017/5/18.
 */

// Server Address
//  global.baseUrl = 'http://wb.lab-sse.cn:8080'         // for deploy
// global.baseUrl = 'http://115.159.65.170:8080'   // for deploy plan B
global.baseUrl = 'http://localhost:8080'        // for local test

global.BACKEND_URL ={
  LOGIN: '/auth/token',
  TASK_BASE: '/task/tasks',
  TASK_CREATE: '/task/tasks',
  TASK_GET_ALL: '/task/tasks',

  LAYER_GET_ALL: '/layer/layers/all',
  LAYER_GET_BY_LAYER_ID: '/layer/layer?layerId=',

  REPAIR_GET_ALL: '/repair/repair',
  REPAIR_GET_BY_USER: '/repair/repair/userId?userId=',
  REPAIR_UPDATE_STATE: '/repair/repair/state/',

  HISTORY_GET_BU_MAP_ID: '/history/histories/mapId?mapId=',
  HISTORY_GET_BY_HISTORY_ID: '/history/histories/id?historyId='
}

global.MARKER_COLOR = {
  'LOST': 'black',
  'BREAK': 'red',
  'BLOCK': 'yellow',
  'GOOD': 'green',
  'SERVICE': 'blue'
}

global.REPAIRE_COLOR = {
  'DAMAGE': 'red',
  'BLOCK': 'yellow',
  'LOST': 'black',
  'FINISH': 'green'
}

global.MAP = {
  INIT_LAT: 31.285,
  INIT_LNG: 121.215,
  INIT_ZOOM: 17
}

global.KEY_CODE_ENTER = 13

global.SIZE = {
  WELL: 40
}
