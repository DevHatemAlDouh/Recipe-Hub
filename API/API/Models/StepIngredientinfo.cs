namespace API.Models
{
    public class StepIngredientinfo
    {
        public int Id { get; set; }
        public int IngredientID { get; set; }
        public int StepID { get; set; }
        public float Quantity { get; set; }
        public string Unit { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
