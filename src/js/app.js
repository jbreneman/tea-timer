'use strict';

import Vue from './libs/vue';
import './modules/templates';

{
	const vm = new Vue({
		el: '#app',
		data: {
			currentTime: '3:24',
			navOptions: ['timers', 'options'],
			activeNav: 'timers',
			timers: [{
				id: 1,
				amount: 180,
				desc: 'Tea -- long timer'
			}]
		},
		template: `
		<timer-title></timer-title>
		<countdown :current-time="currentTime"></countdown>
		<options :nav-options="navOptions" :active-nav="activeNav" :timers.sync="timers"></options>`,
		replace: false,
		events: {
			'nav:update': function(val) {
				this.activeNav = val;
			},
			'timer:update': function(val) {
				//update amount in store
			}
		}
	});
}