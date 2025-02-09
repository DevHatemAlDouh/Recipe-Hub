namespace API.Models
{
    public class Recipe
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public byte[] BackgroundImage { get; set; }
        public string Description { get; set; }

        // Navigation properties
        public ICollection<CommentRate> CommentRates { get; set; } // Add this line
        public ICollection<Comment> Comments { get; set; } // If you have comments
        public ICollection<RecipeRate> RecipeRates { get; set; } // If you have recipe ratings
        public ICollection<Step> Steps { get; set; } // If you have steps
    }
}