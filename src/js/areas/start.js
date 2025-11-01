
// ozil.start

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = ozil,
			Self = APP.start,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "some-event":
				break;
		}
	}
}
