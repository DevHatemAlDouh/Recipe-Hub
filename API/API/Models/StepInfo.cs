namespace API.Models
{
    public class StepInfo
    {
        public int Id { get; set; }
        public int RecipeID { get; set; }
        public int StepNumber { get; set; }
        public string Description { get; set; }
        public byte[] BackgroundImage { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
