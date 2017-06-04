
export const userStatus = state => {
  return {
    login: state.session.login
  }
}

export const userInfo = state => {
  return {
    userName: state.session.userName,
  }
}
