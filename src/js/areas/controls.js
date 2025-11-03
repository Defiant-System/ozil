
// ozil.controls

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			controls: window.find(".controls"),
		};
	},
	dispatch(event) {
		let APP = ozil,
			Self = APP.controls,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "toggle-play":
				console.log(event);
				break;
			case "toggle-menu":
				el = Self.els.controls.find(`.ctrl-menu.show`);
				if (!el.isSame(event.el)) {
					Self.els.controls.find(`span[data-click="toggle-menu"].active`).removeClass("active");
					el.removeClass("show");
				}

				value = event.el.hasClass("active");
				event.el.toggleClass("active", value);
				Self.els.controls.find(`.ctrl-menu.${event.el.data("arg")}`).toggleClass("show", value);
				break;
		}
	}
}
