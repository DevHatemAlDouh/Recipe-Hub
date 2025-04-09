namespace Dashboard.Models
{
    public class Recipe_details
    {
        public Recipe Recipe { get; set; }
        public ICollection<Ingredient> ingredients { get; set; }
        public ICollection<RecipeIngredient> recipeIngredients { get; set; }
        public List<RecipeIngredient> LrecipeIngredients = new List<RecipeIngredient>();
        public ICollection<Step> steps { get; set; }
        public List<Step> Lsteps = new List<Step>();
        public ICollection<Category> categories { get; set; }
        public List<Category> Lcategories = new List<Category>();
    }
}
