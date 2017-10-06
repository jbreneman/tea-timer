export const optionsNav = {
	props: {
        navOptions: {
            type: Array,
            required: true
        },
        activeNav: {
            type: String,
            required: true
        }
    },
	template: `
	<nav class="timer-opts__nav">
        <button class="timer-opts__link" :class="{ 'active': activeNav === option }" @click="changeNav(option)" v-for="option in navOptions">{{ option }}</button>
        <span class="timer-opts__fill"></span>
    </nav>`,
    methods: {
    	changeNav(opt) {
            this.$store.commit('navUpdate', opt);
    	}
    }
};