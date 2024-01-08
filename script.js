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

document.querySelectorAll(".clickable").forEach((element) => {
  element.addEventListener("click", function (event) {
    console.log(event.currentTarget)
    fetch("./html_pages/tournament.html")
   .then( r => r.text() )
   .then( t => console.log(t) )
  });
});

setSideWidth();
