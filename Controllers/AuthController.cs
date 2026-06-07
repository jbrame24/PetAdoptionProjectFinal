using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetCityAPI.Data;
using PetCityAPI.Middleware;
using PetCityAPI.Models;

namespace PetCityAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        // POST /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.Username == dto.Username))
                return BadRequest(new { message = "Username already exists" });

            if (dto.Password.Length < 8)
                return BadRequest(new { message = "Password must be at least 8 characters" });

            var user = new User
            {
                Username = dto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "user",
                Name = dto.Name,
                Surname = dto.Surname,
                Age = dto.Age,
                Gender = dto.Gender,
                Location = dto.Location
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Account created successfully!" });
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Unauthorized(new { message = "Wrong credentials" });

            var secret = _config["Jwt:Secret"]!;
            var token = JwtHelper.GenerateToken(user.Id, user.Username, user.Role, secret);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Username,
                    user.Role,
                    user.Name,
                    user.Surname,
                    user.Location
                }
            });
        }
    }

    // ── DTOs ──────────────────────────────────────────────────────────────────

    public class RegisterDto
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public string Age { get; set; } = "";
        public string Gender { get; set; } = "";
        public string Location { get; set; } = "";
    }

    public class LoginDto
    {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
    }
}
