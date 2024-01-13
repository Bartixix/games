let tournamentPresent = false;

const select = {
  pages: {
    game: "game",
    tournament: "tournament",
  },
  icon: {
    game: "src/tetris.png",
    tournament: "src/trophy.png",
  },
};

let data = {
  userInfo: {},
  users: {},
  score: {},
  round: 0,
};

function parseToJSON() {
  const userElem = document.getElementsByClassName("user");
  for (let i = 0; i < userElem.length; i++)
    data.users[Object.keys(data.userInfo)[i]] = userElem[i].firstChild.value;

  return JSON.stringify(data);
}

function parseToHTML(string) {
  const tData = JSON.parse(string);
  const length = Object.keys(tData.userInfo).length;

  createUser(length, true);
  data = tData;

  const users = document.getElementsByClassName("user");
  const score = document.getElementsByClassName("user-score");
  for (let i = 0; i < length; i++) {
    users[i].id = Object.values(data.userInfo)[i];
    users[i].firstChild.value = Object.values(data.users)[i];
    score[i].id = `user-score${Object.keys(data.userInfo)[i]}`;
    score[i].firstChild.innerText = Object.values(data.users)[i];
    score[i].lastChild.innerText = Object.values(data.score)[i];
  }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] == value);
}

async function setSideWidth() {
  await new Promise((r) => setTimeout(r, 100));

  let currentWidth = 0;
  const elements = document.querySelectorAll(".side-menu-element");
  elements.forEach((element) => {
    if (element.scrollWidth > currentWidth && element.id != "line") {
      currentWidth = element.scrollWidth;
    }
  });

  document.documentElement.style.setProperty(
    "--sideMenuWidth",
    `${currentWidth}px`
  );
}

async function init(target) {
  const icon = document.getElementById("icon");
  const title = document.querySelector("title");

  switch (target) {
    case "main":
      await init(select.pages.tournament);
      break;
    case select.pages.game:
      icon.setAttribute("href", select.icon.game);
      title.innerText = "PLAY TETRIS";

      await fetch("./html_pages/game.html")
        .then((res) => res.text())
        .then((res) => (document.getElementById("content").innerHTML = res));
      break;
    case select.pages.tournament:
      icon.setAttribute("href", select.icon.tournament);
      title.innerText = "CREATE TOURNAMENT";

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
      //console.log(fr.result);
      parseToHTML(fr.result);
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
  const parent = document.getElementById("players");
  const scoreParent = document.getElementById("score");
  if (clear) {
    data.userInfo = {};

    while (parent.childNodes.length > 0) parent.removeChild(parent.firstChild);
    while (scoreParent.childNodes.length > 0)
      scoreParent.removeChild(scoreParent.firstChild);

    const button = document.createElement("button");

    button.innerText = "NEW USER";
    button.id = "new-user";
    button.className = "user-element form-btn";

    button.addEventListener("click", (e) => createUser(1, false));
    document.getElementById("players").appendChild(button);

    tournamentPresent = true;
  }

  if (Object.keys(data.userInfo).length >= 10) {
    alert("User limit reached!");
    return;
  }

  let j = 0;

  for (let i = 0; j < count; i++) {
    if (data.userInfo[i] != undefined) continue;

    data.userInfo[i] = `user${i}`;
    data.score[i] = 0;

    const element = document.createElement("div");
    const input = document.createElement("input");
    const remvoeBtn = document.createElement("button");

    element.className = "user";
    element.id = `user${i}`;
    input.className = "user-element user-input";
    input.placeholder = `Player ${i + 1}`;
    input.required = true;
    input.maxLength = 20;
    remvoeBtn.className = "user-element user-btn";
    remvoeBtn.innerHTML = "<img src='src/x.png' />";
    remvoeBtn.addEventListener("click", (e) => {
      const removeBaseKey = getKeyByValue(
        data.userInfo,
        e.currentTarget.parentNode.id
      );

      const baseId = e.currentTarget.parentNode.id;

      delete data.userInfo[removeBaseKey];
      delete data.score[removeBaseKey];
      delete data.users[removeBaseKey];

      document.getElementById(baseId).remove();
      document.getElementById(`user-score${baseId.slice(-1)}`).remove();
    });

    element.appendChild(input);
    element.appendChild(remvoeBtn);
    parent.insertBefore(element, parent.children[i]);

    const score = document.createElement("tr");
    const name = document.createElement("td");
    const value = document.createElement("td");

    score.className = "user-score";
    score.id = `user-score${i}`;
    name.className = "user-score-element user-score-name";
    name.id = `user-score-name${i}`;
    value.className = "user-score-element user-score-points";
    value.id = `user-score-points${i}`;
    value.innerText = "0";

    score.appendChild(name);
    score.appendChild(value);
    scoreParent.insertBefore(score, scoreParent.children[i]);

    input.addEventListener("input", (e) => {
      name.innerText = e.currentTarget.value;
    });
    j++;
  }
}

document
  .querySelectorAll(".clickable")
  .forEach((element) =>
    element.addEventListener("click", (e) => init(e.currentTarget.id))
  );

setSideWidth();
init("main");
