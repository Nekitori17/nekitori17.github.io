let prevScrollPos = window.pageYOffset;

window.onscroll = () => {
  if (window.innerWidth <= 786) {
    const currentScrollPos = window.pageYOffset;
    const header = document.querySelector(".header");
    if (header) {
      header.style.bottom = currentScrollPos > prevScrollPos ? "-100%" : "0";
    }
    prevScrollPos = currentScrollPos;
  }
};

const CONNECTION_TIMEOUT = 5000;
var contextTimeout = setTimeout(() => {
  document.querySelector(".loader-container .context-timeout").style.visibility = "visible";
}, CONNECTION_TIMEOUT);

function loadPage(pageSrc) {
  var contextTimeout = setTimeout(() => {
    document.querySelector(".loader-container .context-timeout").style.visibility = "visible";
  }, CONNECTION_TIMEOUT);

  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.style.cssText = "background: transparent; z-index: 90; display: flex;";

  const urlBookmark = pageSrc.split("/")[2];
  window.location.hash = urlBookmark;

  const headerTitle = urlBookmark.charAt(0).toUpperCase() + urlBookmark.slice(1);
  document.title = `Nekitori17 - ${headerTitle}`;
  document.querySelector(".title h1").innerText = `Nekitori17 - ${headerTitle}`;

  fetch(pageSrc)
    .then(res => {
      if (res.status == 404) {
        window.location = "404.html";
      }
      return res.text();
    })
    .then(htmlText => {
      document.querySelector(".container").innerHTML = htmlText;
      clearTimeout(contextTimeout);
      loaderContainer.style.display = "none";
      sessionStorage.setItem("pageSrcSession", pageSrc);
    })
}

window.addEventListener("DOMContentLoaded", async () => {
  await particlesJS.load("particles-js", "/assets/config/particles.json", () => {
    console.log("callback - particles.js config loaded");
  });

  clearTimeout(contextTimeout);

  const pageSrcSession = sessionStorage.getItem("pageSrcSession");
  if (pageSrcSession) {
    const sessionPage = pageSrcSession.split("/")[2];
    document.querySelector(`.navigation .${sessionPage}`).classList.add("active");
    loadPage(pageSrcSession);
  } else {
    document.querySelector(".navigation .home").classList.add("active");
    loadPage("/pages/home/index.html");
  }
});

const linkNavs = document.querySelectorAll(".navigation a");

linkNavs.forEach(item => {
  item.addEventListener("click", event => {
    linkNavs.forEach(element => {
      element.classList.remove("active");
    });
    event.currentTarget.classList.add("active");
    loadPage(event.currentTarget.dataset.url)
  });
});