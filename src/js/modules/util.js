export const formatTime = (seconds, leadingZeroMinute = false) => {
	let time = {};

	time.minutes = Math.floor(seconds / 60).toString();
	if (leadingZeroMinute) {
		time.minutes = time.minutes < 10 ? '0' + time.minutes : time.minutes;
	}
	time.seconds = seconds % 60;
	time.seconds = time.seconds < 10 ? '0' + time.seconds.toString() : time.seconds.toString();
	
	return time;
}

function wrapCharacters(str, className = null) {
	return str
		.split('')
		.map((val) => {
			if (className) {
				return `<span class="${ className }">${ val }</span>`;
			}
			return `<span>${ val }</span>`;
		})
		.join('');
}

export const splitTime = (seconds) => {
	const time = formatTime(seconds, true);

	return {
		minutes: wrapCharacters(time.minutes, 'timer-countdown__character'),
		seconds: wrapCharacters(time.seconds, 'timer-countdown__character')
	}
}
