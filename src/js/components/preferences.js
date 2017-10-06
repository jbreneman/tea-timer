import { toggle } from './toggle';

export const preferences = {
    computed: {
        permissions() {
            return this.$store.state.permissions;
        }
    },
    components: { toggle },
    template: `
        <section class="timer-preferences">
            <div class="timer-item">
                <toggle :label="'Notifications'" :permission="'notifications'"></toggle>
            </div>

            <div class="timer-item">
                <toggle :label="'Play Sound'" :permission="'sound'"></toggle>
            </div>
        </section>
    `
};