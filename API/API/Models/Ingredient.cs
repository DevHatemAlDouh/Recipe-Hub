namespace API.Models
{
    public class Ingredient
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public ICollection<StepIngredient> StepIngredients { get; set; }
        public ICollection<Favorite> Favorites { get; set; }
    }
}