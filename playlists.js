(function () {
	var API_KEY = "AIzaSyBob6ogkj0SsubPBjKRi5_FeBgvvZylhmE",
		input = document.getElementById("videoSearchInput");

	input.addEventListener("input", function () {
		var value = input.value,
			re = /\s*https?:\/\/(www\.)?youtube\.com\/playlist\?list=(.+)\s*$/i,
			match = value.match(re),
			id = match ? match[2] : null;

		if (id) {
			addPlaylist(id);
		}
	});

	function addPlaylist(playlistId) {
		return addPlaylistPage(playlistId);
	}

	function addPlaylistPage(playlistId, pageToken) {
		return apiRequest(playlistId, pageToken).then(function (response) {
			var i,
				promise = Promise.resolve();

			for (i = 0; i < response.items.length; i++) {
				promise = promise.then(addVideo.bind(null, response.items[i].contentDetails.videoId),
					addVideo.bind(null, response.items[i].contentDetails.videoId));
			}

			if (response.nextPageToken) {
				promise = promise.then(function () {
					return addPlaylistPage(playlistId, response.nextPageToken);
				});
			}

			return promise;
		});
	}

	function addVideo(videoId) {
		simulateInput("");
		return waitFor(listIsEmpty).then(function () {
			simulateInput("https://youtu.be/" + videoId);
			return waitFor(listIsNotEmpty, null, 5000);
		}).then(function () {
			var ol = document.getElementsByClassName("videoList")[1],
				btn = ol.getElementsByClassName("btn-success")[0],
				ev = new window.Event("click");

			btn.dispatchEvent(ev);

			return sleep(10);
		});
	}

	function sleep(ms) {
		return new Promise(function (resolve) {
			setTimeout(resolve, ms);
		});
	}

	function listIsEmpty() {
		var ol = document.getElementsByClassName("videoList")[1],
			buttons = ol.getElementsByClassName("btn");

		return buttons.length === 0;
	}

	function listIsNotEmpty() {
		var ol = document.getElementsByClassName("videoList")[1],
			buttons = ol.getElementsByClassName("btn");

		return buttons.length > 0;
	}

	function simulateInput(value) {
		var event = new window.Event("input");

		input.value = value;
		input.dispatchEvent(event);
	}

	function apiRequest(playlistId, pageToken) {
		var query,
			url = "https://www.googleapis.com/youtube/v3/playlistItems?";

		query = {
			part: "contentDetails",
			maxResults: 50,
			fields: "items/contentDetails/videoId,nextPageToken",
			key: API_KEY,
			playlistId: playlistId
		};

		if (pageToken) {
			query.pageToken = pageToken;
		}

		url = url + buildQueryString(query);

		return new Promise(function (resolve, reject) {
			var request = new XMLHttpRequest();

			request.open("GET", url);
			request.onreadystatechange = function () {
				if (request.readyState === request.DONE) {
					if (request.status === 200) {
						resolve(JSON.parse(request.responseText));
					} else {
						reject(request.status);
					}
				}
			};
			request.send(null);
		});
	}

	function waitFor(condition, sleepTime, timeout) {
		if (!sleepTime) {
			sleepTime = 100;
		}

		if (condition === true) return Promise.resolve();

		return new Promise(function (resolve, reject) {
			var interval;

			interval = setInterval(function () {
				if (condition() === true) {
					clearInterval(interval);
					resolve();
				}
			}, sleepTime);

			if (timeout) {
				setTimeout(reject, timeout);
			}
		});
	}

	function buildQueryString(query) {
		var prop,
			value,
			fields = [],
			result;

		for (prop in query) {
			if (query.hasOwnProperty(prop)) {
				value = query[prop];
				fields.push(encodeURIComponent(prop) + "=" + encodeURIComponent(value));
			}
		}

		result = fields.join("&");

		return result;
	}
}());
