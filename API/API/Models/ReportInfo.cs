namespace API.Models
{
    public class ReportInfo
    {
        public int Id { get; set; }
        public int FromUserID { get; set; }
        public int AtUserID { get; set; }
        public string Type { get; set; }
        public string? Description { get; set; }
        public bool Resolved { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
