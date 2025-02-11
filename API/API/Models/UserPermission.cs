namespace API.Models
{
    public class UserPermission
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int PermissionID { get; set; }

        public Permission Permission { get; set; } // Link back to Recipe
        public User User { get; set; } // Link back to User
    }
}
