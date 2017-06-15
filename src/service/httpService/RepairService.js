import httpService from '../httpService'

async function getAllByUserId  (context, userId) {
  try {
    let response = await httpService(context, BACKEND_URL.REPAIR_GET_BY_USER + userId, 'get')
    return response.body
  } catch (exception) {
    return {code: 100, exception: exception}
  }
}

async function getAll (context) {
  try {
    let response = await httpService(context, BACKEND_URL.REPAIR_GET_ALL, 'get')
    return response.body
  } catch (exception) {
    return {code: 100, exception: exception}
  }
}

async function updateState  (context, repairId, state) {
  try {
    let response = await httpService(context, `${BACKEND_URL.REPAIR_UPDATE_STATE}${repairId}?state=${state}`, 'patch')
    return response.body
  } catch (exception) {
    return {code: 100, exception: exception}
  }
}

export default {
  getAllByUserId,
  getAll,
  updateState
}
