import httpService from '../httpService'

async function getCommonAll  (context) {
  try {
    let response = await httpService(context, BACKEND_URL.LAYER_GET_ALL, 'get')
    return response.body
  } catch (exception) {
    return {code: 100, exception: exception}
  }
}

export default {
  getCommonAll
}
