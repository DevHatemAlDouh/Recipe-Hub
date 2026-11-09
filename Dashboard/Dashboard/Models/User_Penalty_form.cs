namespace Dashboard.Models
{
    public class User_Penalty_form
    {
        public User user { get; set; }
        public User_Penalty user_Penalty { get; set; }
        public ICollection<Penalty> penalties { get; set; }
    }
}
