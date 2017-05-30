import httpService from '../htppService'

export const login = async (context, postData) => {
  try {
    let response = await httpService(context, BACKEND_LOGIN, 'post', postData)
    return {state: 0}
  } catch (exception) {
    return {state: 100, exception: exception}
  }
}
