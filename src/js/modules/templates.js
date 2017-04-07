import Vue from '../libs/vue';
import Vuex from '../libs/vuex';
import store from '../modules/store';
import * as util from './util';

Vue.component('timer-title', {
	template: `
	<div class="timer-title">
        <h1 class="timer-title__heading">
            <span class="timer-title__small">(tea)</span>timer
        </h1>
    </div>`
});

Vue.component('countdown', {
	computed: {
		currentTime() {
			return this.$store.state.currentTime;
		}
	},
	template: `
	<section class="timer-countdown">
        <div class="timer-countdown__text">{{ currentTime }}</div>
    </section>`
});

Vue.component('options', {
    computed: {
        navOptions() {
            return this.$store.state.navOptions;
        },
        activeNav() {
            return this.$store.state.activeNav;
        },
        timers() {
            return this.$store.state.timers;
        }
    },
	template: `
	<section class="timer-opts">
        <options-nav :nav-options="navOptions" :active-nav="activeNav"></options-nav>
        <options-section-timer :timers="timers" :class="{ 'active': activeNav === 'timers' }"></options-section-timer>
        <options-section :class="{ 'active': activeNav === 'options' }"></options-section>
    </section>`
});

Vue.component('options-nav', {
	props: ['navOptions', 'activeNav'],
	template: `
	<nav class="timer-opts__nav">
        <button class="timer-opts__link" :class="{ 'active': activeNav === option }" @click="changeNav(option)" v-for="option in navOptions">{{ option }}</button>
    </nav>`,
    methods: {
    	changeNav: function(opt) {
            this.$store.commit('navUpdate', opt);
    	}
    }
});

Vue.component('options-section', {
	props: ['timers'],
	template: `
	<div class="timer-opts__section">
		options
	</section>`
});

Vue.component('options-section-timer', {
	props: ['timers'],
	template: `
	<div class="timer-opts__section">
		<timer-item v-for="timer in timers" :timer="timer"></timer-item>
	</section>`
});

Vue.component('timer-item', {
	props: ['timer'],
	template: `
	<div class="timer-item">
        <amount :timer="timer"></amount>
        <description :timer="timer"></description>
        <go-button></go-button>
    </div>`,
    components: {
    	'amount': {
    		props: ['timer'],
    		data: function() {
    			return {
    				inputMinutes: util.formatTime(this.timer.amount)['minutes'],
    				inputSeconds: util.formatTime(this.timer.amount)['seconds']
    			}
    		},
    		template: `
    		<div class="timer-item__time">
    		<input type="text" class="timer-item__amount timer-item__minutes" v-model="inputMinutes">:<input type="text" class="timer-item__amount timer-amount__seconds" v-model="inputSeconds">
    		</div>`,
    		watch: {
    			inputMinutes: function(val) {
    				const amount = parseInt(this.inputMinutes) * 60 + parseInt(this.inputSeconds);
    				this.$emit('timer:update', { id: this.timer.id, amount: +amount, desc: this.timer.desc });
    			},
    			inputSeconds: function(val) {
    				const amount = parseInt(this.inputMinutes) * 60 + parseInt(this.inputSeconds);
    				this.$emit('timer:update', { id: this.timer.id, amount: +amount, desc: this.timer.desc });
    			}
    		}
    	},
    	'description': {
    		props: ['timer'],
    		template: `<div class="timer-item__desc" contenteditable="true" @input="newInput">{{ timer.desc }}</div>`,
    		methods: {
    			newInput: function(e) {
    				this.$emit('timer:update', { id: this.timer.id, amount: this.timer.amount, desc: e.target.innerText });
    			}
    		}
    	},
    	'go-button': {
    		template: `
    		<button class="timer-item__button">
    		    <svg class="icon-arrow" viewBox="0 0 64 64">
    		        <path d="m 10.966268,58.441755 0,-25.628195 0,-25.6281938 L 33.160936,19.999464 55.355602,32.81356 33.160934,45.627658 Z" />
    		    </svg>
    		</button>`
    	}
    }
});
