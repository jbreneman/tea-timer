import * as util from '../util';
import throttle from 'lodash/throttle';

export const timerItem = {
	props: ['timer'],
    data() {
        return {
            swiped: 0,
            transition: false,
            height: 'auto'
        };
    },
    computed: {
        swapped() {
            return (100 - this.swiped);
        }
    },
    methods: {
        pan($event) {
            if ($event.angle > 135 || $event.angle < -135) {
                const num = Math.abs(Math.round($event.distance / 2));
                this.swiped = num < 100 ? num : 100;
            }
        },
        panend($event) {
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
    			showEdit() {
                    this.$store.commit('setTimer', { id: this.timer.id, editing: true });
    			}
    		}
    	},
    	'description': {
    		props: ['timer'],
    		template: `<div class="timer-item__desc" contenteditable="true" @input="newInput">{{ timer.desc }}</div>`,
    		methods: {
    			newInput(e) {
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
                toggleTimer(id) {
                    this.$store.commit('toggleTimer', { id: id });
                }
            }
    	},
        'edit-time': {
            props: ['timer'],
            data() {
                return {
                    minutes: Math.floor(this.timer.amount / 60),
                    seconds: this.timer.amount % 60
                };
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
};