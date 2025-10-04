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
      const productEl = document.createElement("div");
      productEl.className = "product";
      productEl.style.opacity = p.stock ? "1" : "0.5";
      productEl.innerHTML = `
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
const viewBtn = productEl.querySelector(".view-icon");
viewBtn.addEventListener("click", () => {
  const modal = document.getElementById("productModal");
  modal.querySelector("#modalTitle").innerText = p.name;
  modal.querySelector("#modalPrice").innerText = `Giá: ${p.price}đ`;
  modal.querySelector("#modalPublisher").innerText = `NXB: ${p.publisher || ""}`;
  modal.querySelector("#modalYear").innerText = `Năm: ${p.year || ""}`;
  modal.querySelector("#modalImage").src = p.image || "img/default.png";
  
  modal.style.display = "flex";
});

// --- Đóng popup ---
const closeBtn = document.querySelector("#productModal .close-btn");
closeBtn.addEventListener("click", () => {
  document.getElementById("productModal").style.display = "none";
});

// Đóng nếu click ra ngoài modal
window.addEventListener("click", (e) => {
  const modal = document.getElementById("productModal");
  if (e.target === modal) modal.style.display = "none";
});

      // --- Xử lý nút 🛒 Giỏ hàng ---
   // --- Xử lý nút 🛒 Giỏ hàng ---
productEl.querySelector(".cart-icon").addEventListener("click", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const idx = cart.findIndex(item => item.id === p.id);

  if (idx >= 0) {
    cart[idx].quantity += 1;
  } else {
    cart.push({ id: p.id, quantity: 1 }); // chỉ lưu id + số lượng
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`Đã thêm "${p.name}" vào giỏ hàng!`);
  updateCartCount();
});
    });
  });
}
 
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
