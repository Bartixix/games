let tournamentPresent = false;

const pages = {
  game: "game",
  tournament: "tournament",
};

let usedPlayers = {};

function parseToJSON() {
  return "";
}

function parseToHTML() {}

function getVlaueByKey(object, value) {
  return Object.keys(object).find((key) => object[key] == value);
}

function setSideWidth() {
  let currentWidth = 0;
  const elements = document.querySelectorAll(".side-menu-element");
  elements.forEach((element) => {
    if (element.scrollWidth > currentWidth && element.id != "line")
      currentWidth = element.scrollWidth;
  });

  document.documentElement.style.setProperty(
    "--sideMenuWidth",
    `${currentWidth}px`
  );
}

async function init(target) {
  switch (target) {
    case "main":
      await init(pages.tournament);
      break;
    case pages.game:
      await fetch("./html_pages/game.html")
        .then((res) => res.text())
        .then((res) => (document.getElementById("content").innerHTML = res));
      break;
    case pages.tournament:
      await fetch("./html_pages/tournament.html")
        .then((res) => res.text())
        .then((res) => (document.getElementById("content").innerHTML = res));
      initTournament();
      break;
  }
}

function initTournament() {
  const download = document.getElementById("download");

  document.getElementById("uploadFile").addEventListener("change", (e) => {
    let fr = new FileReader();
    fr.onload = function () {
      console.log(fr.result);
    };
    fr.readAsText(e.target.files[0]);
  });

  document.getElementById("create").addEventListener("click", (e) => {
    createUser(4, true);
  });

  download.addEventListener("click", (e) => {
    if (!tournamentPresent) return;

    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(parseToJSON())
    );
    element.setAttribute("download", "tournament.json");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  });
}

function createUser(count, clear) {
  const parrent = document.getElementById("players");
  if (clear) {
    usedPlayers = {};

    while (parrent.children.length > 0) parrent.removeChild(parrent.firstChild);

    const button = document.createElement("button");

    button.innerText = "NEW USER";
    button.id = "new-user";
    button.className = "user-element form-btn";

    button.addEventListener("click", (e) => createUser(1, false));
    document.getElementById("players").appendChild(button);

    tournamentPresent = true;
  }

  if (Object.keys(usedPlayers).length >= 15) {
    alert("User limit reached!");
    return;
  }

  let j = 0;

  for (let i = 0; j < count; i++) {
    if (usedPlayers[i] != undefined) continue;

    usedPlayers[i] = `user${i}`;

    const element = document.createElement("div");
    const input = document.createElement("input");
    const remvoeBtn = document.createElement("button");

    element.className = "user";
    element.id = `user${i}`;
    input.className = "user-element user-input";
    input.id = `user-input${i}`;
    input.placeholder = `Player ${i + 1}`;
    input.required = true;
    remvoeBtn.className = "user-element user-btn";
    remvoeBtn.id = `user-btn${i}`;
    remvoeBtn.innerHTML = "<img src='src/x.png' />";
    remvoeBtn.addEventListener("click", (e) => {
      delete usedPlayers[
        getVlaueByKey(usedPlayers, e.currentTarget.parentNode.id)
      ];
      document.getElementById(e.currentTarget.parentNode.id).remove();
    });

    element.appendChild(input);
    element.appendChild(remvoeBtn);
    parrent.insertBefore(element, parrent.children[i]);

    j++;
  }
}

function download() {}

document
  .querySelectorAll(".clickable")
  .forEach((element) =>
    element.addEventListener("click", (e) => init(e.currentTarget.id))
  );

setSideWidth();
init("main");
