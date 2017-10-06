import { mapState } from 'vuex';

// Components
import { toggle } from './toggle';

export const preferences = {
    data() {
        return {
            currentTheme: this.$store.state.themes.filter(theme => theme.active)[0].name
        };
    },
    computed: mapState({
        permissions: state => state.permissions,
        themes: state => state.themes
    }),
    watch: {
        currentTheme() {
            this.$store.commit('updateTheme', { theme: this.currentTheme });
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
            
            <div class="timer-item">
                <div class="timer-select__wrap">
                    <span class="timer-input__label-wrap">
                        <span class="timer-input__label">Theme</span>
                    </span>
                    <select v-model="currentTheme" class="timer-select">
                        <option v-for="theme in themes">{{ theme.name }}</option>
                    </select>
                </div>
            </div>
        </section>
    `
};