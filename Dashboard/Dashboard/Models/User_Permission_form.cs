namespace Dashboard.Models
{
    public class User_Permission_form
    {
        public User user { get; set; }
        public User_Permission user_permission { get; set; }
        public ICollection<Permission> permissions { get; set; }
    }
}
