
class Plyr {
	constructor(wrapper) {
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

		// get video duration
		let xDuration = file.data.selectSingleNode(`//Meta[@id="duration"]`);
		this.duration = +xDuration.getAttribute("value");

		// set poster & "tag" parent element as initiated
		let xPoster = file.data.selectSingleNode(`//Meta[@id="poster"]`);
		this.wrapper
			.css({ "--poster": `url(${xPoster.getAttribute("value")})` })
			.addClass("initiated");

		// event listeners
		// this.player.addEventListener("progress", this.dispatch);
		this.player.addEventListener("timeupdate", this.dispatch);
		this.player.addEventListener("ended", this.dispatch);
	}

	get dispatch() {
		return this._dispatch;
	}

	set dispatch(dispatch) {
		this._dispatch = dispatch;
	}

	/**
	 * Get playing state
	 */
	get playing() {
		return Boolean(!this.paused && !this.ended);
	}

	/**
	 * Get paused state
	 */
	get paused() {
		return Boolean(this.player.paused);
	}

	/**
	 * Get stopped state
	 */
	get stopped() {
		return Boolean(this.paused && this.currentTime === 0);
	}

	/**
	 * Get ended state
	 */
	get ended() {
		return Boolean(this.player.ended);
	}

	/**
	 * Restart playback
	 */
	restart = () => {
		this.currentTime = 0;
	};

	/**
	 * Seek to a time
	 * @param {number} input - where to seek to in seconds. Defaults to 0 (the start)
	 */
	set currentTime(input) {
		// Bail if media duration isn't available yet
		if (!this.duration) return;

		// Validate input
		let inputIsValid = input == +input && input > 0;

		// Set
		this.player.currentTime = inputIsValid ? Math.min(input, this.duration) : 0;
	}

	/**
	 * Get current time
	 */
	get currentTime() {
		return Number(this.player.currentTime);
	}

	/**
	 * Set the player volume
	 * @param {number} value - must be between 0 and 1. Defaults to the value from local storage and config.volume if not set in storage
	 */
	set volume(value) {
		let volume = Number(value);
		let max = 1;
		let min = 0;

		// Maximum is volumeMax
		if (volume > max) volume = max;
		// Minimum is volumeMin
		if (volume < min) volume = min;

		// Set the player volume
		this.player.volume = volume;
	}

	/**
	 * Get the current player volume
	 */
	get volume() {
		return Number(this.player.volume);
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

	restart() {

	}

	toggleCaptions(toggle) {

	}

	airplay() {

	}

	setPreviewThumbnails(source) {

	}

	toggleControls(toggle) {

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

