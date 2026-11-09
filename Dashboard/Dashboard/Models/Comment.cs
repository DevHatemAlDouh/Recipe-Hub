namespace Dashboard.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int recipeid { get; set; }
        public int userid { get; set; }
        public int? supCommentid { get; set; }
        public string description { get; set; }
        public int? rate { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
