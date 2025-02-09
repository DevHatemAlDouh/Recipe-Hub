namespace API.Models
{
    public class Ingredient
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        // Add this collection property
        public ICollection<StepIngredient> StepIngredients { get; set; } // Navigation property for StepIngredients
    }
}