using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class UserRecipes
    {
        private readonly APIContext _context;

        public UserRecipes(APIContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<RecipeInfo>> GetAll(int ID)
        {
            var recipes = await _context.Recipes
                .Where(r => r.UserID == ID)
                .Select(r => new RecipeInfo
                {
                    Id = r.Id,
                    UserID = r.UserID,
                    Description = r.Description,
                    BackgroundImage = r.BackgroundImage,
                    Title = r.Title,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                }).ToListAsync();

            if (!recipes.Any())
            {
                return new List<RecipeInfo>();
            }

            return recipes;
        }
    }
}
