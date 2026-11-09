namespace Dashboard.Models
{
    public class RecipeComments
    {
        public ICollection<Comment> comments {  get; set; }
        public ICollection<User> users { get; set; }
    }
}
