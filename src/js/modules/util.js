function formatTime(seconds) {
	let time = {};

	time.minutes = Math.floor(seconds / 60).toString();
	time.seconds = seconds % 60;
	time.seconds = time.seconds < 10 ? '0' + time.seconds.toString() : time.seconds.toString();
	
	return time;
}

export { formatTime };