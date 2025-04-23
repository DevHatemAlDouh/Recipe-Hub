namespace API.Models
{
    public class SuggestionInfo
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int RecipeID { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
