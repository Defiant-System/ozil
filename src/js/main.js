
@import "./ext/custom.plyr.js"

@import "./modules/test.js"



const ozil = {
	init() {
		// fast references
		this.content = window.find("content");
		
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = ozil,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.init":
				break;
			// custom events
			case "open.file":
				// Files.open(event.path);
				event.open({ responseType: "xml" })
					.then(file => Self.dispatch({ type: "parse-file", file }));
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;

			case "parse-file":
				console.log(event);
				break;

			// proxy events
			case "set-wp":
				Self.content.find("> .wrapper").data({ wp: event.arg });
				break;
			case "update-volume":
			case "menu-close":
				return Self.controls.dispatch(event);
			default:
				el = event.el;
				if (!el && event.origin) el = event.origin.el;
				if (el) {
					let pEl = el.parents(`?div[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						return Self[name].dispatch(event);
					}
				}
		}
	},
	start: @import "./areas/start.js",
	player: @import "./areas/player.js",
	controls: @import "./areas/controls.js",
};

window.exports = ozil;
