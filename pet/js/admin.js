class Admin{

static async panel(){
  let user = Auth.current();

  if(!user || user.role !== 'admin'){
    UI.toast("Admins only 🚫");
    UI.navigate('home');
    return;
  }


  let pets = await Pets.all();

  let html = `
    <div class="admin-container">

      <h2>👑 Admin Dashboard</h2>

      <!-- ACTION BUTTONS -->
      <div class="admin-actions">
        <button class="primary-btn" onclick="Admin.showAddForm()">
          ➕ Add New Pet
        </button>

        <button class="secondary-btn" onclick="Admin.viewAdopted()">
          📂 Adopted Pets
        </button>
      </div>

      <!-- PET GRID -->
      <div class="grid">
  `;

  if(pets.length === 0){
    html += "<p style='text-align:center'>No pets available</p>";
  }

  pets.forEach(p=>{
    html += `
    <div class="card" onclick="UI.navigate('details', ${p.id})" style="cursor:pointer">

      <img src="${p.image}">

      <div class="card-content">
        <h3>${p.name || "Unnamed"}</h3>
        <p>${p.type || "-"}</p>

        <span class="badge ${p.status?.toLowerCase() || "available"}">
          ${p.status || "Available"}
        </span>

        ${
          p.status === "Pending"
          ? `
            <p><b>Requested by:</b> ${p.adoptedBy || "-"}</p>

            <button class="approve"
              onclick="event.stopPropagation(); Admin.approve(${p.id})">
              ✔ Approve
            </button>

            <button class="deny"
              onclick="event.stopPropagation(); Admin.deny(${p.id})">
              ✖ Deny
            </button>
          `
          : ""
        }

        <br>

        <button class="edit-btn"
          onclick="event.stopPropagation(); Admin.showEditForm(${p.id})">
          ✏ Edit
        </button>

        <button class="delete-btn"
          onclick="event.stopPropagation(); UI.deletePet(${p.id})">
          🗑 Delete
        </button>

      </div>

    </div>
  `;
  });

  html += "</div></div>";

  app.innerHTML = html;
}

/* ➕ SHOW ADD FORM — inline, no navigation */
static showAddForm(){
  app.innerHTML = `
  <div class="form-box">

    <h2>Add New Pet</h2>

    <input id="name" placeholder="Name">
    <input id="type" placeholder="Type (Dog, Cat...)">
    <input id="age" placeholder="Age">
    <input id="gender" placeholder="Gender">
    <input id="breed" placeholder="Breed">
    <input id="disability" placeholder="Disabilities">

    <textarea id="desc" placeholder="Description"></textarea>

    <input id="image" placeholder="Paste image URL (https://...)">

    <button onclick="Admin.savePet(null)">Add Pet</button>

    <button class="back-btn" onclick="Admin.panel()">← Back</button>

  </div>
  `;
}

/* ✏ SHOW EDIT FORM — inline, no navigation */
static async showEditForm(id){
  let pets = await Pets.all();
  let pet = pets.find(p => p.id === id);

  if(!pet) return;

  app.innerHTML = `
  <div class="form-box">

    <h2>Edit Pet</h2>

    <input id="name" placeholder="Name" value="${pet.name || ""}">
    <input id="type" placeholder="Type (Dog, Cat...)" value="${pet.type || ""}">
    <input id="age" placeholder="Age" value="${pet.age || ""}">
    <input id="gender" placeholder="Gender" value="${pet.gender || ""}">
    <input id="breed" placeholder="Breed" value="${pet.breed || ""}">
    <input id="disability" placeholder="Disabilities" value="${pet.disability || ""}">

    <textarea id="desc" placeholder="Description">${pet.desc || ""}</textarea>

    <input id="image" placeholder="Paste image URL (https://...)" value="${pet.image || ""}">

    <button onclick="Admin.savePet(${id})">Update Pet</button>

    <button class="back-btn" onclick="Admin.panel()">← Back</button>

  </div>
  `;
}

/* 💾 SAVE (add or edit) */
static async savePet(id){
  UI.showLoader();

  let pet = {
    name:       document.getElementById("name").value,
    type:       document.getElementById("type").value,
    age:        document.getElementById("age").value,
    gender:     document.getElementById("gender").value,
    breed:      document.getElementById("breed").value,
    disability: document.getElementById("disability").value,
    desc:       document.getElementById("desc").value,
    image:      document.getElementById("image").value
  };

  if(id){
    pet.id = id;
    await Pets.update(pet);
  } else {
    await Pets.add(pet);
  }

  UI.hideLoader();
  UI.toast("Pet saved 🐾");
  Admin.panel();
}

/* ✅ APPROVE REQUEST */
static async approve(id){
  await Pets.approve(id);
  UI.toast("Adoption approved ✅");
  Admin.panel();
}

/* ❌ DENY REQUEST */
static async deny(id){
  await Pets.deny(id);
  UI.toast("Request denied ❌");
  Admin.panel();
}

/* 📂 VIEW ADOPTED */
static async viewAdopted(){
  let allPets = await Pets.all();
  let pets = allPets.filter(p => p.status === "Adopted");

  let html = `
    <h2 style="text-align:center">Adopted Pets 🏠</h2>

    <div style="text-align:center;margin-bottom:20px;">
      <button onclick="Admin.panel()">⬅ Back</button>
    </div>

    <div class="grid">
  `;

  if(pets.length === 0){
    html += "<h3 style='text-align:center'>No adopted pets yet</h3>";
  }

  pets.forEach(p=>{
    html += `
    <div class="card" onclick="UI.navigate('details', ${p.id})" style="cursor:pointer">

      <img src="${p.image}">

      <div class="card-content">
        <h3>${p.name || "Unnamed"}</h3>
        <p>${p.type || "-"}</p>

        <p>${p.desc ? p.desc.substring(0,60) + "..." : "No description"}</p>

        <span class="badge adopted">Adopted</span>

        <p><b>By:</b> ${p.adoptedBy || "-"}</p>
        <p><b>Date:</b> ${p.adoptedDate || "-"}</p>
      </div>

    </div>
  `;
  });

  html += "</div>";

  app.innerHTML = html;
}

}
