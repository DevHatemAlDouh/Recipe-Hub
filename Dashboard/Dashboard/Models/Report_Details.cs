namespace Dashboard.Models
{
    public class Report_Details
    {
        public Report Report { get; set; }
        public User Reporter { get; set; }
        public User Reported {  get; set; }
    }
}
