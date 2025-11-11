
// ozil.controls

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			controls: window.find(".controls"),
			progress: window.find(`.controls .progress`),
			played: window.find(`.controls .progress .played`),
			iconVolume: window.find(`.controls span[data-click="toggle-menu"][data-arg="volume"] i`),
			subtitles: window.find(".subtitles span"),
		};
		// bind event handlers
		this.els.controls.bind("mousedown", this.doSeek);
	},
	dispatch(event) {
		let APP = ozil,
			Self = APP.controls,
			hours, minutes, seconds,
			xMenu,
			buffered,
			duration,
			offset,
			value,
			pEl,
			el;
		// console.log(event);
		switch (event.type) {
			// triggered events from video element
			case "timeupdate":
				// if progress "drag'n drop", exit
				if (Self.els.content.hasClass("hide-cursor")) return;
				// calculations
				duration = APP.player.plyr.currentTime | 0;
				hours = parseInt(duration / 60 / 60, 10);
				minutes = parseInt(duration / 60, 10);
				seconds = String(duration % 60).padStart(2, "0");
				if (hours > 0) `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`;
				else value = `${minutes}:${seconds}`;
				Self.els.played.html(value);
				// seeker knob
				value = ((duration / APP.player.plyr.duration) * 100) | 0;
				Self.els.progress.css({ "--played": `${value}%` });
				break;
			case "progress":
				buffered = APP.player.plyr.buffered;
				for (let i=0; i<buffered.length; i++) {
					value = buffered.end(i);
				}
				value = ((value / APP.player.plyr.duration) * 100) | 0;
				Self.els.progress.css({ "--loaded": `${value}%` });
				break;
			case "ended":
				// rewind video
				Self.dispatch({ type: "toggle-play" });
				Self.dispatch({ type: "update-seek", value: 0.002 });
				break;
			case "cuechange":
				if (event.target.language !== APP.settings.language) return;
				// insert subtitles
				value = (Array.from(event.target.activeCues) || []).map(cue => cue.text).join("");
				Self.els.subtitles.html(value).toggleClass("show", value === "");
				break;
			// custom events
			case "set-speed-option":
			case "reset-speed-option":
				// remove "is-checked", if any
				xMenu = window.bluePrint.selectSingleNode(`//Menu[@check-group="playback-speed"][@is-checked='1']`);
				if (xMenu) xMenu.removeAttribute("is-checked");
				// set normal speed as default
				xMenu = window.bluePrint.selectSingleNode(`//Menu[@check-group="playback-speed"][@arg='${event.arg || 1}']`);
				if (xMenu) xMenu.setAttribute("is-checked", "1");
				break;
			case "reset-language-options":
				// clear "old" options
				window.bluePrint.selectNodes(`//Menu[@check-group="playback-subtitle"][@arg!='none']`)
					.map(xMenu => xMenu.parentNode.removeChild(xMenu));
				// remove "is-checked", if any
				xMenu = window.bluePrint.selectSingleNode(`//Menu[@check-group="playback-subtitle"][@is-checked='1']`);
				if (xMenu) xMenu.removeAttribute("is-checked");
				break;
			case "select-language-option":
				// set active language "is-checked", if any
				xMenu = window.bluePrint.selectSingleNode(`//Menu[@check-group="playback-subtitle"][@arg='${APP.settings.language}']`);
				if (xMenu) xMenu.setAttribute("is-checked", "1");
				break;
			case "add-language-option":
				window.menuBar.add({
					"parent": `//Menu[@check-group="playback-subtitle"][@arg="none"]/..`,
					"name": event.track.label,
					"arg": event.track.language,
					"click": "set-subtitle",
					"check-group": "playback-subtitle",
				});
				break;
			case "update-seek":
				APP.player.dispatch({ type: "seek", time: +event.value });
				if (event.play) Self.dispatch({ type: "toggle-play" });
				break;
			case "update-volume":
				// update player volume
				APP.player.dispatch({ type: "set-volume", value: event.value });
				break;
			case "init-file":
				Self.els.played.html(`0:00`);
				let xDur = event.file.data.selectSingleNode(`//Meta[@id="duration"]`);
				duration = +xDur.getAttribute("value");
				hours = parseInt(duration / 60 / 60, 10);
				minutes = parseInt(duration / 60, 10);
				seconds = String(duration % 60).padStart(2, "0");
				if (hours > 0) `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`;
				else value = `${minutes}:${seconds}`;
				Self.els.progress.find(`.duration`).html(value);
				// add as css value
				Self.els.progress.css({ "--dur": duration });
				break;
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
			case "play-rewind":
			case "play-forward":
				value = APP.player.plyr.currentTime + +event.arg;
				// dispatch event
				Self.dispatch({ type: "update-seek", value });
				break;
			case "toggle-play":
				el = event.el ? event.el.find("i") : Self.els.controls.find(`span[data-click="toggle-play"] i`);
				value = el.hasClass("icon-play");
				if (value) {
					el.removeClass("icon-play").addClass("icon-pause");
					APP.player.dispatch({ type: "play" });
					// update root class name
					Self.els.content.removeClass("playback-paused");
				} else {
					el.removeClass("icon-pause").addClass("icon-play");
					APP.player.dispatch({ type: "pause" });
					// update root class name
					Self.els.content.addClass("playback-paused");
				}
				break;
			case "toggle-mute":
				el = Self.els.iconVolume;
				pEl = Self.els.controls.find(`.range[data-change="update-volume"]`);

				if (el.hasClass("icon-volume-mute")) {
					// volume icon
					el.removeClass("icon-volume-mute");
					value = parseInt(pEl.data("val"), 10);
				} else {
					// volume icon
					el.addClass("icon-volume-mute");
					pEl.data({ val: pEl.cssProp("--volume") });
					value = 0;
				}
				pEl.css({ "--volume": `${value}%` });

				// forward event
				Self.dispatch({ type: "update-volume", value: value / 100 });
				// Self.dispatch({ type: "menu-close" });
				break;
			case "set-subtitle":
				// update app settings
				APP.settings.language = event.arg;
				// menu logic - if event origins from controls menu
				if (!event.xMenu) {
					// remove "is-checked", if any
					xMenu = window.bluePrint.selectSingleNode(`//Menu[@check-group="playback-subtitle"][@is-checked='1']`);
					if (xMenu) xMenu.removeAttribute("is-checked");
					// update menu
					Self.dispatch({ type: "select-language-option" });
				}
				// close controls menu
				Self.dispatch({ type: "menu-close" });
				break;
			case "set-speed":
				// menu logic - if event origins from controls menu
				if (!event.xMenu) {
					// update menu
					Self.dispatch({ type: "set-speed-option", arg: event.arg });
				}
				// update player object
				APP.player.plyr.speed = event.arg;
				// close controls menu
				Self.dispatch({ type: "menu-close" });
				break;
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
					pEl = el.parent().data("range"),
					oX = event.offsetX;
				switch (true) {
					case el.hasClass("knob") && pEl === "seek":
						oX += +el.prop("offsetLeft");
						el = el.parent();
						break;
					case el.data("range") === "seek": break;
					case el.hasClass("knob") && pEl === "volume": return Self.doVolume(event);
					case el.data("range") === "volume": return Self.doVolume(event);
					default: return;
				}

				let doc = $(document),
					played = el.parent().find(".played"),
					knob = el.find(".knob"),
					dur = +el.cssProp("--dur"),
					clickX = event.clientX,
					max = +el.prop("offsetWidth"),
					min = 0,
					type = el.parent().data("change");

				pEl = el.parent();
				// knob.css({ left: oX +"px" });
				clickX -= +knob.prop("offsetLeft") + 7;

				// drag start info
				Self.drag = { doc, el, pEl, played, type, knob, dur, max, min, clickX };

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
				// Drag.knob.css({ left });
				// update --played
				Drag.pEl.css({ "--played": `${(proc * 100) | 0}%` });
				// played time update
				Drag.value = (Drag.dur * proc) | 0;
				let minutes = parseInt(Drag.value/60),
					seconds = parseInt(Drag.value%60).toString().padStart(2, "0");
				Drag.played.html(`${minutes}:${seconds}`);
				break;
			case "mouseup":
				// dispatch event
				Self.dispatch({ type: Drag.type, value: Drag.value });
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
					min = 0,
					type = el.data("change");
				// knob.css({ top: oY +"px" });
				clickY -= +knob.prop("offsetTop") + 7;

				// drag start info
				Self.drag = { doc, el, type, knob, max, min, clickY };

				// trigger fake "mousemove"
				Self.doVolume({ type: "mousemove", clientY: event.clientY });
				// hides cursor
				Self.els.content.addClass("hide-cursor");
				// bind event handlers
				Self.drag.doc.on("mousemove mouseup", Self.doVolume);
				break;
			case "mousemove":
				let top = Math.max(Math.min(event.clientY - Drag.clickY, Drag.max), Drag.min),
					proc = 1 - (top / (Drag.max - Drag.min)),
					value = (proc * 100) | 0;
				// update --val
				Drag.el.css({ "--volume": `${value}%` });
				// dispatch event
				Self.dispatch({ type: Drag.type, value: proc });
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
