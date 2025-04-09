namespace Dashboard.Models
{
    public class RecipeCategory
    {
        public int Id { get; set; }
        public int CategoryID { get; set; }
        public int RecipeID { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
