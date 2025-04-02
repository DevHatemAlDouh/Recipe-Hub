namespace Dashboard.Models
{
    public class Recipes
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string title { get; set; }
        public string description { get; set; }
        public int Rate { get; set; }
        public int View { get; set; }
        public string backgroundImage { get; set; }
        public IFormFile? backgroundImageBase64 { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
