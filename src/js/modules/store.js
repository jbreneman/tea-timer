import Vue from '../libs/vue';
import Vuex from '../libs/vuex';
import * as storage from './storage';

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
		timers: storage.get('timers') || [{"id":1,"amount":20,"countdown":19,"desc":"Tea -- long timer","active":false,"playing":false},{"id":2,"amount":240,"countdown":240,"desc":"Tea -- short timer","active":true,"playing":false},{"id":3,"amount":20,"countdown":20,"desc":"HI"}]
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
			if (state.timers && state.timers.filter(timer => timer.id === mutation.id).length > 0) {
				state.timers.forEach((timer, index) => {
					state.timers[index] = timer.id === mutation.id ? mutation : timer;
				});
			} else {
				state.timers.push(mutation);
			}

			storage.set('timers', state.timers);
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
					storage.set('timers', state.timers);
				} else {
					window.clearInterval(state.interval);
					active.playing = false;
					active.countdown = active.amount;
					storage.set('timers', state.timers);
				}
			}, 1000);
		}
	}
});

export { store };