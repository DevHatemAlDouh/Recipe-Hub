namespace Dashboard.Models
{
    public class User_All_Penalties
    {
        public User user { get; set; }
        public ICollection<Penalty> penalties { get; set; }
        public ICollection<User_Penalty> user_Penalties { get; set; }
    }
}
