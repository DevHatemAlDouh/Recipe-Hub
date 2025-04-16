namespace API.Models
{
    public class UserPenaltyInfo
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int PenaltyID { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
