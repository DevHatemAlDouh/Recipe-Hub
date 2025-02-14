namespace API.Models
{
    public class Suggestion
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public int StepID { get; set; }
        public string Description { get; set; }

        public User User { get; set; }
        public Step Step { get; set; }
    }
}
