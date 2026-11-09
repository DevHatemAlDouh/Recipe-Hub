namespace API.Models
{
    public class TermsInfo
    {
        public int Id { get; set; }
        public int penaltyid { get; set; }
        public int permissionid { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
