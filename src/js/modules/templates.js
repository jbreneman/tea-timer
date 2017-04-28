import Vue from 'vue';
import * as util from './util';
import throttle from 'lodash/throttle';

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
            <div class="timer-countdown__controls">
                <reset-button :timer="activeTimer"></reset-button>
                <play-button :timer="activeTimer"></play-button>
            </div>
        </section>
    `
});

Vue.component('reset-button', {
    props: ['timer'],
    methods: {
        resetTimer: function(n) {
            this.$store.commit('setTimer', { id: this.timer.id, countdown: this.timer.amount });
        }
    },
    template: `
        <button class="timer-countdown__button" @click="resetTimer">
            <svg class="icon icon-reset" viewBox="0 0 32 32">
                <path d="M24 18c0 4.414-3.586 8-8 8s-8-3.586-8-8 3.586-8 8-8h4l0.023 4.020 6.012-6.020-6.012-6v4h-4.023c-6.625 0-12 5.375-12 12s5.375 12 12 12 12-5.375 12-12h-4z"></path>
            </svg>
        </button>
    `
});

Vue.component('play-button', {
    props: ['timer'],
    computed: {
        playing() {
            return this.timer.playing && this.$store.state.interval;
        }
    },
    template: `
        <button class="timer-countdown__button" @click="toggleTimer(timer.id)">
            <svg class="icon icon-arrow" viewBox="0 0 64 64" :class="{ playing: playing }">
                <path d="m 10.966268,58.441755 0,-25.628195 0,-25.6281938 L 33.160936,19.999464 55.355602,32.81356 33.160934,45.627658 Z" />
            </svg>
            <svg class="icon icon-pause" viewBox="0 0 32 32" :class="{ playing: playing }">
                <path d="M4 4h10v24h-10zM18 4h10v24h-10z"></path>
            </svg>
        </button>
    `,
    methods: {
        toggleTimer: function(id) {
            this.$store.commit('toggleTimer', { id: id });
        }
    }
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
                return `calc(${ this.$store.state.settings.height }px - 4rem)`;
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
            <options-section v-if="activeNav === 'timers'">
                <transition-group name="slide-up" tag="div">
                    <timer-item v-for="timer in timers" :timer="timer" :key="timer.id"></timer-item>
                </transition-group>
                <new-timer>Add new timer</new-timer>
            </options-section>
            <options-section v-if="activeNav === 'options'">
                <preferences></preferences>
            </options-section>
        </section>
    `
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
    	<section class="timer-opts__section">
    		<slot></slot>
    	</section>
    `
});

Vue.component('new-timer', {
    computed: {
        newTimer() {
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
                playing: false,
                editing: true
            }
        }
    },
    methods: {
        addNewTimer: function(timer) {
            this.$store.commit('setTimer', timer);
        }
    },
    template: `
        <button class="timer-opts__new" @click="addNewTimer(newTimer)">
            <slot>New Timer</slot>
        </button>
    `
});

Vue.component('timer-item', {
	props: ['timer'],
    data: function() {
        return {
            swiped: 0,
            transition: false,
            height: 'auto'
        }
    },
    computed: {
        swapped() {
            return (100 - this.swiped);
        }
    },
    methods: {
        pan: function($event) {
            if ($event.angle > 135 || $event.angle < -135) {
                const num = Math.abs(Math.round($event.distance / 2));
                this.swiped = num < 100 ? num : 100;
            }
        },
        panend: function($event) {
            const velocity = Math.abs(Math.round($event.velocity));
            if (this.swiped === 100 || velocity >= 2) {
                this.$store.commit('removeTimer', { id: this.timer.id });
            } else {
                this.transition = true;
                this.swiped = 0;
            }
        }
    },
	template: `
        <v-touch class="timer-item"
            v-on:pan="pan"
            v-on:panend="panend"
            v-bind:pan-options="{ direction: 'left', threshold: 20 }"
            :style="{ transform: 'translate3d(-' + swiped + 'px, 0, 0)', opacity: (swapped / 100) }"
            :class="{ transition: transition }">
            <section class="timer-item__about" :class="{ blurred: timer.editing }">
                <amount :timer="timer"></amount>
                <description :timer="timer"></description>
            </section>
            <go-button :timer="timer" :class="{ blurred: timer.editing }"></go-button>
            <edit-time :timer="timer" :class="{ active: timer.editing }"></edit-time>
        </v-touch>
    `,
    components: {
    	'amount': {
    		props: ['timer'],
    		computed: {
    			minutes() {
                    return util.formatTime(this.timer.amount, true)['minutes'];
                },
                seconds() {
                    return util.formatTime(this.timer.amount, true)['seconds'];
                }
    		},
    		template: `
        		<div class="timer-item__time" @click="showEdit()">
                    <span class="timer-item__amount timer-item__minutes">{{ minutes }}</span><span class="timer-item__separator">:</span><span class="timer-item__amount timer-item__seconds">{{ seconds }}</span>
        		</div>`,
    		methods: {
    			showEdit: function() {
                    this.$store.commit('setTimer', { id: this.timer.id, editing: true });
    			}
    		}
    	},
    	'description': {
    		props: ['timer'],
    		template: `<div class="timer-item__desc" contenteditable="true" @input="newInput">{{ timer.desc }}</div>`,
    		methods: {
    			newInput: function(e) {
                    this.$store.commit('setTimer', { id: this.timer.id, desc: e.target.innerText });
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
    		</button>
            `,
            methods: {
                toggleTimer: function(id) {
                    this.$store.commit('toggleTimer', { id: id });
                }
            }
    	},
        'edit-time': {
            props: ['timer'],
            data: function() {
                return {
                    minutes: Math.floor(this.timer.amount / 60),
                    seconds: this.timer.amount % 60
                }
            },
            methods: {
                saveTime() {
                    const amount = (this.minutes * 60) + this.seconds;
                    this.$store.commit('setTimer', { id: this.timer.id, amount: amount, countdown: amount, editing: false });
                },
                onPan: throttle(function(mutation, $event) {
                    if ($event.additionalEvent === 'panup') {
                        this[mutation.prop] = this[mutation.prop] + 1 < mutation.max ? this[mutation.prop] + 1 : mutation.max;
                    } else if($event.additionalEvent === 'pandown') {
                        this[mutation.prop] = this[mutation.prop] - 1 > 0 ? this[mutation.prop] - 1 : 0;
                    }
                }, 40)
            },
            template: `
                <v-touch class="timer-edit"
                    v-on:swipe="saveTime"
                    v-bind:swipe-options="{ direction: 'right', threshold: 20 }">
                    <span class="timer-edit__title"></span>
                    <v-touch class="timer-edit__spinner"
                        v-on:pan="onPan({ prop: 'minutes', max: 99 }, $event)"
                        v-bind:pan-options="{ direction: 'vertical', threshold: 0 }">
                        <span class="timer-edit__spinner-item timer-edit__spinner-item--bold">{{ minutes | leadingZero }}</span>
                    </v-touch>
                    <span class="timer-edit__separator">:</span>
                    <v-touch class="timer-edit__spinner"
                        v-on:pan="onPan({ prop: 'seconds', max: 59 }, $event)"
                        v-bind:pan-options="{ direction: 'vertical', threshold: 0 }">
                        <span class="timer-edit__spinner-item">{{ seconds | leadingZero }}</span>
                    </v-touch>
                    <button class="timer-item__button" @click="saveTime">
                        <svg class="icon-check" viewBox="0 0 32 32">
                            <path d="M27 4l-15 15-7-7-5 5 12 12 20-20z"></path>
                        </svg>
                    </button>
                </v-touch>
            `
        }
    }
});

Vue.component('preferences', {
    computed: {
        permissions() {
            return this.$store.state.permissions;
        }
    },
    template: `
        <section class="timer-preferences">
            <div class="timer-item">
                <toggle :label="'Notifications'" :permission="'notifications'"></toggle>
            </div>
        </section>
    `
});

Vue.component('toggle', {
    props: ['label', 'permission'],
    computed: {
        id() {
            return `toggle--${ this.permission }`;
        },
        active() {
            return this.$store.state.permissions[this.permission];
        }
    },
    methods: {
        togglePermission() {
            this.$store.commit('togglePermission', { prop: this.permission })
        }
    },
    template: `
        <div class="timer-input__toggle">
            <input :id="id" type="checkbox" class="timer-input__checkbox" :checked="active" @change="togglePermission()">
            <label :for="id" class="timer-input__label-wrap">
                <span class="timer-input__label">{{ label }}</span>
                <span class="timer-input__toggler-wrap">
                    On <span class="timer-input__toggler"></span> Off
                </span>
            </label>
        </div>
    `
});
