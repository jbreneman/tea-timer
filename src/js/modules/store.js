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
		},
		{
			id: 2,
			amount: 240,
			desc: 'Tea -- short timer'
		}]
	},
	mutations: {
		navUpdate(state, mutation) {
			state.activeNav = mutation;
		},
		setTimer(state, mutation) {
			state.timers = state.timers.forEach((timer, index) => {
				state.timers[index] = timer.id === mutation.id ? mutation : timer;
			});
		}
	}
});

export { store };