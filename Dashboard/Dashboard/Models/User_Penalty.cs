namespace Dashboard.Models
{
    public class User_Penalty
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int PenaltyID { get; set; }
        public bool IsActive { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
