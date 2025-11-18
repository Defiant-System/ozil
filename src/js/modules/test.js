
let Test = {
	init(APP) {
		// return;

		setTimeout(() => APP.content.addClass("hover"), 500);
		setTimeout(() => APP.controls.dispatch({ type: "update-seek", value: 7, play: true }), 400);
		return;

		let o = {src:"/cdn/video/View_From_A_Blue_Moon_Trailer-720p.mp4",type:"video/mp4",size:720};
		setTimeout(() => APP.controls.dispatch({ type: "set-quality-option", arg: JSON.stringify(o) }), 4000);
		return;
		
		// setTimeout(() => APP.content.find(`.controls span[data-click="toggle-menu"]:nth(1)`).trigger("click"), 400);

		return setTimeout(() => APP.content.find(`.controls span[data-click="toggle-play"]`).trigger("click"), 4000);

		// setTimeout(() => { APP.controls.plyr.currentTime = 130; }, 2000);
		// setTimeout(() => APP.content.find(`.controls span[data-click="toggle-play"]`).trigger("click"), 300);
		// setTimeout(() => APP.content.find(`.controls span[data-click="toggle-play"]`).trigger("click"), 3000);
		// return;

		// setTimeout(() => APP.content.find(`span[data-click="menu-go-sub"]:nth(0)`).trigger("click"), 900);
		return;
	}
};
