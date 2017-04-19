import Vue from '../libs/vue';

Vue.filter('leadingZero', function (value) {
	return value < 10 ? '0' + value : value;
});