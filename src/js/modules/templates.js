const Vue = require('../libs/vue');
const util = require('./util');

Vue.component('timer-title', {
	template: `
	<div class="timer-title">
        <h1 class="timer-title__heading">
            <span class="timer-title__small">(tea)</span>timer
        </h1>
    </div>`
});

Vue.component('countdown', {
	props: ['currentTime'],
	template: `
	<section class="timer-countdown">
        <div class="timer-countdown__text">{{ currentTime }}</div>
    </section>`
});

Vue.component('options', {
	props: ['navOptions', 'activeNav', 'timers'],
	template: `
	<section class="timer-opts">
        <options-nav :nav-options="navOptions" :active-nav="activeNav"></options-nav>
        <options-section-timer :timers.sync="timers" :class="{ 'active': activeNav === 'timers' }"></options-section-timer>
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
    		this.$dispatch('nav:update', opt);
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
		<timer-item v-for="timer in timers" :timer.sync="timer"></timer-item>
	</section>`
});

Vue.component('timer-item', {
	props: ['timer'],
	template: `
	<div class="timer-item">
        <amount :timer.sync="timer"></amount>
        <description :timer.sync="timer"></description>
        <go-button></go-button>
    </div>`,
    components: {
    	'amount': {
    		props: ['timer'],
    		data: {
    			inputMinutes: this.inputMinutes,
    			inputSeconds: this.inputSeconds
    		},
    		computed: {
    			minutes: function() {
    				const time = util.formatTime(this.timer.amount);
    				return time.minutes;
    			},
    			seconds: function() {
    				const time = util.formatTime(this.timer.amount);
    				return time.seconds;
    			},
    			total: function() {
    				return this.inputMinutes * 60 + this.inputSeconds;
    			}
    		},
    		template: `<input type="text" class="timer-item__amount" v-model="inputMinutes" value="{{ minutes }}">:<input type="text" class="timer-item__amount" value="{{ seconds }}" v-model="inputSeconds">`,
    		watch: {
    			inputMinutes: function(val) {
    				this.inputMinutes = val;
    			}
    		}
    	},
    	'description': {
    		props: ['timer'],
    		template: `<div class="timer-item__desc" contenteditable="true" @input="newInput">{{ timer.desc }}</div>`,
    		methods: {
    			newInput: function(e) {
    				this.$dispatch('timer:update', { id: this.timer.id, amount: this.timer.amount, desc: e.target.innerText });
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
