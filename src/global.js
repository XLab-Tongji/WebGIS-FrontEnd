/**
 * Created by Administrator on 2017/5/18.
 */

// Server Address
 global.baseUrl = 'http://wb.lab-sse.cn:8080'         // for deploy
// global.baseUrl = 'http://115.159.65.170:8080'   // for deploy plan B
//global.baseUrl = 'http://localhost:8080'        // for local test

global.BACKEND_URL ={
  LOGIN: '/auth/token',
  TASK_BASE: '/task/tasks',
  TASK_CREATE: '/task/tasks',
  TASK_GET_ALL: '/task/tasks'
}

global.MARKER_COLOR = {
  'WAITING': 'F89406',
  'ACCEPTED': '00B16A',
  'FINISHED': '2574A9',
  'PAID': '8E44AD',
  'GIVENUP': 'F64747',
  'CANCELED': 'F22613'
}

global.MAP = {
  INIT_LAT: 31.285,
  INIT_LNG: 121.215,
  INIT_ZOOM: 17
}

global.KEY_CODE_ENTER = 13
