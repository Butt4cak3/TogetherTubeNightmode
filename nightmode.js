(function () {
	var menu = document.querySelector(".navbar-room-header .navbar-right");

	addToolbarItem("Big Player", "arrows-alt", toggleBigPlayer);
	addToolbarItem("Toggle Nightmode", "lightbulb-o", toggleNightMode);

	function addToolbarItem(label, icon, onClick) {
		var li = document.createElement("li"),
			a = document.createElement("a"),
			i = document.createElement("i");

		menu.appendChild(li);

		li.appendChild(a);

		a.href = "#";
		a.addEventListener("click", onClick);
		a.appendChild(i);
		a.appendChild(document.createTextNode(" " + label));

		i.classList.add("fa", "fa-" + icon);
	}
	
	function toggleNightMode() {
		if (document.body.classList.contains("nightmode")) {
			document.body.classList.remove("nightmode");
		} else {
			document.body.classList.add("nightmode");
		}
	}

	function toggleBigPlayer() {
		if (document.body.classList.contains("bigplayer")) {
			document.body.classList.remove("bigplayer");
		} else {
			document.body.classList.add("bigplayer");
		}
	}
}());
