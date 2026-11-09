namespace Dashboard.Models
{
    public class Penalty
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime TimeOut { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
