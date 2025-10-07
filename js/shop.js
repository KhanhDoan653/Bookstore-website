 function removeVietnameseTones(str) {
    if (!str) return "";
    return str.normalize("NFD")                   // tách ký tự dấu ra
              .replace(/[\u0300-\u036f]/g, "")   // loại bỏ các dấu
              .replace(/đ/g, "d").replace(/Đ/g, "D"); // thay đ/Đ
}

// Ví dụ:
const text = "Hóa Đơn OCEAN HORIZON";
console.log(removeVietnameseTones(text)); // Hoa Don OCEAN HORIZON

/* Helper: parse price string -> integer (đồng) */
function parsePrice(val) {
  if (val == null) return 0;
  if (typeof val === "number" && !isNaN(val)) return Math.trunc(val);
  const digits = val.toString().replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}
function formatPrice(n) {
  return n.toLocaleString("vi-VN") + "đ";
}

/* Lấy tất cả sản phẩm từ sections (fallback sang products) */
function getAllProducts() {
  const sections = JSON.parse(localStorage.getItem("sections")) || {};
  let all = Object.values(sections).flat();
  if (!all || all.length === 0) {
    all = JSON.parse(localStorage.getItem("products")) || [];
  }
  return all;
}
function getProductById(id) {
  if (!id) return null;
  return getAllProducts().find(p => p.id === id) || null;
}

/* Cập nhật số lượng hiển thị ở header */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
  const el = document.getElementById("cart-count");
  if (el) el.innerText = count;
}

/* Render giỏ hàng */
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const tbody = document.getElementById("cartBody");
  const totalEl = document.getElementById("cart-total");
  const emptyMsg = document.getElementById("emptyCartMsg");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const table = document.querySelector(".cart-table");

  tbody.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    if (table) table.style.display = "none";
    if (emptyMsg) emptyMsg.style.display = "block";
    if (totalEl) totalEl.innerText = "Tổng: 0đ";
    if (checkoutBtn) checkoutBtn.style.display = "none";
    updateCartCount();
    return;
  } else {
    if (table) table.style.display = "table";
    if (emptyMsg) emptyMsg.style.display = "none";
    if (checkoutBtn) checkoutBtn.style.display = "inline-block";
  }

  cart.forEach((item, idx) => {
    const product = getProductById(item.id);
    if (!product) return; // nếu sp bị xóa trên admin vẫn an toàn

    const priceNum = parsePrice(product.price);
    const qty = Number(item.quantity) || 1;
    total += priceNum * qty;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${product.name || "Sản phẩm"}</td>
      <td>${formatPrice(priceNum)}</td>
      <td>${qty}</td>
      <td><button class="remove-btn" data-index="${idx}">Xóa</button></td>
    `;
    tbody.appendChild(tr);
  });

  if (totalEl) totalEl.innerText = `Tổng: ${formatPrice(total)}`;

  /* Gắn sự kiện XÓA theo index (an toàn) */
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      if (isNaN(index)) return;
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });
  });

  updateCartCount();
}

/* Checkout: mở modal và hiển thị tổng chính xác (lấy từ sections) */
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();

  const checkoutBtn = document.getElementById("checkoutBtn");
  const modal = document.getElementById("checkoutModal");
  const modalTotal = document.getElementById("modalTotal");
  const closeBtn = modal ? modal.querySelector(".close") : null;
  const downloadBill = document.getElementById("downloadBill");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      let total = 0;
      cart.forEach(item => {
        const product = getProductById(item.id);
        if (!product) return;
        const priceNum = parsePrice(product.price);
        const qty = Number(item.quantity) || 1;
        total += priceNum * qty;
      });
      if (modalTotal) modalTotal.innerText = `Tổng: ${formatPrice(total)}`;
      if (modal) modal.style.display = "flex";
    });
  }

  if (closeBtn) closeBtn.addEventListener("click", () => {
    if (modal) modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  /* Download bill: tạo file text với tên, đơn giá, qty, line total, tổng */
 if (downloadBill) {
  downloadBill.addEventListener("click", () => {
    const { jsPDF } = window.jspdf; // lấy từ thư viện
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const doc = new jsPDF();

    let y = 20;
    let total = 0;

    // Tiêu đề
    doc.setFontSize(18);
    doc.text("HOA ĐON OCEAN HORIZON", 14, y);
    y += 10;

    doc.setFontSize(12);

    // Nội dung hóa đơn
    cart.forEach((item, idx) => {
      const product = getProductById(item.id);
      if (!product) return;

      const priceNum = parsePrice(product.price);
      const qty = Number(item.quantity) || 1;
      const lineTotal = priceNum * qty;
      total += lineTotal;

      doc.text(`${idx + 1}. ${product.name} - ${formatPrice(priceNum)} x${qty} = ${formatPrice(lineTotal)}`, 14, y);
      y += 8;
    });

    // Tổng cộng
    y += 10;
    doc.setFontSize(14);
    doc.text(`Tong Tien: ${formatPrice(total)}`, 14, y);

    // Lưu file PDF
    doc.save("hoa_don_OceanHorizon.pdf");
  });
}

});

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