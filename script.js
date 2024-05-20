function updateCurrentTime() {
  let now = new Date();
  let options = {
    timeZone: 'Asia/Bangkok',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  let timeInVietnam = now.toLocaleString('en-US', options);

  document.querySelectorAll('.time-current').forEach(function(tag) {
    tag.innerHTML = ` Time at my location: <code>${timeInVietnam}</code>`;
  });
}

updateCurrentTime();

setInterval(updateCurrentTime, 1000);
