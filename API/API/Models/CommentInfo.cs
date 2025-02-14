namespace API.Models
{
    public class CommentInfo
    {
        public int Id { get; set; }
        public int RecipeID { get; set; }
        public int UserID { get; set; }
        public string Description { get; set; }
        public int? SupCommentID { get; set; }
        public int? Rate { get; set; }
    }
}
