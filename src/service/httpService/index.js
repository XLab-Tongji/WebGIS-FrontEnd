async function request (context, url = '', method = 'get', data = {}, isEmulareJson = false) {
  method = method.toUpperCase()
  url = baseUrl + url
  console.log(method, url)

  let header = null
  switch (method) {
    case 'GET':
      header = { emulateJSON: true}
      return context.$http.get(url, header)
    case 'POST':
      if (isEmulareJson) {
        header = { emulateJSON: true }
      }
      return context.$http.post(url, data, header)
    case 'PATCH':
      return context.$http.patch(url)
    default:
      return null
  }
}

export default request
