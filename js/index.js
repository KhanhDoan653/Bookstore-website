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


  // Lấy tất cả icon trong các sản phẩm
  const hearts = document.querySelectorAll('.product .icon.heart, .product .icon:nth-child(1)');
  const eyes = document.querySelectorAll('.product .icon.eye, .product .icon:nth-child(2)');
  const carts = document.querySelectorAll('.product .icon.cart, .product .icon:nth-child(3)');
  hearts.forEach(heart => {
    heart.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('liked'); // Giữ trạng thái tim
    });
  });

  document.querySelectorAll('.icon').forEach(icon => {
  if (icon.innerText === '👁️') {
    icon.addEventListener('click', function (e) {
      e.stopPropagation();
      const product = this.closest('.product');
      const title = product.querySelector('h3').innerText;
      const price = product.querySelector('.price').innerText;
      const imgSrc = product.querySelector('img').src;
      const year = product.getAttribute('data-year');
      const publisher = product.getAttribute('data-publisher');


      document.getElementById('modalTitle').innerText = title;
      document.getElementById('modalPrice').innerText = price;
      document.getElementById('modalYear').innerText = `Năm xuất bản: ${year}`;
      document.getElementById('modalPublisher').innerText = `Nhà xuất bản: ${publisher}`;
      document.getElementById('modalImage').src = imgSrc;
      document.getElementById('productModal').style.display = 'block';
    });
  }
});

// Đóng modal khi bấm nút X
document.querySelector('.close-btn').addEventListener('click', function () {
  document.getElementById('productModal').style.display = 'none';
});

// Đóng modal khi click ra ngoài
window.addEventListener('click', function (e) {
  const modal = document.getElementById('productModal');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

  carts.forEach(cart => {
    cart.addEventListener('click', function(e) {
      e.stopPropagation();
      const productName = this.closest('.product').querySelector('h3').innerText;
      const price = this.closest('.product').querySelector('.price').innerText;
      // Lưu vào localStorage để demo giỏ hàng
      let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      cartItems.push({name: productName, price: price});
      localStorage.setItem('cart', JSON.stringify(cartItems));
      alert(`${productName} đã được thêm vào giỏ hàng!`);
    });
  });

  // Cập nhật số lượng giỏ hàng từ localStorage
function updateCartCount() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  document.getElementById('cart-count').innerText = cartItems.length;
}

// Khi load trang, cập nhật số lượng
window.addEventListener('load', updateCartCount);

// Nếu bạn muốn thêm hiệu ứng phóng to khi số lượng tăng:
function animateCart() {
  const cartCount = document.getElementById('cart-count');
  cartCount.classList.add('bump');
  setTimeout(() => cartCount.classList.remove('bump'), 300);
}

// Khi thêm sản phẩm vào giỏ hàng
function addToCart(productName, price) {
  let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems.push({ name: productName, price: price });
  localStorage.setItem('cart', JSON.stringify(cartItems));
  updateCartCount();
  animateCart();
}

document.querySelectorAll('.heart-icon').forEach(heart => {
  heart.addEventListener('click', function () {
    this.classList.toggle('liked');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.querySelector('a[href="login.html"]');
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const currentUserEmail = localStorage.getItem("currentUser");

  if (currentUserEmail && users[currentUserEmail]) {
    const user = users[currentUserEmail];

    // Tạo menu user
    const userMenu = document.createElement("div");
    userMenu.classList.add("user-menu");
    userMenu.innerHTML = `
      <span class="username"> ${user.name}</span>
      <div class="dropdown-user">
        <a href="#" id="profileBtn">Hồ sơ</a>
        <a href="#" id="logoutBtn">Đăng xuất</a>
      </div>
    `;

    // Thay nút đăng nhập bằng user menu
    loginLink.replaceWith(userMenu);

    // Toggle dropdown
    const usernameSpan = userMenu.querySelector(".username");
    const dropdown = userMenu.querySelector(".dropdown-user");
    usernameSpan.addEventListener("click", () => {
      dropdown.classList.toggle("show");
    });

    // Popup hồ sơ
    const profilePopup = document.createElement("div");
    profilePopup.classList.add("profile-popup");
    profilePopup.innerHTML = `
      <div class="popup-content">
        <img src="${user.avatar || "img/default-avatar.png"}" alt="Avatar">
        <h3>${user.name}</h3>
        <p>Email: ${currentUserEmail}</p>
        <button id="closeProfile">Đóng</button>
      </div>
    `;
    document.body.appendChild(profilePopup);

    // Mở popup
    document.getElementById("profileBtn").addEventListener("click", (e) => {
      e.preventDefault();
      profilePopup.style.display = "flex";
    });

    // Đóng popup
    profilePopup.querySelector("#closeProfile").addEventListener("click", () => {
      profilePopup.style.display = "none";
    });

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.reload();
    });
  }
});
