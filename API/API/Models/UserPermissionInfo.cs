namespace API.Models
{
    public class UserPermissionInfo
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int PermissionID { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
