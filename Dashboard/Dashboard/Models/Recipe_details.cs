namespace Dashboard.Models
{
    public class Recipe_details
    {
        public Recipe Recipe { get; set; }
        public Ingredient ingredient { get; set; }
        public RecipeIngredient recipeIngredient { get; set; }
        public Step step { get; set; }
        public Category categorie { get; set; }
        public ICollection<Ingredient> ingredients { get; set; }
        public ICollection<RecipeIngredient> recipeIngredients { get; set; }
        public ICollection<Step> steps { get; set; }
        public ICollection<Category> categories { get; set; }
    }
}
