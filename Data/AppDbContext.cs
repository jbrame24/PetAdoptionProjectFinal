using Microsoft.EntityFrameworkCore;
using PetCityAPI.Models;

namespace PetCityAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Pet> Pets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed default admin user
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                Username = "admin",
                Password = BCrypt.Net.BCrypt.HashPassword("1234"),
                Role = "admin",
                Name = "Admin",
                Surname = "",
                Age = "",
                Gender = "",
                Location = ""
            });
        }
    }
}
