'use strict';

import Vue from 'vue';
import './modules/filters';
import './modules/templates';
import { store } from './modules/store';
import VueTouch from 'vue-touch';
import * as storage from './modules/storage';
import * as config from './config';

Vue.use(VueTouch, {name: 'v-touch'})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('./sw.js')
    .then(function(reg) {
        console.log('Successfully registered service worker', reg);
    })
    .catch(function(err) {
        console.warn('Error whilst registering service worker', err);
    });
}

window.addEventListener('online', function(e) {
    console.log("You are online");
}, false);

window.addEventListener('offline', function(e) {
    console.log("You are offline");
}, false);

if (navigator.onLine) {
} else {
}

const vm = new Vue({
	el: '#app',
	store,
	template: `
		<div id="app" class="timer">
			<timer-title></timer-title>
			<section class="timer__body">
				<countdown></countdown>
				<options></options>
			</section>
		</div>
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
	}
});