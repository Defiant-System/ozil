
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
			offset,
			value,
			pEl,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "toggle-play":
				el = event.el.find("i");
				value = el.hasClass("icon-play");
				if (value) {
					el.removeClass("icon-play").addClass("icon-pause");
				} else {
					el.removeClass("icon-pause").addClass("icon-play");
				}
				break;
			case "toggle-menu":
				event.el.hasClass("active");
				value = event.el.data("arg");
				// render menu
				pEl = window.render({
					template: `controls-${value}-menu`,
					match: `//Menu[@for="${value}"]`,
					append: Self.els.controls,
				});
				// position menu
				offset = event.el.offset();
				pEl.css({ left : offset.left + (offset.width / 2) - (pEl.width() / 2) });

				setTimeout(() => 
					pEl.cssSequence("appear", "transitionend", el => {
						// console.log( pEl );
					}));
				break;
			case "menu-go-sub":
				value = event.el.data("arg");
				pEl = event.el.parents(".ctrl-menu");
				event.el.parents(".menu-wrapper").addClass("hidden");
				// render menu
				window.render({
					template: "controls-sub-menu",
					match: `//Menu[@name="${event.el.find(".name").text()}"]`,
					append: pEl,
				});
				// menu dimensions
				// pEl.parent().css({ right: -pEl.next(".menu-wrapper").width() >> 1 });
				break;
			case "menu-go-back":
				el = event.el.parents(".menu-wrapper");
				value = el.data("for");
				el.addClass("hidden");
				Self.els.controls.find(`.menu-wrapper [data-arg="${value}"]`).parents(".menu-wrapper").removeClass("hidden");
				break;
		}
	}
}
