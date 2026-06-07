class UI{

static currentFilter = "";

/* 🔔 TOAST */
static toast(msg){
  let t = document.createElement("div");
  t.className = "toast";
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2000);
}

/* NAVIGATION */
static navigate(page,data=null){

  if(page === "home") window.location.href = "index.html";
  if(page === "login") window.location.href = "login.html";
  if(page === "signup") window.location.href = "signup.html";
  if(page === "admin") window.location.href = "admin.html";
  if(page === "favorites") window.location.href = "favorites.html";
  if(page === "adoptedBefore") window.location.href = "adopted.html";

  if(page === "details"){
    window.location.href = "details.html?id=" + data;
  }
}

/* ROUTER */
static render(page,data=null){
  switch(page){
    case 'home': this.home(); break;
    case 'login': Auth.show(); break;
    case 'signup': Auth.signupShow(); break;
    case 'favorites': this.favorites(); break;
    case 'admin': Admin.panel(); break;
    case 'add': this.addForm(); break;
    case 'edit': this.addForm(data); break;
    case 'details': this.details(data); break;
    case 'adoptedBefore': this.adoptedBefore(); break;
  }
}

/* FILTER */
static setFilter(type, el){
  this.currentFilter = type;

  document.querySelectorAll(".filter-buttons button")
    .forEach(btn => btn.classList.remove("active"));

  if(el) el.classList.add("active");

  this.home();
}

/* NAVBAR */
static updateNavbar(){
  let user = Auth.current();
  let favs = Storage.getArray('favs');
  let nav = document.getElementById("navButtons");

  if(!user){
    nav.innerHTML = `
      <button onclick="UI.navigate('home')">Home</button>
      <button onclick="UI.navigate('login')">Login</button>
      <button onclick="UI.navigate('signup')">Signup</button>
    `;
  } else {
    nav.innerHTML = `
      <button onclick="UI.navigate('home')">Home</button>
      <button onclick="UI.navigate('favorites')">Saved (${favs.length})</button>
      <button onclick="UI.navigate('adoptedBefore')">Adopted Before</button>
      ${user.role==='admin' ? "<button onclick=\"UI.navigate('admin')\">Admin</button>" : ""}
      <button onclick="UI.toggleDark()">🌙</button>
      <button onclick="Auth.logout()">Logout</button>
    `;
  }
}

/* HOME */
static async home(){
   app.innerHTML = `
    <div class="grid">
      <div class="card skeleton"></div>
      <div class="card skeleton"></div>
      <div class="card skeleton"></div>
      <div class="card skeleton"></div>
      <div class="card skeleton"></div>
      <div class="card skeleton"></div>
    </div>
  `;

  let pets = await Pets.all();
  let user = Auth.current();
  let favs = Storage.getArray('favs');

  let search = document.getElementById("search")?.value.toLowerCase() || "";
  let filter = this.currentFilter;
  let sort = document.getElementById("sort")?.value || "";

  pets = pets.filter(p => {
    let name = (p.name || "").toLowerCase();
    let type = (p.type || "").toLowerCase();

    return (
      (name.includes(search) || type.includes(search)) &&
      (filter === "" || p.type === filter)
    );
  });

  if(sort === "az") pets.sort((a,b)=> (a.name || "").localeCompare(b.name || ""));
  if(sort === "new") pets.sort((a,b)=>b.id - a.id);

  let limit = 50;
  pets = pets.slice(0, limit);

  if(pets.length === 0){
    app.innerHTML = "<h2 style='text-align:center'>No pets found 🐾</h2>";
    return;
  }

  let html = `<h3 style="text-align:center">${pets.length} results</h3><div class='grid'>`;

  pets.forEach(p=>{
    html+=`
    <div class='card' onclick="UI.navigate('details', ${p.id})" style="cursor:pointer">
      <img src='${p.image}' onclick="UI.navigate('details', ${p.id})">

      <div class='card-content'>
        <h3>${p.name || "Unnamed"}</h3>
        <p>${p.type || "-"}</p>
        <p>${p.desc ? p.desc.substring(0,60) + "..." : "No description"}</p>

        <span class="badge ${p.status?.toLowerCase() || "available"}">
          ${p.status || "Available"}
          ${user && user.role === "admin" ? `
  <p><b>Requested by:</b> ${p.adoptedBy || "-"}</p>
  <p><b>Date:</b> ${p.adoptedDate || "-"}</p>
` : ""}
        </span>

        <br>

        <button onclick="event.stopPropagation(); UI.addFav(${p.id})">
          ${favs.includes(p.id) ? "❤️" : "🤍"}
        </button>

        ${
          user
          ? (
              p.status === "Available"
              ? `<button onclick="event.stopPropagation(); UI.requestAdopt(${p.id})">
     Adopt 🐾
   </button>`
              : p.status === "Pending"
              ? `<button disabled>Pending ⏳</button>`
              : `<button disabled>Adopted ❌</button>`
            )
          : ""
        }

      </div>
    </div>`;
  });

  html += "</div>";

/* ABOUT + CONTACT SECTION */
html += `
  <div style="
    margin-top:40px;
    padding:40px;
    text-align:center;
    background: var(--section-bg);
    border-radius:20px;
  ">

    <h3>About PetCity</h3>
    <p>
      PetCity is a platform designed to help you find your perfect companion.
      We connect loving homes with pets in need of care and attention.
    </p>

    <h3>Contact</h3>
    <p>Email: petcity@gmail.com</p>
    <p>Phone: +355 69 123 4567</p>

  </div>
`;

  app.innerHTML = html;
}

/* FAVORITES */
static addFav(id){
  let favs = Storage.getArray('favs');

  if(favs.includes(id)){
    favs = favs.filter(x=>x!==id);
    this.toast("Removed");
  } else {
    favs.push(id);
    this.toast("Saved ❤️");
  }

  Storage.set('favs',favs);
  this.home();
}

static async favorites(){
  let favs = Storage.getArray('favs');
  let allPets = await Pets.all();
  let pets = allPets.filter(p => favs.includes(p.id));

  if(pets.length === 0){
    app.innerHTML = "<h2 style='text-align:center'>No saved pets ❤️</h2>";
    return;
  }

  let html = "<div class='grid'>";

  pets.forEach(p=>{
    html += `
      <div class="card">
        <img src="${p.image}" onclick="UI.navigate('details', ${p.id})">

        <div class="card-content">
          <h3>${p.name || "Unnamed"}</h3>
          <p>${p.type || "-"}</p>

          <button onclick="UI.addFav(${p.id})">Remove ❤️</button>
        </div>
      </div>
    `;
  });

  html += "</div>";
  app.innerHTML = html;
}

/* REQUEST */
static async requestAdopt(id){
  let user = Auth.current();

  if(!user){
    UI.toast("Login first");
    UI.navigate('login');
    return;
  }

  const ok = await Pets.requestAdoption(id);

  if(ok){
    UI.toast("Request sent to admin 📩");
    UI.navigate('home');
  } else {
    UI.toast("Already requested or adopted");
  }
}

/* ⭐ DETAILS */
static async details(id){
  let pets = await Pets.all();
  let p = pets.find(x=>x.id===id);
  let user = Auth.current();

  app.innerHTML = `
  <div style="max-width:600px;margin:auto;text-align:center">

    <img src="${p.image}" style="width:100%;border-radius:15px">

    <h2>${p.name || "Unnamed"}</h2>

    <p><b>Type:</b> ${p.type || "-"}</p>
    <p><b>Age:</b> ${p.age || "-"}</p>
    <p><b>Gender:</b> ${p.gender || "-"}</p>
    <p><b>Breed:</b> ${p.breed || "-"}</p>
    <p><b>Disabilities:</b> ${p.disability || "None"}</p>

    <p>${p.desc || ""}</p>

    <p><b>Status:</b> ${p.status || "Available"}</p>
    <p><b>Requested by:</b> ${p.adoptedBy || "-"}</p>
    <p><b>Date:</b> ${p.adoptedDate || "-"}</p>

    <br>

    ${
      user && user.role !== "admin"
      ? (
          p.status === "Available"
          ? `<button class="approve" onclick="UI.requestAdopt(${p.id})">Request Adoption</button>`
          : p.status === "Pending"
          ? `<button class="back-btn" disabled>Pending ⏳</button>`
          : `<button class="deny" disabled>Adopted ❌</button>`
        )
      : ""
    }

    ${
      user && user.role === "admin" && p.status === "Pending"
      ? `
        <br><br>

        <button class="approve" onclick="Admin.approve(${p.id})">
          ✔ Approve
        </button>

        <button class="deny" onclick="Admin.deny(${p.id})">
          ✖ Deny
        </button>
      `
      : ""
    }

    <br><br>

    <button class="back-btn" onclick="UI.navigate('home')">
      ← Back
    </button>

  </div>
  `;
}

/* ADOPTED */
static async adoptedBefore(){
  let allPets = await Pets.all();
  let pets = allPets.filter(p => p.status === "Adopted");

  if(pets.length === 0){
    app.innerHTML = "<h2 style='text-align:center'>No adopted pets yet 🐾</h2>";
    return;
  }

  let html = `
    <h2 style="text-align:center">Adopted Pets 🏠</h2>
    <div class="grid">
  `;

  pets.forEach(p=>{
    html += `
      <div class="card" onclick="UI.navigate('details', ${p.id})" style="cursor:pointer">

        <img src="${p.image}" alt="${p.name}">

        <div class="card-content">
          <h3>${p.name || "Unnamed"}</h3>
          <p>${p.type || "-"}</p>

          <span class="badge adopted">Adopted</span>

          ${
            Auth.current()?.role === "admin" ? `
              <p><b>By:</b> ${p.adoptedBy || "-"}</p>
              <p><b>Date:</b> ${p.adoptedDate || "-"}</p>
            ` : ""
          }

        </div>
      </div>
    `;
  });

  html += "</div>";

  app.innerHTML = html;
}

/* DARK MODE */
static toggleDark(){
  UI.toggleTheme();
}
static toggleTheme(){

  document.body.classList.toggle("dark");

  if(document.body.classList.contains("dark")){
    localStorage.setItem("theme","dark");
  } else {
    localStorage.setItem("theme","light");
  }
}
static applyTheme(){

  let theme = localStorage.getItem("theme");

  if(theme === "dark"){
    document.body.classList.add("dark");
  }
}

/* ADD / EDIT FORM */
static async addForm(id=null){

  let user = Auth.current();

  if(!user || user.role !== "admin"){
    UI.toast("Admins only 🚫");
    UI.navigate('home');
    return;
  }

  let pet = null;
  if(id){
    let pets = await Pets.all();
    pet = pets.find(p=>p.id===id);
  }

  app.innerHTML = `
  <div class="form-box">

    <h2>${id ? "Edit Pet" : "Add New Pet"}</h2>

    <input id="name" placeholder="Name" value="${pet?.name || ""}">
    <input id="type" placeholder="Type (Dog, Cat...)" value="${pet?.type || ""}">
    <input id="age" placeholder="Age" value="${pet?.age || ""}">
    <input id="gender" placeholder="Gender" value="${pet?.gender || ""}">
    <input id="breed" placeholder="Breed" value="${pet?.breed || ""}">
    <input id="disability" placeholder="Disabilities" value="${pet?.disability || ""}">

    <textarea id="desc" placeholder="Description">${pet?.desc || ""}</textarea>

    <input id="image" placeholder="Paste image URL (https://...)">

    <button onclick="UI.savePet(${id || 'null'})">
      ${id ? "Update Pet" : "Add Pet"}
    </button>

    <button class="back-btn" onclick="UI.navigate('admin')">
      ← Back
    </button>

  </div>
  `;
}

static async savePet(id){

  UI.showLoader();

  let pet = {
    id: id || null,
    name: document.getElementById("name").value,
    type: document.getElementById("type").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    breed: document.getElementById("breed").value,
    disability: document.getElementById("disability").value,
    desc: document.getElementById("desc").value,
    image: document.getElementById("image").value
  };

  if(id){
    await Pets.update(pet);
  } else {
    await Pets.add(pet);
  }

  UI.hideLoader();
  UI.toast("Pet saved 🐾");
  UI.navigate('admin');
}

static showSplash(callback){

  let splash = document.getElementById("splash");

  if(!splash){
    if(callback) callback();
    return;
  }

  splash.style.display = "flex";
  splash.style.opacity = "1";

  setTimeout(()=>{
    splash.style.opacity = "0";

    setTimeout(()=>{
      splash.style.display = "none";

      if(callback) callback();

    }, 800);

  }, 1200);
}
static showLoader(){
  let l = document.getElementById("loader");
  if(l) l.style.display = "flex";
}

static hideLoader(){
  let l = document.getElementById("loader");
  if(l) l.style.display = "none";
}

static async deletePet(id){
  if(confirm("Delete this pet?")){
    await Pets.delete(id);
    UI.toast("Pet deleted 🗑");
    UI.navigate('admin');
  }
}
}

/* INIT */
window.onload = ()=>{

  Auth.init();

  setTimeout(()=>{
    document.getElementById("splash").style.opacity = "0";

    setTimeout(()=>{
      document.getElementById("splash").style.display = "none";
    }, 800);

  }, 2000);

  UI.updateNavbar();
  UI.navigate('home');
 
};