const pages = {
  game: "game",
  tournament: "tournament",
};

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
  document.getElementById("uploadFile").addEventListener("change", (e) => {
    let fr = new FileReader();
    fr.onload = function () {
      console.log(fr.result);
    };
    fr.readAsText(e.target.files[0]);
  });

  document.getElementById("create").addEventListener("click", (e) => {
    initCreate(4);
  });
}

function initCreate(count) {
  for (let i = 0; i < count; i++) {
    const parrent = document.getElementById("players");

    const element = document.createElement("div");
    const input = document.createElement("input");
    const remvoeBtn = document.createElement("button");

    element.className = "user";
    element.id = `user${i}`;
    input.className = "user-element user-input";
    input.id = `user-input${i}`;
    input.placeholder = `Player ${i + 1}`;
    input.required = true
    remvoeBtn.className = "user-element user-btn";
    remvoeBtn.id = `user-btn${i}`;

    element.appendChild(input);
    element.appendChild(remvoeBtn);
    parrent.appendChild(element);
  }
}

document.querySelectorAll(".clickable").forEach((element) => {
  element.addEventListener("click", function (event) {
    fetch(`./html_pages/${event.currentTarget.id}.html`)
      .then((res) => res.text())
      .then((res) => (document.getElementById("content").innerHTML = res));
    init(event.currentTarget.id);
  });
});

setSideWidth();
init("main");
