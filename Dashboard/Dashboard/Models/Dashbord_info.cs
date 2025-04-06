using System.Security.Cryptography.Pkcs;

namespace Dashboard.Models
{
    public class Dashbord_info
    {
        public int Totle_Recipes { get; set; }
        public int Totle_Views { get; set; }
        public int Totle_Likes { get; set; }
        public int Totle_Users { get; set; }
        public int Totle_users_that_likes_on_recipes { get; set; }
        public int Totle_users_that_comments_on_recipes { get; set; }
        public int Totle_users_that_likes_on_comments { get; set; }
        public ICollection<Recipe> recipes { get; set; }
    }
}
