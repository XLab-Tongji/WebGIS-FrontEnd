import {
	LOG_IN,
  LOG_OUT
} from '../mutation-types'

const state = {
  login: false,
	userName: "",
}

const mutations = {
	[LOG_IN] (state, userName){
	  state.login = true
		state.userName = userName

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
