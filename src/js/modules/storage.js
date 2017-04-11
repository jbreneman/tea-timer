import isString from '../libs/lodash/isString';

function get(key, isObject = true) {
	if (isString(key) && key !== '') {
		const val = localStorage.getItem(key);
		return isObject ? JSON.parse(val) : val;
	}
	console.error('storage.get: No key set.');
	return false;
}

function set(key, val, isObject = true) {
	if (isString(key) && key !== '' && val) {
		const str = isObject ? JSON.stringify(val) : val;
		return localStorage.setItem(key, str);
	}
	console.error('storage.set: No key or val set.');
	return false;
}

function del(key) {
	if (isString(key) && key !== '') {
		return localStorage.removeItem(key);
	}
	console.error('storage.del: No key set.');
	return false;
}

export { get, set, del };