namespace API.Models
{
    public class Report
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public int PermissionID { get; set; }
        public DateTime TimeOut { get; set; }
    }
}
