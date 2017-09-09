import Vue from 'vue';
import Vuex from 'vuex';
import * as storage from './storage';
import * as config from '../config';
import { playChord } from './util';

Vue.use(Vuex);

const notifications = 'Notification' in window && Notification.permission === 'granted';

const store = new Vuex.Store({
	state: {
		settings: {
			height: 0,
			width: 0
		},
		permissions: storage.get('permissions') || { notifications: notifications, sound: false },
		worker: null,
		navOptions: ['timers', 'options'],
		activeNav: 'timers',
		interval: null,
		timers: storage.get('timers')
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
			const playing = state.timers.filter(timer => timer.id === mutation.id)[0];
			
			if (playing && playing.playing && state.interval) {
				window.clearInterval(state.interval);
				playing.playing = false;
			}

			if (state.timers && state.timers.filter(timer => timer.id === mutation.id).length > 0) {
				state.timers.forEach((timer, index) => {
					if (timer.id === mutation.id) {
						Object.keys(mutation).forEach(function(key) {
						    timer[key] = mutation[key];
						});
					}
				});
			} else {
				state.timers.push(mutation);
			}

			storage.set('timers', state.timers);
		},
		removeTimer(state, mutation) {
			const index = state.timers.map(timer => timer.id).indexOf(mutation.id);

			if (index !== -1) {
				state.timers.splice(index, 1);
				storage.set('timers', state.timers);
			}
		},
		toggleTimer(state, mutation) {
			const playing = state.timers.filter(timer => timer.id === mutation.id)[0];

			if (playing && playing.playing && state.interval) {
				window.clearInterval(state.interval);
				playing.playing = false;
			} else {
				window.clearInterval(state.interval);
				state.timers.forEach((timer) => {
					timer.active = timer.id === mutation.id;
					timer.playing = timer.id === mutation.id;
				});

				const active = state.timers.filter(timer => timer.active)[0];
				active.times = active.times || {};
				active.times.end = Date.now() + (active.countdown * 1000);
				state.interval = window.setInterval(() => {
					if (active.countdown > 0) {
						active.countdown = Math.ceil((active.times.end - Date.now()) / 1000);
						storage.set('timers', state.timers);
					} else {
						window.clearInterval(state.interval);
						active.playing = false;
						active.countdown = active.amount;
						storage.set('timers', state.timers);

						if (state.permissions.notifications) {
							state.worker.showNotification(playing.desc, {
								icon: './assets/images/icon-48.png',
								body: 'Timer has ended',
								noscreen: false
							});
						}

						if (state.permissions.sound) {

							playChord([notes['E4'], notes['G#4'], notes['B4']], 500)
								.then(() => {
									return playChord([notes['D4'], notes['F#4'], notes['A4']], 500);
								})
								.then(() => {
									return playChord([notes['F#4'], notes['A4'], notes['C#4']], 500);
								});
						}
					}
				}, 16);
			}
		},
		updatePermissions(state, mutation) {
			Object.keys(mutation).forEach(function(key) {
			    state.permissions[key] = mutation[key];
			});
			storage.set('permissions', state.permissions);
		},
		togglePermission(state, mutation) {
			state.permissions[mutation.prop] = !state.permissions[mutation.prop];

			if (state.permissions[mutation.prop] && 'Notification' in window && Notification.permission !== 'granted') {
				Notification.requestPermission((permission) => {
					if (permission !== 'granted') {
						state.commit.updatePermissions({ notifications: false });
					}
				});
			}
			storage.set('permissions', state.permissions);
		}
	}
});

export { store };