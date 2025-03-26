namespace API.Models
{
    public class RecipeIngredient
    {
        public int Id { get; set; }
        public int IngredientID { get; set; }
        public int RecipeID { get; set; }
        public float Quantity { get; set; }
        public string Unit { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public Ingredient Ingredient { get; set; }
        public Recipe recipe { get; set; }
    }
}
