export const resetButton = {
    props: {
        timer: {
            type: Object,
            required: true,
            validator(value) {
                return value.hasOwnProperty('id') && value.hasOwnProperty('amount');
            }
        }
    },
    methods: {
        resetTimer() {
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
};