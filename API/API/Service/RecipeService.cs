using API.Data;
using API.Models;

namespace API.Service
{
    public class RecipeService : ICRUD<RecipeInfo>
    {
        private readonly APIContext _context;

        public RecipeService(APIContext context)
        {
            _context = context;
        }

        public void Add(RecipeInfo entity)
        {
            var recipe = new Recipe
            {
                Id = entity.Id,
                UserID = entity.UserID,
                Description = entity.Description,
                BackgroundImage = entity.BackgroundImage,
                Title = entity.Title,

                Comments = new List<Comment>(),
                CommentRates = new List<CommentRate>(),
                RecipeRates = new List<RecipeRate>(),
                Steps = new List<Step>()

            };
            _context.Recipes.Add(recipe);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            // Start by retrieving the user directly from the context
            var recipe = _context.Recipes.FirstOrDefault(r => r.Id == id);

            // Check if the user exists
            if (recipe != null)
            {
                // Remove the user from the context
                _context.Recipes.Remove(recipe);
                // Save changes to the database
                _context.SaveChanges();
            }
        }

        public IEnumerable<RecipeInfo> GetAll()
        {
            return _context.Recipes.Select(u => new RecipeInfo
            {
                Id = u.Id,
                UserID = u.UserID,
                Description = u.Description,
                BackgroundImage = u.BackgroundImage,
                Title = u.Title
            }).ToList();
        }

        public RecipeInfo GetById(int id)
        {
            var recipe = _context.Recipes.FirstOrDefault(r => r.Id == id);
            if (recipe == null) return null;

            return new RecipeInfo
            {
                Id = recipe.Id,
                UserID = recipe.UserID,
                BackgroundImage = recipe.BackgroundImage,
                Description = recipe.Description,
                Title = recipe.Title
            };
        }

        public void Update(RecipeInfo entity)
        {
            var recipe = _context.Recipes.FirstOrDefault(r => r.Id == entity.Id);

            if (recipe != null)
            {
                recipe.Title = entity.Title;
                recipe.Description = entity.Description;
                recipe.BackgroundImage = entity.BackgroundImage;

                _context.Recipes.Update(recipe);
                _context.SaveChanges();
            }
        }
    }
}
