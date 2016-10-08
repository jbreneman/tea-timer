module.exports = {
	formatTime: function(seconds) {
		let time = {};

		time.minutes = Math.floor(seconds / 60);
		time.seconds = seconds % 60;
		
		return time;
	}
}