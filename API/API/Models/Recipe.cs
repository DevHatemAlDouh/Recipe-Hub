namespace API.Models
{
    public class Recipe
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public string Title { get; set; }
        public byte[] BackgroundImage { get; set; }
        public string Description { get; set; }
        public int persons { get; set; }
        public int? Rate { get; set; }
        public int? View { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public User User { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<RecipeRate> RecipeRates { get; set; }
        public ICollection<Step> Steps { get; set; }
        public ICollection<Suggestion> Suggestions { get; set; }
        public ICollection<RecipeCategory> RecipeCategories { get; set; } 
        public ICollection<RecipeIngredient> RecipeIngredients { get; set; }
    }
}