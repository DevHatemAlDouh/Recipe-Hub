namespace API.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int IngredientID { get; set; }
        public string Type { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual User User { get; set; }
        public virtual Ingredient Ingredient { get; set; }
    }
}
