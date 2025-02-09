namespace API.Models
{
    public class UserPermission
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int PermissionID { get; set; }
    }
}
