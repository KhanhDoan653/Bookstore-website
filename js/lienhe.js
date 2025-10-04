document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Lấy input
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    // Reset trạng thái lỗi
    [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
      input.style.borderColor = "";
      const err = input.nextElementSibling;
      if (err && err.classList.contains("error-msg")) err.remove();
    });

    // Regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const namePattern = /^[a-zA-ZÀ-ỹ\s]{2,}$/; // chỉ chữ và khoảng trắng, ít nhất 2 ký tự
    const phonePattern = /^[0-9]{7,15}$/; // chỉ số, dài từ 7-15 ký tự

    // Validate
    let valid = true;

    function showError(input, msg) {
      input.style.borderColor = "red";
      const err = document.createElement("div");
      err.className = "error-msg";
      err.style.color = "red";
      err.style.fontSize = "12px";
      err.style.marginTop = "4px";
      err.innerText = msg;
      input.after(err);
      input.focus();
      valid = false;
    }

    if (!namePattern.test(name)) {
      showError(nameInput, "Vui lòng nhập họ tên hợp lệ (chỉ chữ và khoảng trắng).");
    }

    if (!emailPattern.test(email)) {
      showError(emailInput, "Vui lòng nhập email hợp lệ.");
    }

    if (!phonePattern.test(phone)) {
      showError(phoneInput, "Vui lòng nhập số điện thoại hợp lệ (7-15 chữ số).");
    }

    if (message.length < 10) {
      showError(messageInput, "Nội dung tin nhắn tối thiểu 10 ký tự.");
    }

    if (!valid) return; // nếu có lỗi thì dừng gửi

    // Gửi dữ liệu qua Formspree
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        alert("Cảm ơn bạn đã gửi lời nhắn! Chúng tôi sẽ liên hệ sớm nhất có thể.");
        form.reset();
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } catch (error) {
      alert("Không thể kết nối tới server. Vui lòng kiểm tra lại.");
    }
  });
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
