namespace Dashboard.Models
{
    public class Step
    {
        public int Id { get; set; }
        public int RecipeID { get; set; }
        public int StepNumber { get; set; }
        public string description { get; set; }
        public string backgroundImage { get; set; }
        public IFormFile? backgroundImageBase64 { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
