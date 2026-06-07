using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetCityAPI.Data;
using PetCityAPI.Models;
using System.Security.Claims;

namespace PetCityAPI.Controllers
{
    [ApiController]
    [Route("api/pets")]
    public class PetsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PetsController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/pets
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pets = await _db.Pets.ToListAsync();
            return Ok(pets);
        }

        // GET /api/pets/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pet = await _db.Pets.FindAsync(id);
            if (pet == null) return NotFound(new { message = "Pet not found" });
            return Ok(pet);
        }

        // POST /api/pets  (Admin only)
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Add([FromBody] PetDto dto)
        {
            var pet = new Pet
            {
                Name = dto.Name,
                Type = dto.Type,
                Age = dto.Age,
                Gender = dto.Gender,
                Breed = dto.Breed,
                Disability = dto.Disability,
                Desc = dto.Desc,
                Image = dto.Image,
                Status = "Available"
            };

            _db.Pets.Add(pet);
            await _db.SaveChangesAsync();

            return Ok(pet);
        }

        // PUT /api/pets/{id}  (Admin only)
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromBody] PetDto dto)
        {
            var pet = await _db.Pets.FindAsync(id);
            if (pet == null) return NotFound(new { message = "Pet not found" });

            pet.Name = dto.Name;
            pet.Type = dto.Type;
            pet.Age = dto.Age;
            pet.Gender = dto.Gender;
            pet.Breed = dto.Breed;
            pet.Disability = dto.Disability;
            pet.Desc = dto.Desc;
            if (!string.IsNullOrEmpty(dto.Image)) pet.Image = dto.Image;

            await _db.SaveChangesAsync();
            return Ok(pet);
        }

        // DELETE /api/pets/{id}  (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var pet = await _db.Pets.FindAsync(id);
            if (pet == null) return NotFound(new { message = "Pet not found" });

            _db.Pets.Remove(pet);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Pet deleted" });
        }

        // PUT /api/pets/{id}/request  (Logged-in user)
        [HttpPut("{id}/request")]
        [Authorize]
        public async Task<IActionResult> RequestAdoption(int id)
        {
            var pet = await _db.Pets.FindAsync(id);
            if (pet == null) return NotFound(new { message = "Pet not found" });

            if (pet.Status != "Available")
                return BadRequest(new { message = "Pet is not available" });

            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            pet.Status = "Pending";
            pet.AdoptedBy = username;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Adoption request sent 📩" });
        }

        // PUT /api/pets/{id}/approve  (Admin only)
        [HttpPut("{id}/approve")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Approve(int id)
        {
            var pet = await _db.Pets.FindAsync(id);
            if (pet == null) return NotFound(new { message = "Pet not found" });

            pet.Status = "Adopted";
            pet.AdoptedDate = DateTime.Now.ToShortDateString();

            await _db.SaveChangesAsync();
            return Ok(new { message = "Adoption approved ✅" });
        }

        // PUT /api/pets/{id}/deny  (Admin only)
        [HttpPut("{id}/deny")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Deny(int id)
        {
            var pet = await _db.Pets.FindAsync(id);
            if (pet == null) return NotFound(new { message = "Pet not found" });

            pet.Status = "Available";
            pet.AdoptedBy = null;

            await _db.SaveChangesAsync();
            return Ok(new { message = "Request denied ❌" });
        }
    }

    // ── DTO ───────────────────────────────────────────────────────────────────

    public class PetDto
    {
        public string Name { get; set; } = "";
        public string Type { get; set; } = "";
        public string Age { get; set; } = "";
        public string Gender { get; set; } = "";
        public string Breed { get; set; } = "";
        public string Disability { get; set; } = "";
        public string Desc { get; set; } = "";
        public string Image { get; set; } = "";
    }
}
