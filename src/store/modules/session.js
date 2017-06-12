import {
	LOG_IN,
  LOG_OUT
} from '../mutation-types'

const state = {
  login: localStorage.login || false,
	userName: localStorage.userName || null,
  userId: localStorage.userId || null
}

const mutations = {
	[LOG_IN] (state, userData){
	  state.login = true
		state.userName = userData.username
    state.userId = userData.userId
    localStorage.login = state.login
    localStorage.userName = state.userName
    localStorage.userId = state.userId
	},


	[LOG_OUT] (state){
    state.login = false
		state.userName = ""
	}
}

export default {
	state,
	mutations
}
