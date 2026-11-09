namespace API.Models
{
    public class Suggestion
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int RecipeID { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public User User { get; set; }
        public Recipe Recipe { get; set; }
    }
}
