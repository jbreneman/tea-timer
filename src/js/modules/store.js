import Vue from '../libs/vue';
import Vuex from '../libs/vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		settings: {
			height: 0,
			width: 0
		},
		navOptions: ['timers', 'options'],
		activeNav: 'timers',
		interval: null,
		timers: [{
			id: 1,
			amount: 180,
			countdown: 180,
			desc: 'Tea -- long timer',
			active: false,
			playing: false
		},
		{
			id: 2,
			amount: 240,
			countdown: 240,
			desc: 'Tea -- short timer',
			active: false,
			playing: false
		}]
	},
	mutations: {
		updateSizes(state, mutation) {
			state.settings.width = mutation.width;
			state.settings.height = mutation.height;
		},
		navUpdate(state, mutation) {
			state.activeNav = mutation;
		},
		setTimer(state, mutation) {
			state.timers.forEach((timer, index) => {
				state.timers[index] = timer.id === mutation.id ? mutation : timer;
			});
		},
		startTimer(state, mutation) {
			window.clearInterval(state.interval);
			state.timers.forEach((timer) => {
				timer.active = timer.id === mutation.id;
				timer.playing = timer.id === mutation.id;
			});

			const active = state.timers.filter(timer => timer.active)[0];
			state.interval = window.setInterval(()=> {
				if (active.countdown > 0) {
					active.countdown--;
				} else {
					window.clearInterval(state.interval);
				}
			}, 1000);
		}
	}
});

export { store };