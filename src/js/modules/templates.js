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
            return this.activeTimer && this.activeTimer.playing && this.$store.state.interval;
        },
        activeTimer() {
            return this.$store.state.timers.filter(timer => timer.active)[0] || false;
        },
        height() {
            if (this.active && this.activeTimer) {
                return `${ this.$store.state.settings.height * .33 }px`;
            } else if(this.activeTimer && !this.active) {
                return `4rem`;
            } else {
                return `0`;
            }
        },
        formattedTotal() {
            const formatted = util.formatTime(this.activeTimer.amount);
            return `${ formatted.minutes }:${ formatted.seconds }`;
        },
        formattedCountdown() {
            const formatted = util.splitTime(this.activeTimer.countdown);
            return `<span class="timer-countdown__character-wrap timer-countdown__character-wrap--left">${ formatted.minutes }</span><span class="timer-countdown__center">:</span><span class="timer-countdown__character-wrap timer-countdown__character-wrap--right">${ formatted.seconds }</span>`;
        }
	},
	template: `
    	<section class="timer-countdown" :style="{ height: height }" :class="{ 'timer-countdown--narrow': activeTimer && !active }">
            <div class="timer-countdown__content" v-if="activeTimer">
                <div class="timer-countdown__text" v-html="formattedCountdown"></div>
            </div>
        </section>
    `
});

Vue.component('options', {
    computed: {
        active() {
            return this.$store.state.interval !== null;
        },
        activeTimer() {
            return this.$store.state.timers.filter(timer => timer.active)[0] || false;
        },
        height() {
            if (this.active && this.activeTimer) {
                return `${ this.$store.state.settings.height * .67 }px`;
            } else if(this.activeTimer && !this.active) {
                return `calc(${ this.$store.state.settings.height } - 4rem)`;
            } else {
                return `0`;
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
        <go-button :timer="timer"></go-button>
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
            props: ['timer'],
            computed: {
                playing() {
                    return this.timer.playing && this.$store.state.interval;
                }
            },
    		template: `
    		<button class="timer-item__button" @click="toggleTimer(timer.id)">
    		    <svg class="icon-arrow" viewBox="0 0 64 64" :class="{ playing: playing }">
    		        <path d="m 10.966268,58.441755 0,-25.628195 0,-25.6281938 L 33.160936,19.999464 55.355602,32.81356 33.160934,45.627658 Z" />
    		    </svg>
                <svg class="icon-pause" viewBox="0 0 32 32" :class="{ playing: playing }">
                    <path d="M4 4h10v24h-10zM18 4h10v24h-10z"></path>
                </svg>
    		</button>`,
            methods: {
                toggleTimer: function(id) {
                    this.$store.commit('toggleTimer', { id: id });
                }
            }
    	}
    }
});
