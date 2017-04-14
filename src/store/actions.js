import * as types from './mutation-types'

console.log(types)

//错误的回调 之后需要请求api时会用到
const errCb = errmsg => {
	console.info(errmsg);
	alert(errmsg);
}

export const login = ({dispatch}, userName, userPassword) => {
    	dispatch(types.LOG_IN, userName, userPassword);
}

export const logout = ({dispatch}) => {
    	dispatch(types.LOG_OUT);
}
