namespace API.Models
{
    public class Algorithm
    {
        public UserInfo User { get; set; }
        public RecipeInfo Recipe { get; set; }
        public ICollection<Commenters> Commenters { get; set; }
        public ICollection<IngredientInfo> ingredients { get; set; }
    }
}
