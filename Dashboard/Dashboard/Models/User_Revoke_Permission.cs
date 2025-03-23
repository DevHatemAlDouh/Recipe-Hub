namespace Dashboard.Models
{
    public class User_Revoke_Permission
    {
        public User user { get; set; }
        public Permission permission { get; set; }
        public User_Permission user_permission { get; set; }
    }
}
