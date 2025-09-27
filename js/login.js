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

