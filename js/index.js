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



document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("loginLink");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const currentUserEmail = localStorage.getItem("currentUser");
if (!loginLink) return; 
  if (currentUserEmail && users[currentUserEmail]) {
    const user = users[currentUserEmail];

    // Tạo menu user
    const userMenu = document.createElement("div");
    userMenu.classList.add("user-menu");
    userMenu.innerHTML = `
      <span class="username"> ${user.name}</span>
      <div class="dropdown-user">
        <a href="#" id="profileBtn">Hồ sơ</a>
        <a href="login.html" id="logoutBtn">Đăng xuất</a>
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


function renderSections() {
  const container = document.getElementById("dynamicSections");
container.innerHTML = "";

const sections = JSON.parse(localStorage.getItem("sections")) || {};
const eventsObj = JSON.parse(localStorage.getItem("events")) || {};
const events = Object.values(eventsObj); // chuyển object thành mảng

// Lấy danh sách sách đang trong sự kiện active
const featuredBookIds = getFeaturedBookIds(events);

Object.keys(sections).forEach(sectionName => {
  const sectionEl = document.createElement("section");
  sectionEl.className = "product-section";

  const safeId = "section-" + sectionName.replace(/\s+/g, '-');

  sectionEl.innerHTML = `
    <h3>${sectionName}</h3>
    <div class="products-container" id="${safeId}"></div>
  `;

  container.appendChild(sectionEl);

  const productContainer = sectionEl.querySelector(`#${safeId}`);

  sections[sectionName].forEach(p => {
    const isFeatured = featuredBookIds.includes(p.id);
    const productEl = document.createElement("div");
    productEl.className = `product ${isFeatured ? 'book-on-fire' : ''}`;
    productEl.style.position = "relative";
    productEl.style.opacity = p.stock ? "1" : "0.5";
    
   productEl.innerHTML = `
  ${isFeatured ? createFireEffect() : ''}
  ${isFeatured ? '<div class="featured-badge">🔥 SÁCH SỰ KIỆN</div>' : ''}
  <img src="${p.image}" alt="${p.name}">
  <div class="product-icons">
    <span class="heart-icon">❤️</span>
    <span class="view-icon">👁️</span>
    <span class="cart-icon">🛒</span>
  </div>
  <h3 class="product-name">${p.name}</h3>
  <p class="price">${p.price}đ ${p.oldPrice ? `<span class="old-price">${p.oldPrice}đ</span>` : ""}</p>
  ${p.stock ? "" : "<span class='out-of-stock'>Hết hàng</span>"}
`;

    productContainer.appendChild(productEl);

// --------- STAR RATING (thay thế block cũ) ----------
let ratings = JSON.parse(localStorage.getItem("ratings")) || {};
const currentRating = ratings[p.id] || 0;

// Tạo badge (số sao) ở góc
const starWrapper = document.createElement("div");
starWrapper.className = "star-rating-wrapper";
starWrapper.innerHTML = `<span class="badge-star">★</span><span class="badge-text">${currentRating}/5</span>`;
productEl.appendChild(starWrapper);

// Tạo popup, nhưng KHÔNG set style.display gì lúc tạo
const starPopup = document.createElement("div");
starPopup.className = "star-popup";
for (let i = 1; i <= 5; i++) {
  const s = document.createElement("span");
  s.className = "star";
  s.innerText = "★";
  s.dataset.value = i;
  if (i <= currentRating) s.classList.add("selected");
  starPopup.appendChild(s);
}



// Hỗ trợ hiển thị popup: hover badge OR click badge (tốt cho touch)
let hideTimeout = null;
let popupAppended = false;

function showPopup() {
  if (!popupAppended) {
    productEl.appendChild(starPopup);
    popupAppended = true;
  }
  clearTimeout(hideTimeout);
  starPopup.style.display = "flex";
  starWrapper.classList.add("open");
}

function hidePopupDelayed() {
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    if (!starWrapper.matches(':hover') && !starPopup.matches(':hover')) {
      starPopup.style.display = "none";
      starWrapper.classList.remove("open");
    }
  }, 150);
}

starWrapper.addEventListener("mouseenter", showPopup);
starWrapper.addEventListener("click", () => {
  if (starPopup.style.display === "flex") {
    starPopup.style.display = "none";
    starWrapper.classList.remove("open");
  } else {
    showPopup();
  }
});
starWrapper.addEventListener("mouseleave", hidePopupDelayed);
starPopup.addEventListener("mouseenter", () => clearTimeout(hideTimeout));
starPopup.addEventListener("mouseleave", hidePopupDelayed);


// hover từng sao để preview (mờ -> sáng)
/* các sao trong popup luôn có thể hover để preview, và click để set rating */
Array.from(starPopup.children).forEach(star => {
  star.addEventListener("mouseenter", () => {
    const v = parseInt(star.dataset.value, 10);
    Array.from(starPopup.children).forEach(s => {
      s.classList.toggle("hover", parseInt(s.dataset.value, 10) <= v);
    });
  });

  star.addEventListener("mouseleave", () => {
    // remove hover class, giữ selected theo rating hiện tại
    Array.from(starPopup.children).forEach(s => s.classList.remove("hover"));
    const r = ratings[p.id] || 0;
    Array.from(starPopup.children).forEach(s => {
      s.classList.toggle("selected", parseInt(s.dataset.value,10) <= r);
    });
  });

  // Click để đánh giá (luôn cho phép đánh giá lại)
  star.addEventListener("click", () => {
    const val = parseInt(star.dataset.value, 10);
    ratings[p.id] = val;
    localStorage.setItem("ratings", JSON.stringify(ratings));

    // cập nhật badge
    const badgeText = starWrapper.querySelector(".badge-text");
    if (badgeText) badgeText.innerText = `${val}/5`;

    // cập nhật class selected cho popup
    Array.from(starPopup.children).forEach(s => {
      s.classList.toggle("selected", parseInt(s.dataset.value,10) <= val);
      s.classList.remove("hover");
    });

    // ẩn popup sau 200ms để người dùng có cảm giác hoàn tất
    setTimeout(() => {
      starPopup.style.display = "none";
      starWrapper.classList.remove("open");
    }, 200);
  });
});


  // --- Xử lý nút ❤️ Thích ---
const heartBtn = productEl.querySelector(".heart-icon");

// Kiểm tra trạng thái lúc load
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
heartBtn.style.color = wishlist.includes(p.id) ? "red" : "rgba(0,0,0,0.3)";

heartBtn.addEventListener("click", () => {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const idx = wishlist.indexOf(p.id);

  if (idx >= 0) {
    wishlist.splice(idx, 1); // Xóa nếu đã có
    heartBtn.style.color = "rgba(0,0,0,0.3)";
  } else {
    wishlist.push(p.id); // chỉ lưu id
    heartBtn.style.color = "red";
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
});


   // --- Xử lý nút 👁️ Xem ---
productEl.querySelector(".view-icon").addEventListener("click", () => {
  const modal = document.getElementById("productModal");

  modal.querySelector("#modalTitle").innerText = p.name;
  modal.querySelector("#modalPublisher").innerText = `NXB: ${p.publisher || ""}`;
  modal.querySelector("#modalYear").innerText = `Năm: ${p.year || ""}`;
  modal.querySelector("#modalDescription").innerText = p.description || "";
  modal.querySelector("#modalImage").src = p.image || "img/default.png";

  modal.style.display = "flex";
});


// Đóng popup
document.querySelector("#productModal .close-btn").addEventListener("click", () => {
  document.getElementById("productModal").style.display = "none";
});

// Đóng nếu click ra ngoài
window.addEventListener("click", (e) => {
  const modal = document.getElementById("productModal");
  if (e.target === modal) modal.style.display = "none";
});


      // --- Xử lý nút 🛒 Giỏ hàng ---
  productEl.querySelector(".cart-icon").addEventListener("click", () => {
  // Lấy rating hiện tại
  let ratings = JSON.parse(localStorage.getItem("ratings")) || {};
  const currentRating = ratings[p.id] || 0;

  // Nếu rating = 1, hiển thị popup cảnh báo
  if (currentRating === 1) {
    const confirmAdd = confirm(`Chú ý: Sản phẩm "${p.name}" chỉ được đánh giá 1/5 sao.\nBạn có chắc muốn thêm vào giỏ hàng không?`);
    if (!confirmAdd) return; // người dùng hủy, không thêm
  }

  // Thêm vào giỏ hàng bình thường
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const idx = cart.findIndex(item => item.id === p.id);

  if (idx >= 0) {
    cart[idx].quantity += 1;
  } else {
    cart.push({ id: p.id, quantity: 1 }); 
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Đã thêm "${p.name}" vào giỏ hàng!`);
  updateCartCount();
});
  });
}
  )}
 
// --- Đóng modal ---
document.querySelector("#productModal .close-btn").addEventListener("click", () => {
  document.getElementById("productModal").style.display = "none";
});

// --- Cập nhật số lượng giỏ hàng ---
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// --- Khi load trang ---
document.addEventListener("DOMContentLoaded", () => {
  renderSections();
  updateCartCount();
});


function searchProducts() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let products = document.querySelectorAll(".product");

  products.forEach(product => {
    let title = product.querySelector("h3").innerText.toLowerCase();
    if (title.includes(input)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// --- Nút Lên Đầu Trang ---
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.onscroll = function() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
};

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Thêm các hàm này vào file
function getFeaturedBookIds(events) {
  const now = new Date();
  const featuredIds = [];
  
  events.forEach(event => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    
    if (now >= start && now <= end) {
      featuredIds.push(...event.books);
    }
  });
  
  return featuredIds;
}

function createFireEffect() {
  let particles = '';
  for (let i = 0; i < 8; i++) {
    particles += `<div class="fire-particle" style="left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 1.5}s;"></div>`;
  }
  return `<div class="fire-particles">${particles}</div>`;
}

  document.addEventListener("DOMContentLoaded", () => {
        function loadEvents() {
          const events = JSON.parse(localStorage.getItem("events")) || [];
          const products = JSON.parse(localStorage.getItem("products")) || [];
          const container = document.getElementById("eventBannerContainer");

          container.innerHTML = "";
          if (events.length === 0) return;

          // Thêm CSS
          addCustomStyles();

          // --- Đây là chỗ bạn đặt đoạn code ---
          events.forEach((activeEvent) => {
            const end = new Date(activeEvent.endDate).getTime();
            const now = Date.now();

            if (end <= now) return;

            const banner = document.createElement("div");
            banner.className = "event-banner premium-banner";

            const waveEffect = document.createElement("div");
            waveEffect.className = "wave-effect";
            waveEffect.innerHTML = `
      <div class="wave"></div>
      <div class="wave"></div>
      <div class="wave"></div>
    `;

            banner.innerHTML = `
      <div class="banner-content">
        <div class="event-info">
          <div class="event-badge">SỰ KIỆN ĐẶC BIỆT</div>
          <h2 class="event-title">${activeEvent.title}</h2>
          <p class="event-description">Ưu đãi độc quyền - Đừng bỏ lỡ!</p>
          <div id="countdown-${activeEvent.id}" class="countdown-timer"></div>
          <button class="cta-button">Tham gia ngay</button>
        </div>
        
    <div class="products-showcase">
  <div class="carousel-wrapper">
    <button class="carousel-btn left-btn">❮</button>
    <div class="book-carousel">
      ${activeEvent.books
        .map((id) => {
          const product = products.find((p) => p.id == id);
          if (!product) return "";

          return `
          <div class="book-item" data-product-id="${product.id}">
            <div class="book-cover">
              <img src="${product.image}" alt="${product.name}" class="book-image">
              <div class="book-glow"></div>
            </div>
            <div class="book-info">
              <h4>${product.name}</h4>
            </div>
          </div>
        `;
        })
        .join("")}
    </div>
    <button class="carousel-btn right-btn">❯</button>
  </div>
</div>


        </div>
      </div>
      
      <div class="floating-elements">
        <div class="floating-icon">📚</div>
        <div class="floating-icon">🔥</div>
        <div class="floating-icon">⭐</div>
        <div class="floating-icon">🎁</div>
      </div>
    `;

            banner.appendChild(waveEffect);
            container.appendChild(banner);

            const carousel = banner.querySelector(".book-carousel");
            const leftBtn = banner.querySelector(".left-btn");
            const rightBtn = banner.querySelector(".right-btn");

            const scrollAmount = 160; // width sách + gap

            leftBtn.addEventListener("click", () => {
              carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            });

            rightBtn.addEventListener("click", () => {
              carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
            });

            // Các phần countdown và interactivity giữ nguyên...
            function updateCountdown() {
              const diff = end - Date.now();
              const countdownElement = document.getElementById(
                `countdown-${activeEvent.id}`
              );

              if (diff <= 0) {
                countdownElement.innerHTML =
                  '<div class="event-ended">Sự kiện đã kết thúc</div>';
                banner.style.opacity = "0.7";
                return;
              }

              const d = Math.floor(diff / (1000 * 60 * 60 * 24));
              const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
              const m = Math.floor((diff / (1000 * 60)) % 60);
              const s = Math.floor((diff / 1000) % 60);

              countdownElement.innerHTML = `
          <div class="countdown-grid">
            <div class="countdown-item">
              <span class="countdown-number">${d}</span>
              <span class="countdown-label">Ngày</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number">${h}</span>
              <span class="countdown-label">Giờ</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number">${m}</span>
              <span class="countdown-label">Phút</span>
            </div>
            <div class="countdown-item">
              <span class="countdown-number">${s}</span>
              <span class="countdown-label">Giây</span>
            </div>
          </div>
        `;
            }

            updateCountdown();
            setInterval(updateCountdown, 1000);

            // Chạy ngay sau khi banner được thêm vào DOM
            banner.querySelectorAll(".book-item").forEach((item) => {
              const cover = item.querySelector(".book-cover");

              item.addEventListener("mousemove", (e) => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;

                const rotateX = deltaY * 15;
                const rotateY = deltaX * 15;

                cover.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
              });

              item.addEventListener("mouseleave", () => {
                cover.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
              });
            });
          });
        }

        function addCustomStyles() {
          const styles = `
      .event-banner.premium-banner {
        position: relative;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px 30px;
        margin: 30px 0;
        border-radius: 20px;
        box-shadow: 
          0 20px 40px rgba(0,0,0,0.1),
          0 0 80px rgba(102, 126, 234, 0.3),
          inset 0 1px 0 rgba(255,255,255,0.2);
        overflow: hidden;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        transform-style: preserve-3d;
        perspective: 1000px;
      }

      .banner-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 30px;
        flex-wrap: wrap;
        position: relative;
        z-index: 2;
      }

      .event-info {
        flex: 1;
        min-width: 300px;
      }

      .event-badge {
        display: inline-block;
        background: linear-gradient(45deg, #ff6b6b, #ffa726);
        padding: 8px 16px;
        border-radius: 25px;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 15px;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        animation: pulse 2s infinite;
      }

      .event-title {
        font-size: 2.5em;
        margin: 0 0 10px 0;
        background: linear-gradient(45deg, #fff, #f0f0f0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }

      .event-description {
        font-size: 1.1em;
        opacity: 0.9;
        margin-bottom: 25px;
      }

      .countdown-grid {
        display: flex;
        gap: 15px;
        margin: 20px 0;
      }

      .countdown-item {
        background: rgba(255,255,255,0.1);
        padding: 15px;
        border-radius: 15px;
        text-align: center;
        min-width: 70px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
      }

      .countdown-number {
        font-size: 1.8em;
        font-weight: bold;
        display: block;
        background: linear-gradient(45deg, #fff, #e0e0e0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .countdown-label {
        font-size: 0.8em;
        opacity: 0.8;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .cta-button {
        background: linear-gradient(45deg, #ff6b6b, #ffa726);
        border: none;
        padding: 15px 30px;
        border-radius: 50px;
        color: white;
        font-size: 1.1em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .cta-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 40px rgba(255, 107, 107, 0.6);
      }

      .products-showcase {
        flex: 1;
        min-width: 300px;
      }

      .book-carousel {
        display: flex;
        gap: 20px;
        overflow-x: auto;
        padding: 20px 10px;
        scrollbar-width: none;
      }

      .book-carousel::-webkit-scrollbar {
        display: none;
      }

      .book-item {
        flex: 0 0 auto;
        width: 140px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .book-item:hover {
        transform: translateY(-10px) scale(1.05);
      }

      .book-cover {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
      }

      .book-image {
        width: 100%;
        height: 180px;
        object-fit: cover;
        transition: all 0.3s ease;
      }

      .book-glow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .book-item:hover .book-glow {
        opacity: 1;
      }

      .book-info {
        padding: 10px 5px;
        text-align: center;
      }

      .book-info h4 {
        margin: 0;
        font-size: 0.9em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: white;
      }

      /* Đã xóa phần .price, .old-price, .new-price, .discount-badge */

      .floating-elements {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      .floating-icon {
        position: absolute;
        font-size: 24px;
        opacity: 0.3;
        animation: float 6s ease-in-out infinite;
      }

      .floating-icon:nth-child(1) { top: 10%; left: 5%; animation-delay: 0s; }
      .floating-icon:nth-child(2) { top: 20%; right: 10%; animation-delay: 1.5s; }
      .floating-icon:nth-child(3) { bottom: 30%; left: 15%; animation-delay: 3s; }
      .floating-icon:nth-child(4) { bottom: 10%; right: 5%; animation-delay: 4.5s; }

      .wave-effect {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100px;
        overflow: hidden;
        opacity: 0.1;
      }

      .wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 200%;
        height: 100px;
        background: url('data:image/svg+xml,<svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg"><path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" fill="white"/></svg>');
        animation: wave 10s linear infinite;
      }

      .wave:nth-child(2) {
        animation-delay: -5s;
        opacity: 0.5;
      }

      .wave:nth-child(3) {
        animation-delay: -2s;
        opacity: 0.3;
      }

      @keyframes wave {
        0% { transform: translateX(0); }
        50% { transform: translateX(-25%); }
        100% { transform: translateX(-50%); }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .event-ended {
        background: rgba(255,255,255,0.1);
        padding: 10px 20px;
        border-radius: 10px;
        text-align: center;
        font-style: italic;
      }

      @media (max-width: 768px) {
        .banner-content {
          flex-direction: column;
          text-align: center;
        }
        
        .event-title {
          font-size: 2em;
        }
        
        .countdown-grid {
          justify-content: center;
        }
        
        .countdown-item {
          min-width: 60px;
          padding: 10px;
        }
        
        .countdown-number {
          font-size: 1.5em;
        }
      }
.book-item {
  flex: 0 0 auto;
  width: 140px;
  cursor: pointer;
  perspective: 1000px; /* Cho 3D */
}

.book-cover {
  position: relative;
  border-radius: 12px;
  overflow: visible;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
  box-shadow: 0 15px 35px rgba(0,0,0,0.3);
}
  .carousel-wrapper {
  position: relative;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.4);
  border: none;
  color: white;
  font-size: 1.8em;
  padding: 8px 12px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 5;
  transition: background 0.3s;
}

.carousel-btn:hover {
  background: rgba(0,0,0,0.7);
}

.left-btn {
  left: 0;
}

.right-btn {
  right: 0;
}


    `;

          const styleSheet = document.createElement("style");
          styleSheet.textContent = styles;
          document.head.appendChild(styleSheet);
        }

        loadEvents();
      });

      window.addEventListener("load", () => {
        document.getElementById("loading").classList.add("hidden");
      });