async function request (context, url = '', method = 'get', data = {}) {
  method = method.toUpperCase()
  url = baseUrl + url
  console.log(method, url)

  let header = null
  switch (method) {
    case 'GET':
      header = { emulateJSON: true}
      return context.$http.get(url, header)
    case 'POST':
      // header = { emulateJSON: true }
      return context.$http.post(url, data, header)
    default:
      return null
  }
}

export default request
