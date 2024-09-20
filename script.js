const originalSetTimeout = window.setTimeout;
const originalSetInterval = window.setInterval;

const TimeoutIntervalManager = {
  timeouts: [],
  intervals: [],

  setTimeout(callback, delay) {
    const id = originalSetTimeout(callback, delay);
    this.timeouts.push(id);
    return id;
  },

  setInterval(callback, delay) {
    const id = originalSetInterval(callback, delay);
    this.intervals.push(id);
    return id;
  },

  async clearAll() {
    this.timeouts.forEach(id => clearTimeout(id));
    this.intervals.forEach(id => clearInterval(id));
    this.timeouts = [];
    this.intervals = [];
  }
};

window.setTimeout = function(callback, delay) {
  return TimeoutIntervalManager.setTimeout(callback, delay);
};

window.setInterval = function(callback, delay) {
  return TimeoutIntervalManager.setInterval(callback, delay);
};

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
  if (window.location.hash) {
    const pageName = window.location.hash.slice(1)
    document.querySelector(`.navigation .${pageName}`).classList.add("active");
    return loadPage(pageName)
  }
  const pageSession = sessionStorage.getItem("pageSession");
  if (pageSession) {
    document.querySelector(`.navigation .${pageSession}`).classList.add("active");
    window.location.hash = pageSession
  }

  document.querySelector(`.navigation .${defaultPage}`).classList.add("active");
  window.location.hash = defaultPage
});

const linkNavs = document.querySelectorAll(".navigation a");

linkNavs.forEach(item => {
  item.addEventListener("click", event => {
    const pageName = event.currentTarget.classList[0];
    if (window.location.hash.slice(1) === pageName) return;

    linkNavs.forEach(element => {
      element.classList.remove("active");
    });
    event.currentTarget.classList.add("active");

    window.location.hash = pageName
  });
});

window.addEventListener('hashchange', () => {
  const pageName = window.location.hash.slice(1);

  linkNavs.forEach(element => {
    element.classList.remove("active");
  });
  document.querySelector(`.navigation a.${pageName}`).classList.add("active");

  loadPage(pageName)
});

async function loadPage(pageName) {
  const pageSrc = `/pages/${pageName}/index.html`;
  const containerContent = document.querySelector("div.container");

  containerContent.style.cssText = "transform: translateY(50%); opacity: 0";

  const headerTitle = `Nekitori17 - ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
  document.title = headerTitle;
  document.querySelector(".title h1").innerText = headerTitle;

  clearAutoLoadedScripts()

  const pageContent = await fetch(pageSrc)
    .then(res => {
      if (res.status === 404) {
        window.location = "404.html";
      }
      return res.text();
    })

  originalSetTimeout(() => {
    containerContent.innerHTML = pageContent;

    const cssLinks = containerContent.querySelectorAll('link[rel="stylesheet"]');
    if (cssLinks.length > 0) {
      let loadedCount = 0;
      cssLinks.forEach(link => {
        link.onload = () => {
          loadedCount++;
          if (loadedCount === cssLinks.length) {
            containerContent.style.cssText = "transform: translateY(0); opacity: 1";
          }
        };
      });

    } else {
      containerContent.style.cssText = "transform: translateY(0); opacity: 1";
    }

    originalSetTimeout(() => {
      document.querySelector("section.container").style.animationPlayState = "running";
    }, 500)

    const pageScript = containerContent.querySelectorAll("script")
    for (const script of pageScript) {
      const newScript = document.createElement("script")
      newScript.setAttribute("src", script.src)
      newScript.setAttribute("type", script.type || "text/javascript")
      newScript.setAttribute("data-auto-loaded", "true")

      document.body.appendChild(newScript)
    }
  }, 500)
  sessionStorage.setItem("pageSession", pageName);
}

function clearAutoLoadedScripts() {
  TimeoutIntervalManager.clearAll();

  const existPageSctipts = document.querySelectorAll(`script[data-auto-loaded="true"]`);
  existPageSctipts.forEach(script => script.remove());
}