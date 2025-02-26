namespace API.Models
{
    public class FavoriteInfo
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int IngredientID { get; set; }
        public string Type { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
