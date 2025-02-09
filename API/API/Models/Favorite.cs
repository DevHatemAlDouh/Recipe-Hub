namespace API.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int IngredientID { get; set; }
        public string Type { get; set; }
    }
}
