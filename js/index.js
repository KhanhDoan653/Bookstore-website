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