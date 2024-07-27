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

const contextTimeout = setTimeout(() => {
  document.querySelector(".loader-container .context-timeout").style.visibility = "visible";
}, 5000);

function loadPage(pageSrc) {
  const loaderContainer = document.querySelector(".loader-container");
  loaderContainer.style.cssText = "background: transparent; z-index: 90; display: flex;";

  const urlBookmark = pageSrc.split("/")[2];
  window.location.hash = urlBookmark;

  const headerTitle = urlBookmark.charAt(0).toUpperCase() + urlBookmark.slice(1);
  document.title = `Nekitori17 - ${headerTitle}`;
  document.querySelector(".title h1").innerText = `Nekitori17 - ${headerTitle}`;

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status === 200) {
        document.querySelector(".container").innerHTML = this.responseText;
        clearTimeout(contextTimeout);
        loaderContainer.style.display = "none";
        sessionStorage.setItem("pageSrcSession", pageSrc);
      } else if (this.status === 404) {
        window.location = "/error_pages/404.html";
      }
    }
  };
  xhttp.open("GET", pageSrc, true);
  xhttp.send();
}

window.addEventListener("DOMContentLoaded", async () => {
  await particlesJS.load("particles-js", "/assets/config/particles.json", () => {
    console.log("callback - particles.js config loaded");
  });

  const pageSrcSession = sessionStorage.getItem("pageSrcSession");
  if (pageSrcSession) {
    const sessionPage = pageSrcSession.split("/")[2];
    document.querySelector(`.${sessionPage}`).classList.add("active");
    loadPage(pageSrcSession);
  } else {
    document.querySelector(".home").classList.add("active");
    loadPage("/pages/home/index.html");
  }
});

const btnNavs = document.querySelectorAll(".btn-nav");

btnNavs.forEach(item => {
  item.addEventListener("click", event => {
    btnNavs.forEach(element => {
      element.classList.remove("active");
    });
    event.currentTarget.classList.add("active");
  });
});
