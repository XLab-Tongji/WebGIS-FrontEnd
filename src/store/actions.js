import * as types from './mutation-types'

//错误的回调 之后需要请求api时会用到
// const errCb = errmsg => {
// 	console.info(errmsg);
// 	alert(errmsg);
// }

export const login = ({commit}, userData) => {
  console.log(userData)
  commit(types.LOG_IN, userData);
}

export const logout = ({commit}) => {
  commit(types.LOG_OUT);
}
