using API.Data;
using API.Models;

namespace API.Service
{
    public class UserRecipes
    {
        private readonly APIContext _context;

        public UserRecipes(APIContext context)
        {
            _context = context;
        }
        public IEnumerable<RecipeInfo> GetAll(int ID)
        {
            return _context.Recipes.Select(r => new RecipeInfo
            {
                Id = r.Id,
                UserID = r.UserID,
                Description = r.Description,
                BackgroundImage = r.BackgroundImage,
                Title = r.Title
            }).Where(r => r.UserID == ID).ToList();
        }
    }
}
