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
    console.log(resp)
    if (resp.body.code === 200) {
      let layers = resp.body.data.data
      console.log('before looop')
      for(let i = 0; i < layers.length; i ++) {
        let curResp = await httpService(context, BACKEND_URL.LAYER_GET_BY_LAYER_ID + layers[i].id, 'get')
        console.log('LAYER_GET_BY_LAYER_ID', curResp)
        if (curResp.body.code === 200) {
          if (layers[i].type === 'YJG') {
            layers[i].pointList = curResp.body.data.data.pointList
          } else {
            layers[i].lineList = curResp.body.data.data.lineList
          }
        } else {
          console.log('100')
          return {code: 100, exception: '无法获取图层数据！'}
        }
      }
      console.log('after looop')
      return resp.body
    }
  } catch (exception) {
    console.log(exception)
    return {code: 100, exception: exception}
  }
}

export default {
  getById,
  getLayersByHistory
}
