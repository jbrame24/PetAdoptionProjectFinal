namespace PetCityAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public string Role { get; set; } = "user"; // "user" or "admin"
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public string Age { get; set; } = "";
        public string Gender { get; set; } = "";
        public string Location { get; set; } = "";
    }
}
