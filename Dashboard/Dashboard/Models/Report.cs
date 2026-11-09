namespace Dashboard.Models
{
    public class Report
    {
        public int Id { get; set; }
        public int fromUserid { get; set; }
        public int atoUserid { get; set; }
        public string type { get; set; }
        public string description { get; set; }
        public bool resolved { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
