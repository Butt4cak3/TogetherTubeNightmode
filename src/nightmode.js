(() => {
  const menu = document.querySelector(".navbar-room-header .navbar-right");
  const playerContainer = document.getElementsByClassName("col-xs-8")[0];
  const chatContainer = playerContainer.nextElementSibling;
  const userlistContainer = document.getElementsByClassName("col-xs-4")[1];
  const topRow = document.getElementsByClassName("row")[1];
  const bottomRow = topRow.nextElementSibling;
  const headerImage = document.querySelector(".navbar-brand>img");

  if (!(headerImage instanceof HTMLImageElement)) return;
  if (!(playerContainer instanceof HTMLElement)) return;

  const origHeaderURL = headerImage.src;

  const init = () => {
    addToolbarItem("Big Player", "arrows-alt", toggleBigPlayer);
    addToolbarItem("Toggle Nightmode", "lightbulb-o", toggleNightMode);

    chrome.storage.local.get([ "nightmode", "bigplayer" ], (items) => {
      if (items.nightmode === "1") {
        enableNightMode();
      }

      if (items.bigplayer === "1") {
        enableBigPlayer();
      }
    });
  };

  const addToolbarItem = (label, icon, onClick) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const i = document.createElement("i");

    menu.appendChild(li);

    li.appendChild(a);

    a.href = "#";
    a.addEventListener("click", onClick);
    a.appendChild(i);
    a.appendChild(document.createTextNode(" " + label));

    i.classList.add("fa", "fa-" + icon);
  };

  const enableNightMode = () => {
    document.body.classList.add("nightmode");
    headerImage.src = chrome.extension.getURL("header.png");
    chrome.storage.local.set({ "nightmode": "1" });
  };

  const disableNightMode = () => {
    document.body.classList.remove("nightmode");
    headerImage.src = origHeaderURL;
    chrome.storage.local.set({ "nightmode": "0" });
  };

  const toggleNightMode = () => {
    if (document.body.classList.contains("nightmode")) {
      disableNightMode();
    } else {
      enableNightMode();
    }
  };

  const enableBigPlayer = () => {
    playerContainer.style.width = "100%";
    bottomRow.appendChild(chatContainer);
    bottomRow.appendChild(userlistContainer);
    chrome.storage.local.set({ "bigplayer": "1" });
  };

  const disableBigPlayer = () => {
    playerContainer.style.width = "";
    topRow.appendChild(chatContainer);
    chrome.storage.local.set({ "bigplayer": "0" });
  };

  const toggleBigPlayer = () => {
    if (playerContainer.style.width === "") {
      enableBigPlayer();
    } else {
      disableBigPlayer();
    }
  };

  init();
})();
