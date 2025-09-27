let index = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dots span');
const total = slides.length;

function showSlide(i) {
  index = (i + total) % total;
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === index);
  });
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === index);
  });
}

function moveSlide(step) {
  showSlide(index + step);
}

function currentSlide(i) {
  showSlide(i - 1);
}

// Auto chạy mỗi 3 giây
setInterval(() => {
  moveSlide(1);
}, 3000);

// Hiện slide đầu tiên
showSlide(0);

// Countdown Flash Sales
const countdown = document.getElementById("countdown");
const endDate = new Date("2025-12-20 23:59:59").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = endDate - now;

  if (distance < 0) {
    countdown.innerHTML = "🎉 Flash Sales đã kết thúc!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdown.innerHTML = `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
}

setInterval(updateCountdown, 1000);
updateCountdown();