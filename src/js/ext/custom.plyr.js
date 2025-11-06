
class Plyr {
	constructor(el, config) {
		// full screen support
		this.fullscreen = new Fullscreen;

		// Set the media element
		this.media = el;

		// this.el
	}

	play() {
		// Return the promise (for HTML5)
		return this.media.play();
	}

	pause() {
		
	}

	togglePlay(toggle) {

	}

	stop() {

	}

	restart() {

	}

	rewind(seekTime) {

	}

	forward(seekTime) {

	}

	increaseVolume(step) {

	}

	decreaseVolume(step) {

	}

	toggleCaptions(toggle) {

	}

	airplay() {

	}

	setPreviewThumbnails(source) {

	}

	toggleControls(toggle) {

	}

	// on(event, function) {

	// }

	// once(event, function) {

	// }

	// off(event, function) {

	// }

	supports(type) {

	}

	destroy() {

	}
}


class Fullscreen {
	constructor() {

	}

	enter() {

	}

	exit() {

	}

	toggle() {

	}
}

