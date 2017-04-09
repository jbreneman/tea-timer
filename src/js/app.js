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
			<section class="timer__body">
				<countdown></countdown>
				<options></options>
			</section>
		</div>`,
	mounted: function() {
		this.$el.style.height = `${ this.$el.offsetHeight }px`;
		this.$el.style.width = `${ this.$el.offsetWidth }px`;
	},
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