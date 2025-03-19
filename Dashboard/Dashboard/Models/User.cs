namespace Dashboard.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        public string CountryCode { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserImage { get; set; }
        public string CreatedAt { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
