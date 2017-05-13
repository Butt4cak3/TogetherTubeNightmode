(function () {
	var menu = document.querySelector(".navbar-room-header .navbar-right"),
		playerContainer = document.getElementsByClassName("col-xs-8")[0],
		chatContainer = playerContainer.nextElementSibling,
		userlistContainer = document.getElementsByClassName("col-xs-4")[1],
		topRow = document.getElementsByClassName("row")[1],
		bottomRow = topRow.nextElementSibling,
		headerImage = document.querySelector(".navbar-brand>img"),
		origHeaderURL = headerImage.src;

	addToolbarItem("Big Player", "arrows-alt", toggleBigPlayer);
	addToolbarItem("Toggle Nightmode", "lightbulb-o", toggleNightMode);

	chrome.storage.local.get([ "nightmode", "bigplayer" ], function (items) {
		if (items.nightmode === "1") {
			enableNightMode();
		}

		if (items.bigplayer === "1") {
			enableBigPlayer();
		}
	});

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

	function enableNightMode() {
		document.body.classList.add("nightmode");
		headerImage.src = chrome.extension.getURL("header.png");
		chrome.storage.local.set({ "nightmode": "1" });
	}

	function disableNightMode() {
		document.body.classList.remove("nightmode");
		headerImage.src = origHeaderURL;
		chrome.storage.local.set({ "nightmode": "0" });
	}

	function toggleNightMode() {
		if (document.body.classList.contains("nightmode")) {
			disableNightMode();
		} else {
			enableNightMode();
		}
	}

	function enableBigPlayer() {
		playerContainer.style.width = "100%";
		bottomRow.appendChild(chatContainer);
		bottomRow.appendChild(userlistContainer);
		chrome.storage.local.set({ "bigplayer": "1" });
	}

	function disableBigPlayer() {
		playerContainer.style.width = "";
		topRow.appendChild(chatContainer);
		chrome.storage.local.set({ "bigplayer": "0" });
	}

	function toggleBigPlayer() {
		if (playerContainer.style.width === "") {
			enableBigPlayer();
		} else {
			disableBigPlayer();
		}
	}
}());
