
// ozil.controls

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = ozil,
			Self = APP.controls,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "toggle-play":
				console.log(event);
				break;
		}
	}
}
