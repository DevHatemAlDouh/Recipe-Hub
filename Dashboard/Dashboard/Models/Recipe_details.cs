namespace Dashboard.Models
{
    public class Recipe_details
    {
        public Recipes Recipe { get; set; }
        public ICollection<Ingredient> ingredients { get; set; }
        public ICollection<Steps> steps { get; set; }
        public ICollection<Category> categories { get; set; }
    }
}
