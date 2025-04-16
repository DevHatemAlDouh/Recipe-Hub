namespace API.Models
{
    public class UserPenalty
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int PenaltyID { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public User User { get; set; } // Navigation to User
        public Penalty Penalty { get; set; } // Navigation to Penalty
    }
}
