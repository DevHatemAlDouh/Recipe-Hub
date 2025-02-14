namespace API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        public string CountryCode { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public ICollection<Recipe> Recipes { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<CommentRate> CommentRates { get; set; }
        public ICollection<RecipeRate> RecipeRates { get; set; }
        public ICollection<UserPenalty> UserPenalties { get; set; }
        public ICollection<UserPermission> UserPermissions { get; set; }
        public ICollection<Report> Reports { get; set; } // Add this line to fix the error
    }
}