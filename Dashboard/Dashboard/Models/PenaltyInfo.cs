namespace Dashboard.Models
{
    public class PenaltyInfo
    {
        public Penalty penalty {  get; set; }
        public ICollection<Terms> terms { get; set; }
        public ICollection<Permission> permissions { get; set; }
        public List<Terms> Lterms { get; set; }
    }
}
