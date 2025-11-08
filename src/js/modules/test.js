
let Test = {
	init(APP) {
		return;

		return setTimeout(() => APP.content.find(`.controls span[data-click="toggle-play"]`).trigger("click"), 300);
		// return setTimeout(() => APP.controls.dispatch({ type: "update-seek", value: 77, play: true }), 1000);

		setTimeout(() => { APP.controls.plyr.currentTime = 130; }, 2000);
		setTimeout(() => APP.content.find(`.controls span[data-click="toggle-play"]`).trigger("click"), 300);
		setTimeout(() => APP.content.find(`.controls span[data-click="toggle-play"]`).trigger("click"), 3000);
		return;

		// setTimeout(() => APP.content.find(`.controls span[data-click="toggle-menu"]:nth(1)`).trigger("click"), 400);
		// setTimeout(() => APP.content.find(`span[data-click="menu-go-sub"]:nth(0)`).trigger("click"), 900);
		return;
	}
};
