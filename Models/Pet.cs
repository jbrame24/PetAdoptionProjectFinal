namespace PetCityAPI.Models
{
    public class Pet
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Type { get; set; } = "";
        public string Age { get; set; } = "";
        public string Gender { get; set; } = "";
        public string Breed { get; set; } = "";
        public string Disability { get; set; } = "";
        public string Desc { get; set; } = "";
        public string Image { get; set; } = "";
        public string Status { get; set; } = "Available"; // Available, Pending, Adopted
        public string? AdoptedBy { get; set; }
        public string? AdoptedDate { get; set; }
    }
}
