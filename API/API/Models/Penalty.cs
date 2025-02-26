namespace API.Models
{
    public class Penalty
    {
        public int Id { get; set; }
        public int Type { get; set; }
        public string Description { get; set; }
        public DateTime TimeOut { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation property
        public ICollection<UserPenalty> UserPenalties { get; set; } // Collection of UserPenalties
    }
}
