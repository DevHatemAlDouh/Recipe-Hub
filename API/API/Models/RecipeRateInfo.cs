namespace API.Models
{
    public class RecipeRateInfo
    {
        public int Id { get; set; }
        public int RecipeID { get; set; }
        public int UserID { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
