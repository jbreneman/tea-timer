'use strict';

import Vue from 'vue';
import './modules/filters';
import { store } from './modules/store';
import VueTouch from 'vue-touch';
import * as storage from './modules/storage';
import * as config from './config';
import { initializeSounds } from './util/sounds';

// Components
import { App } from './components/app';

Vue.use(VueTouch, { name: 'v-touch' })

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
	    .register('./sw.js')
	    .then((reg) => {
	    	store.state.worker = reg;
	    })
	    .catch((err) => {
	        console.warn('Error whilst registering service worker', err);
	    });
}

// Test for notifications and ask if not already asked
if('Notification' in window) {
	if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
		Notification.requestPermission((permission) => {
			if (permission === 'granted') {
				store.commit('updatePermissions', { notifications: true });
			} else {
				store.commit('updatePermissions', { notifications: false });
			}
		});
	}
}

const vm = new Vue({
	el: '#app',
	store,
	components: { App },
	template: `
		<App/>
	`,
	beforeCreate: function() {
		if (+storage.get('version') !== config.version) {
			storage.set('timers', config.dummy);
			storage.set('version', config.version);
		}
	},
	mounted: function() {
		storage.set('version', config.version);
		store.commit('updateSizes', { width: this.$el.querySelector('.timer__body').offsetWidth, height: this.$el.querySelector('.timer__body').offsetHeight })
		this.$el.style.height = `${ this.$el.offsetHeight }px`;
		this.$el.style.width = `${ this.$el.offsetWidth }px`;

		// Initialize audio element
		// Needed for mobile blink browsers because they won't let
		// you just load and play a sound file
		initializeSounds([store.state.sound.piano]);
	}
});