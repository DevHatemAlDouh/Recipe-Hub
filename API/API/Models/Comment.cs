using System.Diagnostics.CodeAnalysis;

namespace API.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public int RecipeID { get; set; }
        public int UserID { get; set; }
        public string Description { get; set; }
        public int? SupCommentID { get; set; }
        public int Rate { get; set; }

        public Recipe Recipe { get; set; } // Link back to Recipe
        public User User { get; set; } // Link back to User
        public ICollection<CommentRate> CommentRates { get; set; } // Collection of CommentRates
    }
}
