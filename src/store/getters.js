export const userInfo = state => {
  return {
    userName: state.session.userName,
    userPassword: state.session.userPassword
  }
}

export const isLoggedIn = state => {
  return state.session.userName != ''
}
