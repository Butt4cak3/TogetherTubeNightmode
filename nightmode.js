(function () {
	var menu = document.querySelector(".navbar-room-header .navbar-right"),
		li = document.createElement("li"),
		a = document.createElement("a"),
		i = document.createElement("i");


	menu.appendChild(li);

	li.appendChild(a);

	a.href = "#";
	a.addEventListener("click", function () {
		toggleNightMode();
	});
	a.appendChild(i);
	a.appendChild(document.createTextNode(" Toggle Nightmode"));

	i.classList.add("fa", "fa-lightbulb-o");

	function toggleNightMode() {
		if (document.body.classList.contains("nightmode")) {
			document.body.classList.remove("nightmode");
		} else {
			document.body.classList.add("nightmode");
		}
	}
}());
