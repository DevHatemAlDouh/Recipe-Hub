namespace API.Models
{
    public class CommentRate
    {
        public int ID { get; set; }
        public int RecipeID { get; set; }
        public int CommentID { get; set; }
        public int Rate { get; set; }
    }
}
