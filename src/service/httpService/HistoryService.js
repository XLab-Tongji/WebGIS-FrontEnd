import httpService from '../httpService'

async function getById  (context, mapId) {
  try {
    let response = await httpService(context, BACKEND_URL.HISTORY_GET_BU_MAP_ID + mapId, 'get')
    return response.body
  } catch (exception) {
    return {code: 100, exception: exception}
  }
}

async function getLayersByHistory (context, historyId) {
  try {
    let resp= await httpService(context, BACKEND_URL.HISTORY_GET_BY_HISTORY_ID + historyId, 'get')
    if (resp.body.code === 200) {
      let layers = resp.body.data.data
      for(let i = 0; i < layers.length; i ++) {
        let curResp = await httpService(context, BACKEND_URL.LAYER_GET_BY_LAYER_ID + layers[i].id, 'get')
        if (curResp.body.code === 200) {
          if (layers[i].type === 'YJG') {
            layers[i].pointList = curResp.body.data.data.pointList
          } else {
            layers[i].lineList = curResp.body.data.data.lineList
          }
        } else {
          return {code: 100, exception: '无法获取图层数据！'}
        }
      }
      return resp.body
    }
  } catch (exception) {
    return {code: 100, exception: exception}
  }
}

export default {
  getById,
  getLayersByHistory
}
