   


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
 

 function renderReviews() {
  const container = document.getElementById("reviewsContainer");
  const reviews = JSON.parse(localStorage.getItem("reviews")) || []; // Đọc đúng key

  if (reviews.length === 0) {
    container.innerHTML = "<p style='text-align:center; font-size:18px;'>Chưa có bài review nào!</p>";
    return;
  }

  container.innerHTML = "";

  // Hiển thị bài mới nhất lên đầu
  [...reviews].reverse().forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "review-card";
    div.innerHTML = `
      <div class="review-image">
        ${r.image ? `<img src="${r.image}" alt="${r.title}">` : `<div class="no-image">📘</div>`}
      </div>
      <div class="review-content">
        <h2 class="review-title">${r.title}</h2>
        <div class="review-meta">
          <span class="review-author"><i class="fa-solid fa-user"></i> ${r.author}</span>
          <span class="review-date"><i class="fa-regular fa-calendar"></i> ${r.date}</span>
        </div>
        <div class="review-stars">${"⭐".repeat(r.rating)}</div>
        <p class="review-text">${r.content}</p>
      </div>
    `;
    container.appendChild(div);

    // Hiệu ứng xuất hiện lần lượt
    setTimeout(() => div.classList.add("show"), i * 100);
  });
}

document.addEventListener("DOMContentLoaded", renderReviews);