document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("loginLink");
  const users = JSON.parse(localStorage.getItem("users")) || {};
  const currentUserEmail = localStorage.getItem("currentUser");

  if (!loginLink) return;

  if (currentUserEmail && users[currentUserEmail]) {
    const user = users[currentUserEmail];

    // Tạo phần menu user
    const userMenu = document.createElement("div");
    userMenu.classList.add("user-menu");
    userMenu.innerHTML = `
      <span class="username">Admin</span>
      <div class="dropdown-user">
        <a href="#" id="profileBtn">Hồ sơ</a>
        <a href="login.html" id="logoutBtn">Đăng xuất</a>
      </div>
    `;
    loginLink.replaceWith(userMenu);

    const usernameSpan = userMenu.querySelector(".username");
    const dropdown = userMenu.querySelector(".dropdown-user");

    // Khi click chữ Admin → bật/tắt dropdown
    usernameSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    // Click ngoài thì ẩn dropdown
    document.addEventListener("click", (e) => {
      if (!userMenu.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });

    // Popup hồ sơ
    const profilePopup = document.createElement("div");
    profilePopup.classList.add("profile-popup");
    profilePopup.innerHTML = `
      <div class="popup-content">
        <img src="${user.avatar || "img/default-avatar-BOSS.png"}" alt="Avatar">
        <h3>Admin</h3>
        <p>Email: ${currentUserEmail}</p>
        <button id="closeProfile">Đóng</button>
      </div>
    `;
    document.body.appendChild(profilePopup);

    const profileBtn = userMenu.querySelector("#profileBtn");
    const logoutBtn = userMenu.querySelector("#logoutBtn");
    const closeProfile = profilePopup.querySelector("#closeProfile");

    // Mở popup hồ sơ
    profileBtn.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.classList.remove("show");
      profilePopup.style.display = "flex";
    });

    // Đóng popup
    closeProfile.addEventListener("click", () => {
      profilePopup.style.display = "none";
    });

    // Logout
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.reload();
    });
  }
});

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
