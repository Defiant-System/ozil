
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
	 * Rewind
	 * @param {number} seekTime - how far to rewind in seconds. Defaults to the config.seekTime
	 */
	rewind = (seekTime) => {
		this.currentTime -= seekTime == +seekTime ? seekTime : this.config.seekTime;
	};

	/**
	 * Fast forward
	 * @param {number} seekTime - how far to fast forward in seconds. Defaults to the config.seekTime
	 */
	forward = (seekTime) => {
		this.currentTime += seekTime == +seekTime ? seekTime : this.config.seekTime;
	};

	/**
	 * Seek to a time
	 * @param {number} input - where to seek to in seconds. Defaults to 0 (the start)
	 */
	set currentTime(input) {
		// Bail if media duration isn't available yet
		if (!this.duration) {
			return;
		}

		// Validate input
		let inputIsValid = input == +input && input > 0;

		// Set
		this.player.currentTime = inputIsValid ? Math.min(input, this.duration) : 0;
		// console.log(this.player.currentTime);

		// Logging
		// this.debug.log(`Seeking to ${this.currentTime} seconds`);
	}

	/**
	 * Get current time
	 */
	get currentTime() {
		return Number(this.player.currentTime);
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

