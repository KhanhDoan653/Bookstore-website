// Form validation and submission handling
function validateForm() {
    // Get form inputs
    const nameInput = document.querySelector('.contact-right input[type="text"]');
    const emailInput = document.querySelector('.contact-right input[type="email"]');
    const messageInput = document.querySelector('.contact-right textarea');
    
    // Get values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    // Regular expression for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validation checks
    if (name === '') {
        alert('Vui lòng nhập họ tên của bạn.');
        nameInput.focus();
        return false;
    }
    
    if (!emailPattern.test(email)) {
        alert('Vui lòng nhập email hợp lệ.');
        emailInput.focus();
        return false;
    }
    
    if (message === '') {
        alert('Vui lòng nhập nội dung lời nhắn.');
        messageInput.focus();
        return false;
    }
    
    // If validation passes, show success message and reset form
    alert('Cảm ơn bạn đã gửi lời nhắn! Chúng tôi sẽ liên hệ sớm nhất có thể.');
    nameInput.value = '';
    emailInput.value = '';
    messageInput.value = '';
    
    return false; // Prevent form submission (for demo purposes; remove if integrating with a backend)
}

// Add event listener to form submission
document.querySelector('.contact-right form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    validateForm();
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