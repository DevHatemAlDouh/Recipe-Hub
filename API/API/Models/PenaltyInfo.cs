namespace API.Models
{
    public class PenaltyInfo
    {
        public int Id { get; set; }
        public int Type { get; set; }
        public string Description { get; set; }
        public DateTime TimeOut { get; set; }
    }
}
