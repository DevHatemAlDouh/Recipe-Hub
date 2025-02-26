namespace API.Models
{
    public class RecipeRate
    {
        public int Id { get; set; }
        public int RecipeID { get; set; }
        public int UserID { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public Recipe Recipe { get; set; } // Navigation to Recipe
        public User User { get; set; } // Navigation to User
    }
}
