using System.Diagnostics.CodeAnalysis;

namespace API.Models
{
    public class Step
    {
        public int Id { get; set; }
        public int RecipeID { get; set; }
        public int StepNumber { get; set; }
        public string Description { get; set; }
        public byte[] BackgroundImage { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }


        // Navigation property
        public Recipe Recipe { get; set; }
    }
}
