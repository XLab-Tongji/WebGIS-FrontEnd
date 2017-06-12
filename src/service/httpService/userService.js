import httpService from '../httpService'

async function login  (context, postData) {
  try {
    let response = await httpService(context, BACKEND_URL.LOGIN, 'post', postData, true)
    return response.body
  } catch (exception) {
    return {code: 100, exception: exception}
  }
}

export default {
  login
}
