document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // Link trong form đăng nhập → mở đăng ký
  const toRegister = loginForm.querySelector("a");
  // Link trong form đăng ký → mở đăng nhập
  const toLogin = registerForm.querySelector("a");

  toRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  toLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // Link trong form đăng nhập → mở đăng ký
  const toRegister = loginForm.querySelector("a");
  // Link trong form đăng ký → mở đăng nhập
  const toLogin = registerForm.querySelector("a");

  toRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "none";
    registerForm.style.display = "block";
  });

  toLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  // Đăng ký
  registerForm.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = registerForm.querySelector('input[type="text"]').value;
    const email = registerForm.querySelector('input[type="email"]').value;
    const pass = registerForm.querySelectorAll('input[type="password"]')[0].value;
    const pass2 = registerForm.querySelectorAll('input[type="password"]')[1].value;

    if (pass !== pass2) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[email]) {
      alert("Email đã được đăng ký!");
      return;
    }

    users[email] = { name, password: pass, role: "customer" };
    localStorage.setItem("users", JSON.stringify(users));

    alert("Đăng ký thành công, mời bạn đăng nhập!");
    registerForm.style.display = "none";
    loginForm.style.display = "block";
  });

  // Đăng nhập
  loginForm.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const pass = loginForm.querySelector('input[type="password"]').value;

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (!users[email] || users[email].password !== pass) {
      alert("Sai email hoặc mật khẩu!");
      return;
    }

    localStorage.setItem("currentUser", email);
    alert("Đăng nhập thành công!");

    // Nếu là admin → admin.html, ngược lại → index.html
    if (users[email].role === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }
  });

  // 🚨 Tạo admin mặc định nếu chưa có
  let users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users["admin@ocean.com"]) {
    users["admin@ocean.com"] = { name: "Admin", password: "123456", role: "admin" };
    localStorage.setItem("users", JSON.stringify(users));
  }
});

