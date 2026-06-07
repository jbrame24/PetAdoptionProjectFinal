// ── CONFIG ───────────────────────────────────────────────────────────────────
const API = "http://localhost:5062/api";

// ── Auth ──────────────────────────────────────────────────────────────────────
class Auth {

  /* INIT — seed admin is handled by the backend now, nothing to do here */
  static init() {}

  /* CURRENT USER — read from localStorage token */
  static current() {
    return Storage.get('currentUser');
  }

  /* LOGIN UI */
  static show() {
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
    setTimeout(() => document.getElementById("username").focus(), 100);
  }

  /* SIGNUP UI */
  static signupShow() {
    app.innerHTML = `
    <div class="form-box">
      <div class="form-logo">🐾 PetCity</div>
      <h2>Create Account</h2>
      <input id="name" placeholder="Name">
      <input id="surname" placeholder="Surname">
      <input id="age" type="number" placeholder="Age">
      <select id="gender">
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <input id="location" placeholder="Location">
      <hr>
      <input id="username" placeholder="Username">
      <div class="password-box">
        <input id="password" type="password" placeholder="Password">
        <span onclick="Auth.togglePassword()">👁️</span>
      </div>
      <button onclick="Auth.register()">Create Account</button>
    </div>`;
  }

  /* REGISTER */
  static async register() {
    const body = {
      name:     document.getElementById("name").value.trim(),
      surname:  document.getElementById("surname").value.trim(),
      age:      document.getElementById("age").value,
      gender:   document.getElementById("gender").value,
      location: document.getElementById("location").value.trim(),
      username: document.getElementById("username").value.trim(),
      password: document.getElementById("password").value
    };

    if (Object.values(body).some(v => !v)) {
      alert("Please fill all fields"); return;
    }
    if (body.password.length < 8) {
      alert("Password must be at least 8 characters"); return;
    }

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) { alert(data.message); return; }

      alert("Account created successfully!");
      UI.navigate('login');
    } catch {
      alert("Server error. Is the backend running?");
    }
  }

  /* LOGIN */
  static async login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok) { alert(data.message); return; }

      // Save token + user info
      Storage.set('token', data.token);
      Storage.set('currentUser', { ...data.user, u: data.user.username, role: data.user.role });

      UI.updateNavbar();
      window.location.href = "index.html";
    } catch {
      alert("Server error. Is the backend running?");
    }
  }

  /* LOGOUT */
  static logout() {
    Storage.remove('currentUser');
    Storage.remove('token');
    localStorage.setItem("skipSplash", "true");
    window.location.href = "index.html";
  }

  /* PASSWORD TOGGLE */
  static togglePassword() {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
  }

  /* Get auth header for API calls */
  static headers() {
    const token = Storage.get('token');
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  }
}
