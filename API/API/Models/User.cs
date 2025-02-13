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
        // Add this collection property
        public ICollection<Recipe> Recipes { get; set; } // Navigation property for Comments
        public ICollection<Comment> Comments { get; set; } // Navigation property for Comments
        public ICollection<CommentRate> CommentRates { get; set; } // Collection of CommentRates
        public ICollection<RecipeRate> RecipeRates { get; set; } // If you have recipe ratings
        public ICollection<UserPenalty> UserPenalties { get; set; } // If you have user penalties
        public ICollection<UserPermission> UserPermissions { get; set; }
    }
}