import Vue from '../libs/vue';
import Vuex from '../libs/vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		currentTime: '3:24',
		navOptions: ['timers', 'options'],
		activeNav: 'timers',
		timers: [{
			id: 1,
			amount: 180,
			desc: 'Tea -- long timer'
		}]
	},
	mutations: {
		navUpdate(state, mutation) {
			state.activeNav = mutation;
		}
	}
});

export { store };