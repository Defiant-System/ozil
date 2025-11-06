
// ozil.player

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			wrapper: window.find(".video-wrapper"),
		};
		// // init Plyr object
		// let config = {
		// 		// enabled: false,
		// 		controls: [],
		// 		loadSprite: false,
		// 		debug: true,
		// 	};
		// this.plyr = new Plyr(this.els.playerEl, config);
		// // temp
		// this.els.wrapper.css({ "--poster": `url(${this.els.pEl.data("poster")})` });
	},
	dispatch(event) {
		let APP = ozil,
			Self = APP.player,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "play":
				Self.plyr.play();
				break;
			case "pause":
				Self.plyr.pause();
				break;
		}
	}
}
