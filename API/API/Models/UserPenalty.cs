namespace API.Models
{
    public class UserPenalty
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int PenaltyID { get; set; }

        // Navigation properties
        public User User { get; set; } // Navigation to User
        public Penalty Penalty { get; set; } // Navigation to Penalty
    }
}
