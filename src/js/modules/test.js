
let Test = {
	init(APP) {
		// return;

		setTimeout(() => APP.content.addClass("hover"), 500);
		// setTimeout(() => APP.controls.dispatch({ type: "update-seek", value: 130, play: true }), 400);
		// setTimeout(() => APP.content.find(`.controls span[data-click="toggle-menu"]:nth(1)`).trigger("click"), 400);
		return setTimeout(() => APP.content.find(`.controls span[data-click="toggle-play"]`).trigger("click"), 300);

		// setTimeout(() => { APP.controls.plyr.currentTime = 130; }, 2000);
		// setTimeout(() => APP.content.find(`.controls span[data-click="toggle-play"]`).trigger("click"), 300);
		// setTimeout(() => APP.content.find(`.controls span[data-click="toggle-play"]`).trigger("click"), 3000);
		// return;

		// setTimeout(() => APP.content.find(`span[data-click="menu-go-sub"]:nth(0)`).trigger("click"), 900);
		return;
	}
};
