namespace API.Models
{
    public class RecipeInfo
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        public string Title { get; set; }
        public byte[] BackgroundImage { get; set; }
        public string Description { get; set; }
        public int Rate { get; set; }
    }
}
