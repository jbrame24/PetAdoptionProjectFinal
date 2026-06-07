# 🐾 PetCity Backend — ASP.NET Core + SQLite

## Requirements
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)

---

## 📁 Project Structure

```
PetCityAPI/
├── Controllers/
│   ├── AuthController.cs      ← Register & Login
│   └── PetsController.cs      ← All pet endpoints
├── Data/
│   └── AppDbContext.cs        ← SQLite database context
├── Middleware/
│   └── JwtHelper.cs           ← JWT token generation
├── Models/
│   ├── User.cs
│   └── Pet.cs
├── Program.cs                 ← App startup & config
├── appsettings.json           ← DB path & JWT secret
└── PetCityAPI.csproj
```

---

## 🚀 How to Run

### 1. Open terminal in the `PetCityAPI/` folder

### 2. Install dependencies
```bash
dotnet restore
```

### 3. Create the database & apply migrations
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4. Run the server
```bash
dotnet run
```

The API will start at: **http://localhost:5062**  
Swagger UI (API tester): **http://localhost:5062/swagger**

---

## 🔗 Connect Frontend

In your `pet/` frontend folder:

1. Replace `js/auth.js` with `frontend-auth.js`
2. Replace `js/pets.js` with `frontend-pets.js`
3. Make sure the API URL in both files matches your port:
   ```js
   const API = "http://localhost:5062/api";
   ```
4. Open `index.html` with **Live Server** (VS Code extension) so CORS works

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login → returns JWT token |
| GET | `/api/pets` | ❌ | Get all pets |
| GET | `/api/pets/{id}` | ❌ | Get single pet |
| POST | `/api/pets` | 👑 Admin | Add new pet |
| PUT | `/api/pets/{id}` | 👑 Admin | Edit pet |
| DELETE | `/api/pets/{id}` | 👑 Admin | Delete pet |
| PUT | `/api/pets/{id}/request` | 👤 User | Request adoption |
| PUT | `/api/pets/{id}/approve` | 👑 Admin | Approve adoption |
| PUT | `/api/pets/{id}/deny` | 👑 Admin | Deny adoption |

---

## 🔑 Default Admin Account

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `1234` |

---

## 🛡️ Authentication

All protected endpoints require a Bearer token in the header:
```
Authorization: Bearer <your_jwt_token>
```
The token is returned on login and stored automatically by the frontend.
