export const playButton = {
    props: {
        timer: {
            type: Object,
            required: true,
            validator(value) {
                return value.hasOwnProperty('id');
            }
        }
    },
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
        toggleTimer(id) {
            this.$store.commit('toggleTimer', { id: id });
        }
    }
};