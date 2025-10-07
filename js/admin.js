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

const scrollTopBtn = document.getElementById("scrollTopBtn");

// Hiện nút khi cuộn quá 300px
window.addEventListener("scroll", () => {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

// Khi click, cuộn lên đầu trang
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth" // cuộn mượt
  });
});

let sections = JSON.parse(localStorage.getItem("sections")) || {};
let products = JSON.parse(localStorage.getItem("products")) || [];
let editIndex = null;

// --- Chủ đề ---
function renderCategoryList() {
  const ul = document.getElementById("categoryList");
  ul.innerHTML = '';
  Object.keys(sections).forEach(cat => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${cat} 
      <button onclick="deleteCategory('${cat}')">Xóa</button>
    `;
    ul.appendChild(li);
  });
}

document.getElementById("addCategoryBtn").addEventListener("click", () => {
  const name = document.getElementById("newCategoryName").value.trim();
  if(!name) return alert("Nhập tên chủ đề!");
  if(!sections[name]) sections[name] = [];
  localStorage.setItem("sections", JSON.stringify(sections));
  document.getElementById("newCategoryName").value = '';
  renderCategoryList();
  renderCategoryOptions();
});

function deleteCategory(name) {
  if(confirm(`Xóa chủ đề "${name}" và tất cả sản phẩm trong đó?`)) {
    delete sections[name];
    localStorage.setItem("sections", JSON.stringify(sections));
    renderCategoryList();
    renderAdminProducts();
    renderCategoryOptions();
  }
}

// --- Sản phẩm ---
const popup = document.getElementById("productPopup");
const addBtn = document.getElementById("addProductBtn");
const closeBtn = popup.querySelector(".close-btn");
const saveBtn = document.getElementById("saveProductBtn");
const adminList = document.getElementById("adminProductList");

addBtn.addEventListener("click", () => {
  editIndex = null;
  popup.style.display = "flex";
  popup.querySelector("#popupTitle").innerText = "Thêm Sản Phẩm";
  popup.querySelectorAll("input").forEach(input => input.value = '');
  renderCategoryOptions();
});

closeBtn.addEventListener("click", () => popup.style.display = "none");

function renderCategoryOptions() {
  const select = document.getElementById("productCategory");
  select.innerHTML = '';
  select.innerHTML = '<option value="">Chọn chủ đề</option>';
  Object.keys(sections).forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat; opt.textContent = cat;
    select.appendChild(opt);
  });
}

saveBtn.addEventListener("click", () => {
  const category = document.getElementById("productCategory").value;
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const oldPrice = document.getElementById("productOldPrice").value.trim();
  const publisher = document.getElementById("productPublisher").value.trim();
  const year = document.getElementById("productYear").value.trim();
  const fileInput = document.getElementById("productImage");
const description = document.getElementById("productDescription").value.trim();
  if(!category || !name || !price) return alert("Điền đầy đủ thông tin!");

  // lấy đường dẫn ảnh (nếu có upload)
  let imgPath = editIndex!==null ? products[editIndex].image : "";
  if (fileInput.files[0]) {
    imgPath = `img/${fileInput.files[0].name}`;
  }

  saveProduct(imgPath);

  function saveProduct(imgSrc) {
    const newProduct = {
  id: editIndex!==null ? products[editIndex].id : Date.now().toString(),
  name,
  price,
  oldPrice,
  publisher,
  year,
  image: imgSrc,
  description,  // thêm dòng này
  stock: true,
  category
};

    if(editIndex!==null) {
      const oldCat = products[editIndex].category;
      sections[oldCat] = sections[oldCat].filter(p => p.id!==newProduct.id);
      products[editIndex] = newProduct;
    } else products.push(newProduct);

    if(!sections[category]) sections[category] = [];
    const idx = sections[category].findIndex(p=>p.id===newProduct.id);
    if(idx>=0) sections[category][idx] = newProduct;
    else sections[category].push(newProduct);

    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("sections", JSON.stringify(sections));
    popup.style.display = "none";
    renderAdminProducts();
    renderCategoryList();
  }
});

function renderAdminProducts() {
  adminList.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "admin-product";
   div.innerHTML = `
  <img src="${p.image}" alt="${p.name}">
  <span class="product-name">${p.name} (${p.category}) - ${p.price}đ</span>
  <p style="font-size:13px; color:#CAF0F8;">${p.description}</p>
  <button onclick="editProduct('${p.category}','${p.id}')">Sửa</button>
  <button onclick="deleteProductById('${p.id}')">Xóa</button>
`;

    adminList.appendChild(div);
  });
}

// --- Xóa sản phẩm ---
function deleteProductById(id){
  if(confirm("Bạn có chắc muốn xóa sản phẩm này?")){
    const prodIndex = products.findIndex(p => p.id===id);
    if(prodIndex >=0){
      const cat = products[prodIndex].category;
      products.splice(prodIndex,1);
      // Kiểm tra sections[cat] trước khi filter
      if(sections[cat]) {
        sections[cat] = sections[cat].filter(p=>p.id!==id);
      }
      localStorage.setItem("products", JSON.stringify(products));
      localStorage.setItem("sections", JSON.stringify(sections));
      renderAdminProducts();
      renderCategoryList();
    }
  }
}

function editProduct(cat, id) {
  const idx = products.findIndex(p => p.id === id);
  if (idx < 0) return;
  editIndex = idx;
  const p = products[idx];
  
  popup.style.display = "flex";
  popup.querySelector("#popupTitle").innerText = "Sửa Sản Phẩm";

  // 1. Render tất cả chủ đề trước
  renderCategoryOptions();

  // 2. Chọn chủ đề hiện tại
  document.getElementById("productCategory").value = cat;

  // 3. Điền thông tin sản phẩm
  document.getElementById("productName").value = p.name;
  document.getElementById("productPrice").value = p.price;
  document.getElementById("productOldPrice").value = p.oldPrice;
  document.getElementById("productPublisher").value = p.publisher;
  document.getElementById("productYear").value = p.year;
  document.getElementById("productDescription").value = p.description || ''; // điền mô tả
  document.getElementById("productImage").value = ''; // ảnh không thể set được
}



function toggleStock(cat,i){
  sections[cat][i].stock = !sections[cat][i].stock;
  localStorage.setItem("sections", JSON.stringify(sections));
  renderAdminProducts();
}


let events = JSON.parse(localStorage.getItem("events")) || [];
let eventEditIndex = null;

// === Mở popup thêm sự kiện ===
const eventPopup = document.getElementById("eventPopup");
const openEventPopupBtn = document.getElementById("addEventBtn");
const closeEventPopupBtn = document.getElementById("closeEventPopup");
const saveEventBtn = document.getElementById("saveEventBtn");

openEventPopupBtn.addEventListener("click", () => {
  eventEditIndex = null;
  document.getElementById("eventPopupTitle").innerText = "Thêm Sự Kiện";
  document.getElementById("eventTitle").value = "";
  document.getElementById("eventStartDate").value = "";
  document.getElementById("eventEndDate").value = "";
  renderBookSelectList();
  eventPopup.style.display = "flex";
});

closeEventPopupBtn.addEventListener("click", () => {
  eventPopup.style.display = "none";
});

// === Hiển thị danh sách sách có thể chọn ===
function renderBookSelectList(selected = []) {
  const list = document.getElementById("bookSelectList");
  list.innerHTML = products.map(p => `
    <label>
      <input type="checkbox" value="${p.id}" ${selected.includes(p.id) ? "checked" : ""}>
      <img src="${p.image}" alt="${p.name}">
      <span>${p.name}</span>
    </label>
  `).join("");
}

// === Lưu hoặc cập nhật sự kiện ===
saveEventBtn.addEventListener("click", () => {
  const title = document.getElementById("eventTitle").value.trim();
  const startDate = document.getElementById("eventStartDate").value;
  const endDate = document.getElementById("eventEndDate").value;
  const selectedBooks = [...document.querySelectorAll("#bookSelectList input:checked")].map(i => i.value);

  if (!title || !startDate || !endDate) return alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
  if (new Date(startDate) > new Date(endDate)) return alert("⚠️ Ngày bắt đầu không thể sau ngày kết thúc!");
  if (selectedBooks.length === 0) return alert("⚠️ Hãy chọn ít nhất 1 cuốn sách!");

  const newEvent = {
    id: eventEditIndex !== null ? events[eventEditIndex].id : Date.now(),
    title,
    startDate,
    endDate,
    books: selectedBooks
  };

  if (eventEditIndex !== null) events[eventEditIndex] = newEvent;
  else events.push(newEvent);

  localStorage.setItem("events", JSON.stringify(events));
  renderEventList();
  eventPopup.style.display = "none";
});

// === Hiển thị danh sách sự kiện ===
function renderEventList() {
  const container = document.getElementById("eventList");
  if (events.length === 0) {
    container.innerHTML = "<p>Chưa có sự kiện nào.</p>";
    return;
  }

  container.innerHTML = events.map((e, i) => `
    <div class="admin-product">
      <span class="product-name">${e.title}</span>
      <span>Từ: ${e.startDate} - Đến: ${e.endDate}</span>
      <div>
        <button onclick="editEvent(${i})">Sửa</button>
        <button onclick="deleteEvent(${i})">Xóa</button>
      </div>
    </div>
  `).join("");
}

// === Sửa sự kiện ===
function editEvent(i) {
  const e = events[i];
  eventEditIndex = i;
  document.getElementById("eventPopupTitle").innerText = "Sửa Sự Kiện";
  document.getElementById("eventTitle").value = e.title;
  document.getElementById("eventStartDate").value = e.startDate;
  document.getElementById("eventEndDate").value = e.endDate;
  renderBookSelectList(e.books);
  eventPopup.style.display = "flex";
}

// === Xóa sự kiện ===
function deleteEvent(i) {
  if (confirm("❌ Bạn có chắc muốn xóa sự kiện này không?")) {
    events.splice(i, 1);
    localStorage.setItem("events", JSON.stringify(events));
    renderEventList();
  }
}
 

function saveReview() {
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('reviewAuthor').value.trim();
  const rating = document.getElementById('bookRating').value;
  const content = document.getElementById('reviewContent').value.trim();
  const imageInput = document.getElementById('bookImage');
  const date = new Date().toLocaleDateString();

  if (!title || !author || !content) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function() {
    const imageData = reader.result;

    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    // Ngăn trùng bài
    const exists = reviews.some(r => r.title === title && r.author === author);
    if (exists) {
      alert("Bài review này đã tồn tại!");
      return;
    }

    const newReview = { title, author, rating, content, date, image: imageData };
    reviews.push(newReview);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    alert("✅ Đã lưu bài review!");
    loadAdminReviews();
    clearForm();
  };
  if (imageInput.files[0]) {
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    reader.onload(); // nếu không có ảnh
  }
}

function loadAdminReviews() {
  const tableBody = document.querySelector("#reviewTable tbody");
  tableBody.innerHTML = "";

  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  reviews.forEach((r, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.title}</td>
      <td>${r.author}</td>
      <td>${"⭐".repeat(r.rating)}</td>
      <td>${r.date}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editReview(${i})">Sửa</button>
        <button class="action-btn delete-btn" onclick="deleteReview(${i})">Xóa</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function editReview(index) {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const r = reviews[index];

  // Đổ dữ liệu lên form
  document.getElementById('bookTitle').value = r.title;
  document.getElementById('reviewAuthor').value = r.author;
  document.getElementById('bookRating').value = r.rating;
  document.getElementById('reviewContent').value = r.content;

  // Khi admin nhấn “Lưu” thì cập nhật lại bài đó thay vì thêm mới
  const saveBtn = document.querySelector('.review-form button');
  saveBtn.textContent = "🔄 Cập nhật Review";
  saveBtn.onclick = function() {
    r.title = document.getElementById('bookTitle').value.trim();
    r.author = document.getElementById('reviewAuthor').value.trim();
    r.rating = document.getElementById('bookRating').value;
    r.content = document.getElementById('reviewContent').value.trim();
    r.date = new Date().toLocaleDateString();

    localStorage.setItem("reviews", JSON.stringify(reviews));
    loadAdminReviews();
    clearForm();

    // Khôi phục nút về trạng thái ban đầu
    saveBtn.textContent = "💾 Lưu Review";
    saveBtn.onclick = saveReview;

    alert("✅ Đã cập nhật bài review!");
  };
}

function deleteReview(index) {
  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  if (confirm("Bạn có chắc muốn xóa bài này không?")) {
    reviews.splice(index, 1);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    loadAdminReviews();
  }
}

function clearForm() {
  document.getElementById('bookTitle').value = '';
  document.getElementById('reviewAuthor').value = '';
  document.getElementById('reviewContent').value = '';
  document.getElementById('bookRating').value = '5';
  document.getElementById('bookImage').value = '';
}

// Gọi khi load trang
window.onload = loadAdminReviews;

document.getElementById("clearAllBtn").addEventListener("click", () => {
  if (confirm("Bạn có chắc muốn xóa toàn bộ bài review không?")) {
    localStorage.removeItem("reviews");
    loadAdminReviews();
    alert("✅ Tất cả bài review đã bị xóa!");
  }
});

// === Gọi render ban đầu ===
renderEventList();

// Khởi tạo
renderCategoryList();
renderAdminProducts();