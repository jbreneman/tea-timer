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
				amount: '3:00',
				desc: 'Tea -- long timer'
			}]
		},
		template: `
		<timer-title></timer-title>
		<countdown :current-time="currentTime"></countdown>
		<options :nav-options="navOptions" :active-nav="activeNav" :timers="timers"></options>`,
		replace: false,
		events: {
			'nav:update': function(opt) {
				this.activeNav = opt;
			}
		}
	});
}