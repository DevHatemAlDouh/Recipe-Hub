namespace Dashboard.Models
{
    public class Suggestion
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int RecipeID { get; set; }
        public string description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
