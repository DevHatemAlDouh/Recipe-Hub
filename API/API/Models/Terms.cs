namespace API.Models
{
    public class Terms
    {
        public int Id { get; set; }
        public int penaltyid { get; set; }
        public int permissionid { get; set; } 
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Permission permission { get; set; }
        public Penalty penalty { get; set; }
    }
}
