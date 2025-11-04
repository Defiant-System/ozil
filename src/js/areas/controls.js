
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
				// el = Self.els.controls.find(`.ctrl-menu.show`);
				// if (!el.isSame(event.el)) {
				// 	Self.els.controls.find(`span[data-click="toggle-menu"].active`).removeClass("active");
				// 	el.removeClass("show");
				// }
				event.el.addClass("active");
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
				// "tag" window content
				Self.els.content.data({ click: "menu-close" });

				setTimeout(() => 
					pEl.cssSequence("appear", "transitionend", el => {
						let width = el.width(),
							height = el.height();
						el.addClass("showing").css({ width, height });
					}));
				break;
			case "menu-go-sub":
				value = event.el.data("arg");
				pEl = event.el.parents(".ctrl-menu");
				event.el.parents(".menu-wrapper").addClass("hidden");
				// render menu
				pEl = window.render({
					template: "controls-sub-menu",
					match: `//Menu[@name="${event.el.find(".name").text()}"]`,
					append: pEl.find(" > div"),
				});
				// position menu
				el = Self.els.content.find(`span.active`);
				offset = el.offset();
				pEl.parents(".ctrl-menu").css({
					left: offset.left + (offset.width / 2) - (pEl.width() / 2),
					width: pEl.width(),
					height: pEl.height(),
				});
				break;
			case "menu-go-back":
				el = event.el.parents(".menu-wrapper");
				pEl = el.prev(".menu-wrapper").removeClass("hidden");
				// position menu
				el = Self.els.content.find(`span.active`);
				offset = el.offset();
				pEl.parents(".ctrl-menu").css({
					left: offset.left + (offset.width / 2) - (pEl.width() / 2),
					width: pEl.width(),
					height: pEl.height(),
				});
				// remove old menu
				event.el.parents(".menu-wrapper").remove();
				break;
			case "menu-close":
				// reset window content
				Self.els.content.removeAttr("data-click");
				Self.els.content.find(`span[data-click].active`).removeClass("active");
				// smooth disappear
				Self.els.controls.find(".ctrl-menu.appear")
					.cssSequence("disappear", "transitionend", el => {
						// delete element from DOM
						el.remove();
					});
				break;
		}
	}
}
