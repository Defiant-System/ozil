
// ozil.player

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			wrapper: window.find(".video-wrapper"),
		};
		// init Plyr object
		this.plyr = new Plyr(this.els.wrapper);
	},
	dispatch(event) {
		let APP = ozil,
			Self = APP.player,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "init-file":
				// make sure player dispatch / event handler
				Self.plyr.dispatch = APP.controls.dispatch;
				// load file
				Self.plyr.load(event.file);
				break;
			case "play":
				Self.plyr.play();
				break;
			case "pause":
				Self.plyr.pause();
				break;
			case "seek":
				Self.plyr.currentTime = event.time;
				break;
			case "set-volume":
				Self.plyr.volume = event.value;
				break;
		}
	}
}
