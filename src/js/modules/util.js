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

const createChord = (context, frequencies) => {
	return frequencies.map((frequency) => {
		const oscillator = context.createOscillator();
		oscillator.frequency.value = frequency;
		oscillator.type = 'triangle';
		oscillator.connect(context.destination);

		return oscillator;
	});
};

export const playChord = (chord, speed = 500) => {
	return new Promise((resolve, reject) => {
		const context = new AudioContext();

		createChord(context, chord).forEach((note, index) => {
			note.start(index / 4 * (speed / 1000));
			note.stop(speed / 1000);
		});

		window.setTimeout(() => {
			context.close();
			resolve();
		}, speed);
	});
};
