
let Test = {
	init(APP) {
		// return;

		return APP.content.find(`.controls span[data-click="toggle-menu"]`).get(0).trigger("click");

	}
};
