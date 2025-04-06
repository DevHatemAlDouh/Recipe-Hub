namespace Dashboard.Models
{
    public class RecipeIngredient
    {
        public int Id { get; set; }
        public int IngredientID { get; set; }
        public int RecipeID { get; set; }
        public int quantity { get; set; }
        public string unit { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
