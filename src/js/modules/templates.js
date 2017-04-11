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
        active() {
            return this.$store.state.interval !== null;
        },
        activeTimer() {
            return this.$store.state.timers.filter(timer => timer.active)[0] || null;
        },
        formattedTotal() {
            const formatted = util.formatTime(this.activeTimer.amount);
            return `${ formatted.minutes }:${ formatted.seconds }`;
        },
        formattedCountdown() {
            const formatted = util.splitTime(this.activeTimer.countdown);
            return `<span class="timer-countdown__character-wrap">${ formatted.minutes }</span>:<span class="timer-countdown__character-wrap">${ formatted.seconds }</span>`;
        }
	},
	template: `
    	<section class="timer-countdown">
            <div class="timer-countdown__content" v-if="active">
                <div class="timer-countdown__text" v-html="formattedCountdown"></div>
            </div>
        </section>
    `,
    updated: function() {
        if (this.active) {
            this.$el.style.height = `${ this.$store.state.settings.height * .33 }px`;
        } else {
            this.$el.style.height = `0`;
        }
    }
});

Vue.component('options', {
    computed: {
        active() {
            return this.$store.state.interval !== null;
        },
        height() {
            if (this.active) {
                return `${ this.$store.state.settings.height * .67 }px`;
            } else {
                return `${ this.$store.state.settings.height }px`;
            }
        },
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
	<section class="timer-opts" :style="{ height: height }">
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
        <span class="timer-opts__fill"></span>
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
	<section class="timer-opts__section options">
		options
	</section>`
});

Vue.component('options-section-timer', {
	props: ['timers'],
    computed: {
        emptyTimer() {
            let id = 0;

            if (this.$store.state.timers) {
                id = Math.max(...this.$store.state.timers.map(timer => timer.id)) + 1;
            }

            return {
                active: false,
                amount: 0,
                countdown: 0,
                desc: "New Timer",
                id: id,
                playing: false
            }
        }
    },
	template: `
	<section class="timer-opts__section">
		<timer-item v-for="timer in timers" :timer="timer" :key="timer.id"></timer-item>
        <timer-item :timer="emptyTimer" :key="emptyTimer.id"></timer-item>
	</section>`
});

Vue.component('timer-item', {
	props: ['timer'],
	template: `
	<div class="timer-item">
        <section class="timer-item__about">
            <amount :timer="timer"></amount>
            <description :timer="timer"></description>
        </section>
        <go-button :id="timer.id"></go-button>
    </div>`,
    components: {
    	'amount': {
    		props: ['timer'],
    		computed: {
    			minutes() {
                    return util.formatTime(this.timer.amount)['minutes'];
                },
                seconds() {
                    return util.formatTime(this.timer.amount)['seconds'];
                }
    		},
    		template: `
        		<div class="timer-item__time">
        		  <input type="number" min="0" max="59" class="timer-item__amount timer-item__minutes" :value="minutes" @input="inputMinutes()">:<input type="number" min="0" max="59" class="timer-item__amount timer-item__seconds" :value="seconds" @input="inputSeconds()">
        		</div>`,
    		methods: {
    			inputMinutes: function() {
    				const amount = parseInt(this.$el.querySelector('.timer-item__minutes').value) * 60 + parseInt(this.seconds);
                    this.$store.commit('setTimer', { id: this.timer.id, amount: +amount, countdown: +amount, desc: this.timer.desc });
    			},
    			inputSeconds: function() {
    				const amount = parseInt(this.minutes) * 60 + parseInt(this.$el.querySelector('.timer-item__seconds').value);
                    this.$store.commit('setTimer', { id: this.timer.id, amount: +amount, countdown: +amount, desc: this.timer.desc });
    			}
    		}
    	},
    	'description': {
    		props: ['timer'],
    		template: `<div class="timer-item__desc" contenteditable="true" @input="newInput">{{ timer.desc }}</div>`,
    		methods: {
    			newInput: function(e) {
                    this.$store.commit('setTimer', { id: this.timer.id, amount: this.timer.amount, countdown: this.timer.amount, desc:  e.target.innerText });
    			}
    		}
    	},
    	'go-button': {
            props: ['id'],
    		template: `
    		<button class="timer-item__button" @click="startTimer(id)">
    		    <svg class="icon-arrow" viewBox="0 0 64 64">
    		        <path d="m 10.966268,58.441755 0,-25.628195 0,-25.6281938 L 33.160936,19.999464 55.355602,32.81356 33.160934,45.627658 Z" />
    		    </svg>
    		</button>`,
            methods: {
                startTimer: function(id) {
                    this.$store.commit('startTimer', { id: id });
                }
            }
    	}
    }
});
