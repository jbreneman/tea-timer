// Components
import { optionsNav } from './options-nav';
import { optionsSection } from './options-section';
import { timerItem } from './timer-item';
import { newTimer } from './new-timer';
import { preferences } from './preferences';

export const options = {
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
    components: { optionsNav, optionsSection, timerItem, newTimer, preferences },
	template: `
    	<section class="timer-opts" :style="{ height: height }">
            <options-nav :nav-options="navOptions" :active-nav="activeNav"></options-nav>
            <options-section v-if="activeNav === 'timers'">
                <transition-group name="slide-up" tag="div">
                    <timer-item v-for="(timer, index) in timers" :timer="timer" :key="index"/>
                </transition-group>
                <new-timer>Add new timer</new-timer>
            </options-section>
            <options-section v-if="activeNav === 'options'">
                <preferences></preferences>
            </options-section>
        </section>
    `
};