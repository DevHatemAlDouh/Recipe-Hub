namespace API.Models
{
    public class CommentRate
    {
        public int Id { get; set; }
        public int CommentID { get; set; }
        public int UserID { get; set; }
        public bool Rate { get; set; }

        // Optional: Navigation properties
        public Comment Comment { get; set; } // Include if you need it
        public User User { get; set; } // Include if you need it
    }
}