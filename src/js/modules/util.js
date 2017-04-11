function formatTime(seconds) {
	let time = {};

	time.minutes = Math.floor(seconds / 60).toString();
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

function splitTime(seconds) {
	const time = formatTime(seconds);

	return {
		minutes: wrapCharacters(time.minutes, 'timer-countdown__character'),
		seconds: wrapCharacters(time.seconds, 'timer-countdown__character')
	}
}

export { formatTime, splitTime };