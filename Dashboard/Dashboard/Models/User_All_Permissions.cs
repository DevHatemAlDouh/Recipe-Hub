namespace Dashboard.Models
{
    public class User_All_Permissions
    {
        public User user { get; set; }
        public ICollection<Permission> permission { get; set; }
        public ICollection<User_Permission> user_permission { get; set; }
    }
}
