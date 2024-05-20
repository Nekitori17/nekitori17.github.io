let prevScrollPos = window.pageYOffset;
window.onscroll = function() {
  const currentScrollPos = window.pageYOffset;
  if (prevScrollPos > currentScrollPos) {
    document.querySelector(".header").style.bottom = "15px";
  } else {
    document.querySelector(".header").style.bottom = "-500px";
  }
  prevScrollPos = currentScrollPos;
};