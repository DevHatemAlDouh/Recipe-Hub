namespace API.Models
{
    public class StepIngredient
    {
        public int ID { get; set; }
        public int IngredientID { get; set; }
        public int RecipeID { get; set; }
        public float Quantity { get; set; }
        public string Unit { get; set; }
    }
}
