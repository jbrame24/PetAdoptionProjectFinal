class Auth{

/* INIT */
static init(){
  // Admin is seeded by the backend — nothing to do here
}

/* LOGIN UI */
static show(){
  app.innerHTML = `
  <div class="form-box">

    <div class="form-logo">🐾 PetCity</div>

    <h2>Login</h2>

    <input id="username" placeholder="Username" 
      onkeypress="if(event.key==='Enter') Auth.login()">

    <div class="password-box">
      <input id="password" type="password" placeholder="Password"
        onkeypress="if(event.key==='Enter') Auth.login()">
      <span onclick="Auth.togglePassword()">👁️</span>
    </div>

    <button onclick="Auth.login()">Login</button>

  </div>`;
  setTimeout(() => {
  document.getElementById("username").focus();
}, 100);
}

/* SIGNUP UI */
static signupShow(){
  app.innerHTML = `
  <div class="form-box">

    <div class="form-logo">🐾 PetCity</div>

    <h2>Create Account</h2>

    <input id="name" placeholder="Name"
      onkeypress="if(event.key==='Enter') Auth.register()">

    <input id="surname" placeholder="Surname"
      onkeypress="if(event.key==='Enter') Auth.register()">

    <input id="age" type="number" placeholder="Age"
      onkeypress="if(event.key==='Enter') Auth.register()">

    <select id="gender"
      onkeypress="if(event.key==='Enter') Auth.register()">
      <option value="">Select Gender</option>
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>

    <input id="location" placeholder="Location"
      onkeypress="if(event.key==='Enter') Auth.register()">

    <hr>

    <input id="username" placeholder="Username"
      onkeypress="if(event.key==='Enter') Auth.register()">

    <div class="password-box">
      <input id="password" type="password" placeholder="Password"
        onkeypress="if(event.key==='Enter') Auth.register()">
      <span onclick="Auth.togglePassword()">👁️</span>
    </div>

    <button onclick="Auth.register()">Create Account</button>

  </div>`;
}

/* REGISTER — now calls the API */
static async register(){

  let name     = document.getElementById("name").value.trim();
  let surname  = document.getElementById("surname").value.trim();
  let age      = document.getElementById("age").value;
  let gender   = document.getElementById("gender").value;
  let location = document.getElementById("location").value.trim();
  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value;

  if(password.length < 8){
    alert("Password must be at least 8 characters");
    return;
  }

  if(!name || !surname || !age || !gender || !location || !username || !password){
    alert("Please fill all fields");
    return;
  }

  try{
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, surname, age, gender, location, username, password })
    });

    const data = await res.json();

    if(!res.ok){ alert(data.message); return; }

    alert("Account created successfully!");
    UI.navigate('login');

  } catch(e){
    alert("Cannot reach server. Is the backend running?");
  }
}

/* LOGIN — now calls the API */
static async login(){

  let username = document.getElementById("username").value.trim();
  let password = document.getElementById("password").value;

  try{
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if(!res.ok){ alert(data.message); return; }

    // Save token + user exactly like before (u and role fields kept)
    Storage.set('token', data.token);
    Storage.set('currentUser', {
      ...data.user,
      u: data.user.username,
      role: data.user.role
    });

    UI.updateNavbar();

    UI.showSplash(()=>{
      window.location.href = "index.html";
    });

  } catch(e){
    alert("Cannot reach server. Is the backend running?");
  }
}

/* LOGOUT */
static logout(){
  Storage.remove('currentUser');
  Storage.remove('token');

  localStorage.setItem("skipSplash", "true");

  window.location.href = "index.html";
}

/* CURRENT USER */
static current(){
  return Storage.get('currentUser');
}

/* AUTH HEADERS — used by Pets & Admin */
static headers(){
  const token = Storage.get('token');
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
}

/* PASSWORD TOGGLE */
static togglePassword(){
  let input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

}
