using System.Diagnostics.CodeAnalysis;

namespace API.Models
{
    public class Report
    {
        public int Id { get; set; }
        public int FromUserID { get; set; }
        public int AtUserID { get; set; }
        public string Type { get; set; }
        public string? Description { get; set; }
        public bool Resolved { get; set; }
    }
}
