namespace API.Models
{
    public class CommentRateInfo
    {
        public int Id { get; set; }
        public int CommentID { get; set; }
        public int UserID { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
