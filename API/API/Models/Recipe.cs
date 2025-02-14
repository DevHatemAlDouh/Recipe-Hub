namespace API.Models
{
    public class Recipe
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public string Title { get; set; }
        public byte[] BackgroundImage { get; set; }
        public string Description { get; set; }
        public int Rate { get; set; }

        // Navigation properties
        public User User { get; set; } // Link back to User
        public ICollection<Comment> Comments { get; set; } // If you have comments
        public ICollection<RecipeRate> RecipeRates { get; set; } // If you have recipe ratings
        public ICollection<Step> Steps { get; set; } // If you have steps
    }
}