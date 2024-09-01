let prevScrollPos = window.pageYOffset;

window.onscroll = () => {
  if (window.innerWidth <= 786) {
    const currentScrollPos = window.pageYOffset;
    const header = document.querySelector(".header");
    header.style.bottom = currentScrollPos > prevScrollPos ? "-100%" : "0";
    prevScrollPos = currentScrollPos;
  }
};

const defaultPage = "home";

window.addEventListener("DOMContentLoaded", () => {
  const pageSession = sessionStorage.getItem("pageSession");
  if (pageSession) {
    document.querySelector(`.navigation .${pageSession}`).classList.add("active");
    loadPage(pageSession);
  } else {
    document.querySelector(`.navigation .${defaultPage}`).classList.add("active");
    loadPage(defaultPage);
  }
});

const linkNavs = document.querySelectorAll(".navigation a");

linkNavs.forEach(item => {
  item.addEventListener("click", event => {
    linkNavs.forEach(element => {
      element.classList.remove("active");
    });
    event.currentTarget.classList.add("active");
    loadPage(event.currentTarget.classList[0])
  });
});

function loadPage(pageName) {
  const pageSrc = `/pages/${pageName}/index.html`
  window.location.hash = pageName;

  const headerTitle = `Nekitori17 - ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
  document.title = headerTitle
  document.querySelector(".title h1").innerText = headerTitle;

  fetch(pageSrc)
    .then(res => {
      if (res.status == 404) {
        window.location = "404.html";
      }
      return res.text();
    })
    .then(htmlText => {
      document.querySelector(".container").innerHTML = htmlText;
      sessionStorage.setItem("pageSession", pageName);
    })
}