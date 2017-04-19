'use strict';

import Vue from './libs/vue';
import './modules/filters';
import './modules/templates';
import { store } from './modules/store';
import VueTouch from 'vue-touch'

Vue.use(VueTouch, {name: 'v-touch'})

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
		store.commit('updateSizes', { width: this.$el.querySelector('.timer__body').offsetWidth, height: this.$el.querySelector('.timer__body').offsetHeight })
		this.$el.style.height = `${ this.$el.offsetHeight }px`;
		this.$el.style.width = `${ this.$el.offsetWidth }px`;
	}
});