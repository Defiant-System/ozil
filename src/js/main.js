
@import "./ext/custom.plyr.js"

@import "./modules/test.js"


// default settings
const defaultSettings = {
	"language": "se",
};


const ozil = {
	init() {
		// fast references
		this.content = window.find("content");
		
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));

		// init settings
		this.dispatch({ type: "init-settings" });

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
					.then(file => Self.player.dispatch({ type: "init", file }));
				break;
			case "load-samples":
				event.samples.map(async path => {
					let file = await Self.openLocal(`~/samples/${path}`);
					Self.controls.dispatch({ type: "init-file", file });
					Self.player.dispatch({ type: "init-file", file });
				});
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			case "init-settings":
				// get settings, if any
				Self.settings = window.settings.getItem("settings") || defaultSettings;
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
	openLocal(url) {
		let parts = url.slice(url.lastIndexOf("/") + 1),
			[ name, kind ] = parts.split("."),
			file = new karaqu.File({ name, kind });
		// return promise
		return new Promise((resolve, reject) => {
			// fetch item and transform it to a "fake" file
			fetch(url)
				.then(resp => resp.blob())
				.then(blob => {
					// here the file as a blob
					file.blob = blob;
					if (blob.type === "application/xml") {
						let reader = new FileReader();
						reader.addEventListener("load", () => {
							// this will then display a text file
							file.data = $.xmlFromString(reader.result).documentElement;
							resolve(file);
						}, false);
						reader.readAsText(blob);
					} else {
						resolve(file);
					}
				})
				.catch(err => reject(err));
		});
	},
	start: @import "./areas/start.js",
	player: @import "./areas/player.js",
	controls: @import "./areas/controls.js",
};

window.exports = ozil;
