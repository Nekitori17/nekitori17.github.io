function pageMainScript() {
  setInterval(() => {
    const options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    const currentTime = new Intl.DateTimeFormat('vi-VN', options).format(new Date());
    const timerElement = document.querySelector(".userinfo table tr .timmer");
    if (timerElement) {
      timerElement.innerHTML = currentTime + " ";
    }
  }, 1000);
}