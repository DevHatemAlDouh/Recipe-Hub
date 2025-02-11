namespace API.Models
{
    public class Permission
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public ICollection<UserPermission> UserPermissions { get; set; }
    }
}
