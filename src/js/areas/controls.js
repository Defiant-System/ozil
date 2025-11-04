
// ozil.controls

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			controls: window.find(".controls"),
		};
		// bind event handlers
		this.els.controls.bind("mousedown", this.doSeek);
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
			case "toggle-menu":
				if (event.el.hasClass("active")) {
					return Self.dispatch({ type: "menu-close" });
				}
				if (Self.els.content.find(".ctrl-menu.showing").length) {
					setTimeout(() => Self.dispatch(event), 160);
					return Self.dispatch({ type: "menu-close" });
				}
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
			case "toggle-play":
				el = event.el.find("i");
				value = el.hasClass("icon-play");
				if (value) {
					el.removeClass("icon-play").addClass("icon-pause");
				} else {
					el.removeClass("icon-pause").addClass("icon-play");
				}
				break;
			case "toggle-mute":
				el = Self.els.content.find(`span[data-click].active i`);
				value = el.hasClass("icon-volume");
				if (value) {
					el.removeClass("icon-volume").addClass("icon-volume-mute");
				} else {
					el.removeClass("icon-volume-mute").addClass("icon-volume");
				}
				Self.dispatch({ type: "menu-close" });
				break;
			case "set-subtitle":
			case "set-speed":
			case "set-quailty":
			case "toggle-pip":
			case "toggle-fullsceen":
				Self.dispatch({ type: "menu-close" });
				break;
		}
	},
	doSeek(event) {
		let APP = ozil,
			Self = APP.controls,
			Drag = Self.drag,
			el;
		// console.log( event );
		switch (event.type) {
			// native events
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				let el = $(event.target),
					pEl = el.parent().data("track"),
					oX = event.offsetX;
				switch (true) {
					case el.hasClass("knob") && pEl === "seek":
						oX += +el.prop("offsetLeft");
						el = el.parent();
						break;
					case el.data("track") === "seek": break;
					case el.hasClass("knob") && pEl === "volume": return Self.doVolume(event);
					case el.data("track") === "volume": return Self.doVolume(event);
					default: return;
				}

				let doc = $(document),
					played = el.parent().find(".played"),
					knob = el.find(".knob"),
					dur = +el.cssProp("--dur"),
					clickX = event.clientX,
					max = +el.prop("offsetWidth"),
					min = 0;

				pEl = el.parent();
				knob.css({ left: oX +"px" });
				clickX -= +knob.prop("offsetLeft") + 7;

				// drag start info
				Self.drag = { doc, el, pEl, played, knob, dur, max, min, clickX };

				// trigger fake "mousemove"
				Self.doSeek({ type: "mousemove", clientX: event.clientX });
				// hides cursor
				Self.els.content.addClass("hide-cursor");
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.doSeek);
				break;
			case "mousemove":
				let left = Math.max(Math.min(event.clientX - Drag.clickX, Drag.max), Drag.min),
					proc = left / (Drag.max - Drag.min);
				Drag.knob.css({ left });
				// update --val
				Drag.pEl.css({ "--val": `${(proc * 100) | 0}%` });

				let pos = (Drag.dur * proc) | 0,
					minutes = parseInt(pos/60),
					seconds = parseInt(pos%60).toString().padStart(2, "0");
				Drag.played.html(`${minutes}:${seconds}`);
				break;
			case "mouseup":
				// unhide cursor
				Self.els.content.removeClass("hide-cursor");
				// unbind event handlers
				Drag.doc.off("mousemove mouseup", Self.doSeek);
				break;
		}
	},
	doVolume(event) {
		let APP = ozil,
			Self = APP.controls,
			Drag = Self.drag,
			el;
		// console.log( event );
		switch (event.type) {
			// native events
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				let el = $(event.target),
					oY = event.offsetY;
				if (el.hasClass("knob")) {
					oY += +el.prop("offsetTop");
					el = el.parent();
				}

				let doc = $(document),
					knob = el.find(".knob"),
					clickY = event.clientY,
					max = +el.prop("offsetHeight"),
					min = 0;

				knob.css({ top: oY +"px" });
				clickY -= +knob.prop("offsetTop") + 7;

				// drag start info
				Self.drag = { doc, el, knob, max, min, clickY };

				// trigger fake "mousemove"
				Self.doVolume({ type: "mousemove", clientY: event.clientY });
				// hides cursor
				Self.els.content.addClass("hide-cursor");
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.doVolume);
				break;
			case "mousemove":
				let top = Math.max(Math.min(event.clientY - Drag.clickY, Drag.max), Drag.min),
					proc = top / (Drag.max - Drag.min);
				Drag.knob.css({ top });
				// update --val
				Drag.el.css({ "--val": `${((1-proc) * 100) | 0}%` });
				break;
			case "mouseup":
				// unhide cursor
				Self.els.content.removeClass("hide-cursor");
				// unbind event handlers
				Drag.doc.off("mousemove mouseup", Self.doVolume);
				break;
		}
	}
}
