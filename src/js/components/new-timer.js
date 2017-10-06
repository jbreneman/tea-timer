export const newTimer = {
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
        addNewTimer(timer) {
            this.$store.commit('setTimer', timer);
        }
    },
    template: `
        <button class="timer-opts__new" @click="addNewTimer(newTimer)">
            <slot>New Timer</slot>
        </button>
    `
};