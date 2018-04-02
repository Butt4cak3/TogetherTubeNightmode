(() => {
  const API_KEY = "AIzaSyBob6ogkj0SsubPBjKRi5_FeBgvvZylhmE";
  const input = document.getElementById("videoSearchInput");

  if (!(input instanceof HTMLInputElement)) return;

  const init = () => {
    input.addEventListener("input", () => {
      const value = input.value;
      const re = /\s*https?:\/\/(www\.)?youtube\.com\/playlist\?list=(.+)\s*$/i;
      const match = value.match(re);
      const id = match ? match[2] : null;

      if (id) {
        addPlaylist(id);
      }
    });
  };

  const addPlaylist = (playlistId) => {
    return addPlaylistPage(playlistId);
  };

  const addPlaylistPage = (playlistId, pageToken) => {
    return apiRequest(playlistId, pageToken).then((response) => {
      let promise = Promise.resolve();

      for (let i = 0; i < response.items.length; i++) {
        promise = promise.then(addVideo.bind(null, response.items[i].contentDetails.videoId),
          addVideo.bind(null, response.items[i].contentDetails.videoId));
      }

      if (response.nextPageToken) {
        promise = promise.then(() => {
          return addPlaylistPage(playlistId, response.nextPageToken);
        });
      }

      return promise;
    });
  };

  const addVideo = (videoId) => {
    simulateInput("");
    return waitFor(listIsEmpty).then(() => {
      simulateInput("https://youtu.be/" + videoId);
      return waitFor(listIsNotEmpty, null, 5000);
    }).then(() => {
      const ol = document.getElementsByClassName("videoList")[1];
      const btn = ol.getElementsByClassName("btn-success")[0];
      const ev = new window.Event("click");

      btn.dispatchEvent(ev);

      return sleep(10);
    });
  };

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const listIsEmpty = () => {
    const ol = document.getElementsByClassName("videoList")[1];
    const buttons = ol.getElementsByClassName("btn");

    return buttons.length === 0;
  };

  const listIsNotEmpty = () => {
    const ol = document.getElementsByClassName("videoList")[1];
    const buttons = ol.getElementsByClassName("btn");

    return buttons.length > 0;
  };

  const simulateInput = (value) => {
    const event = new window.Event("input");

    input.value = value;
    input.dispatchEvent(event);
  };

  const apiRequest = (playlistId, pageToken) => {
    const query = {
      part: "contentDetails",
      maxResults: 50,
      fields: "items/contentDetails/videoId,nextPageToken",
      key: API_KEY,
      playlistId: playlistId
    };

    if (pageToken) {
      query.pageToken = pageToken;
    }

    const queryString = buildQueryString(query);
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?${queryString}`;

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();

      request.open("GET", url);
      request.onreadystatechange = () => {
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
  };

  const waitFor = (condition, sleepTime, timeout) => {
    if (!sleepTime) {
      sleepTime = 100;
    }

    if (condition === true) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (condition() === true) {
          clearInterval(interval);
          resolve();
        }
      }, sleepTime);

      if (timeout) {
        setTimeout(reject, timeout);
      }
    });
  };

  const buildQueryString = (query) => {
    const fields = [];

    for (const prop in query) {
      if (query.hasOwnProperty(prop)) {
        const value = query[prop];
        fields.push(encodeURIComponent(prop) + "=" + encodeURIComponent(value));
      }
    }

    return fields.join("&");
  };

  init();
})();
