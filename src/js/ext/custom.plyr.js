
class Plyr {
	constructor(wrapper, config) {
		// full screen support
		this.fullscreen = new Fullscreen;
		// Set the media element
		this.wrapper = wrapper;
	}

	load(file) {
		// save reference
		this.file = file;

		// Set the media element
		let el = window.render({
			template: "media-file",
			data: file.data,
			target: this.wrapper,
		});
		this.player = el[0];

		// set poster & "tag" parent element as initiated
		let xPoster = file.data.selectSingleNode(`//Meta[@id="poster"]`);
		this.wrapper
			.css({ "--poster": `url(${xPoster.getAttribute("value")})` })
			.addClass("initiated");
	}

	play() {
		// reset wrapper element
		this.wrapper.removeClass("initiated");
		// Return the promise (for HTML5)
		return this.player.play();
	}

	pause() {
		return this.player.pause();
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

