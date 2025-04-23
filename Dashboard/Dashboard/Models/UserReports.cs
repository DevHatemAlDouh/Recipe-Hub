namespace Dashboard.Models
{
    public class UserReports
    {
        public ICollection<User> users { get; set; }
        public ICollection<Report> reports { get; set; }
    }
}
