
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

		// accumulate available quality information
		let sources = el.find(`source`).map(sEl => {
				let src = sEl.getAttribute("src"),
					type = sEl.getAttribute("type"),
					size = +sEl.getAttribute("size");
				return { src, type, size };
			})
			// lowest quality first
			.sort((a,b) => a.size - b.size);
		// emit event with quality information
		this.dispatch({ type: "add-quality-options", sources });

		// emit event to add track to menu
		this.dispatch({ type: "reset-language-options" });
		// subtitles
		for (let track of this.player.textTracks) {
			// diabled "native" subtitles
			track.mode = "hidden";
			// event listeners for subtitles
			track.addEventListener("cuechange", this.dispatch);
			// emit event to add track to menu
			this.dispatch({ type: "add-language-option", track });
		}
		// emit event to add track to menu
		this.dispatch({ type: "select-language-option" });

		// get video duration
		let xDuration = file.data.selectSingleNode(`//Meta[@id="duration"]`);
		this.duration = +xDuration.getAttribute("value");

		// set poster & "tag" parent element as initiated
		let xPoster = file.data.selectSingleNode(`//Meta[@id="poster"]`);
		this.wrapper
			.css({ "--poster": `url(${xPoster.getAttribute("value")})` })
			.addClass("initiated");

		// event listeners
		this.player.addEventListener("progress", this.dispatch);
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
	 * Set playback speed
	 * @param {number} input - the speed of playback (0.5-2.0)
	 */
	set speed(input) {
		// Set media speed
		setTimeout(() => {
			if (this.player) this.player.playbackRate = input;
		}, 0);
	}

	/**
	 * Get current playback speed
	 */
	get speed() {
		return Number(this.player.playbackRate);
	}

	get buffered() {
		return this.player.buffered;
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

	/**
	 * Set playback quality
	 * Currently HTML5 & YouTube only
	 * @param {number} input - Quality level
	 */
	set quality(input) {
		// Set quality
		this.player.quality = input;
	}

	/**
	 * Get current quality level
	 */
	get quality() {
		return this.player.quality;
	}

	/**
	 * Get current source
	 */
	set source(data) {
        let { currentTime } = this.player;

		this.quality = data.size;
		this.player.src = data.src;
		this.currentTime = currentTime;

		this.player.load();
		this.play();
	}

	/**
	 * Get current source
	 */
	get source() {
		return this.player.currentSrc.toString();
	}

	play() {
		// reset wrapper element
		this.wrapper.removeClass("initiated");
		// start playing
		this.player.play();
	}

	pause() {
		// pause playing
		this.player.pause();
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

