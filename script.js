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

function init(target) {
  switch (target) {
    case "main":
      fetch("./html_pages/game.html")
        .then((res) => res.text())
        .then((res) => (document.getElementById("content").innerHTML = res));
  }
}

document.querySelectorAll(".clickable").forEach((element) => {
  element.addEventListener("click", function (event) {
    console.log(event.currentTarget);
    fetch(`./html_pages/${event.currentTarget.id}.html`)
      .then((res) => res.text())
      .then((res) => {
        document.getElementById("content").innerHTML = res;
        init(event.currentTarget.id);
      });
  });
});

setSideWidth();
init("main")