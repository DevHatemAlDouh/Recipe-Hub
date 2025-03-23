namespace Dashboard.Models
{
    public class User_Permission
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int PermissionID { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}