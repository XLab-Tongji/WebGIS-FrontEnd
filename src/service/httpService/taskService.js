import httpService from '../httpService'

async function create (context, postData)  {
  try {
    let response = await httpService(context, BACKEND_URL.TASK_CREATE, 'post', postData)
    return response.body
  } catch (exception) {
    return {state: 100, exception: exception}
  }
}

async function getAll (context) {
  try {
    let response = await httpService(context, BACKEND_URL.TASK_GET_ALL, 'get')
    return response.body
  } catch (exception) {
    return {state: 100, exception: exception}
  }
}

async function acceptTask (context, data) {
  try {
    let response = await httpService(context,
      `${BACKEND_URL.TASK_BASE}/${data.taskId}/${data.date}/accepted?accepterId=${data.accepterId}`, 'patch')
    return response.body
  } catch (exception) {
    return {state: 100, exception: exception}
  }
}

async function finishTask (context, data) {
  try {
    let response = await httpService(context,
      `${BACKEND_URL.TASK_BASE}/${data.taskId}/${data.date}/finished`, 'patch')
    return response.body
  } catch (exception) {
    return {state: 100, exception: exception}
  }
}

async function payTask (context, data) {
  try {
    let response = await httpService(context,
      `${BACKEND_URL.TASK_BASE}/${data.taskId}/${data.date}/paid`, 'patch')
    return response.body
  } catch (exception) {
    return {state: 100, exception: exception}
  }
}

async function giveUpTask (context, data) {
  try {
    let response = await httpService(context,
      `${BACKEND_URL.TASK_BASE}/${data.taskId}/givenup`, 'patch')
    return response.body
  } catch (exception) {
    return {state: 100, exception: exception}
  }
}

async function cancelTask (context, data) {
  try {
    let response = await httpService(context,
      `${BACKEND_URL.TASK_BASE}/${data.taskId}/canceled`, 'patch')
    return response.body
  } catch (exception) {
    return {state: 100, exception: exception}
  }
}

export default {
  create,
  getAll,
  acceptTask,
  finishTask,
  payTask,
  giveUpTask,
  cancelTask
}

