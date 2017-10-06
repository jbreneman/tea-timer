export const toggle = {
    props: {
        label: {
            type: String,
            required: true
        },
        permission: {
            type: String,
            required: true
        }
    },
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
};