'use strict';

import Vue from './libs/vue';
import './modules/templates';
import { store } from './modules/store';

const vm = new Vue({
	el: '#app',
	store,
	template: `
		<div id="app" class="timer">
			<timer-title></timer-title>
			<countdown></countdown>
			<options></options>
		</div>`,
	ready: function() {
		this.on('timer:update', function(val) {
			let timers = this.timers.splice(0);

			console.log('here');
			timers.forEach((timer, index) => {
				timers[index] = timer.id === val.id ? val : timer;
			});

			this.timers = timers;
		});
	}
});