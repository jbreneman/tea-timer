import * as util from '../util';

// Components
import { resetButton } from './reset-button';
import { playButton } from './play-button';

export const countdown = {
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
    components: { resetButton, playButton },
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
};