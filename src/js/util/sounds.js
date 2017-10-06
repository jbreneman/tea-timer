const mediaPlaybackRequiresUserGesture = () => {
    // test if play() is ignored when not called from an input event handler
    var video = document.createElement('video');
    video.play();
    return video.paused;
}

const removeBehaviorsRestrictions = function() {
	this.elements.forEach(element => element.load())

    window.removeEventListener('keydown', removeBehaviorsRestrictions);
    window.removeEventListener('mousedown', removeBehaviorsRestrictions);
    window.removeEventListener('touchstart', removeBehaviorsRestrictions);
    this.resolve();
}

export const initializeSounds = (soundArray) => {
	return new Promise((resolve, reject) => {
		if (mediaPlaybackRequiresUserGesture()) {
			const args = {
				elements: soundArray,
				resolve: resolve
			};

		    window.addEventListener('keydown', removeBehaviorsRestrictions.bind(args));
		    window.addEventListener('mousedown', removeBehaviorsRestrictions.bind(args));
		    window.addEventListener('touchstart', removeBehaviorsRestrictions.bind(args));
		} else {
			resolve();
		}
	});
};