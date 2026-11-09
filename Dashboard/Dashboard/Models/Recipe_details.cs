namespace Dashboard.Models
{
    public class Recipe_details
    {
        public Recipe Recipe { get; set; }
        public ICollection<Step> steps { get; set; }
        public List<Step> Lsteps = new List<Step>();
        public ICollection<Category> categories { get; set; }
        public ICollection<Ingredient> ingredients { get; set; }
        public ICollection<RecipeCategory> recipeCategories { get; set; }
        public List<RecipeCategory> LrecipeCategories = new List<RecipeCategory>();
        public ICollection<RecipeIngredient> recipeIngredients { get; set; }
        public List<RecipeIngredient> LrecipeIngredients = new List<RecipeIngredient>();
    }
}
