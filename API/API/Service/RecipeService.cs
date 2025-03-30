using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class RecipeService : ICRUDService<RecipeInfo>
    {
        private readonly APIContext _context;

        public RecipeService(APIContext context)
        {
            _context = context;
        }

        public async Task Add(RecipeInfo entity)
        {
            var recipe = new Recipe
            {
                UserID = entity.UserID,
                Description = entity.Description,
                BackgroundImage = entity.BackgroundImage,
                Title = entity.Title,
                CreatedAt = DateTime.Now,
                Comments = new List<Comment>(),
                RecipeRates = new List<RecipeRate>(),
                Steps = new List<Step>(),
                RecipeIngredients = new List<RecipeIngredient>(),
                
            };
            await _context.Recipes.AddAsync(recipe);
            await _context.SaveChangesAsync();
            entity.Id = recipe.Id; // Update the entity with the generated Id
        }

        public async Task Delete(int id)
        {
            // Start by retrieving the user directly from the context
            var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == id);

            // Check if the user exists
            if (recipe != null)
            {
                // Remove the user from the context
                _context.Recipes.Remove(recipe);
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<RecipeInfo>> GetAll()
        {
            var recipes = await _context.Recipes.Select(u => new RecipeInfo
            {
                Id = u.Id,
                UserID = u.UserID,
                Description = u.Description,
                BackgroundImage = u.BackgroundImage,
                Title = u.Title,
                Rate = u.Rate,
                View = u.View,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,

            }).ToListAsync();

            if (!recipes.Any())
            {
                return new List<RecipeInfo>();
            }

            return recipes;
        }

        public async Task<RecipeInfo> GetById(int id)
        {
            var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == id);
            if (recipe == null) return null;

            return new RecipeInfo
            {
                Id = recipe.Id,
                UserID = recipe.UserID,
                BackgroundImage = recipe.BackgroundImage,
                Description = recipe.Description,
                Title = recipe.Title,
                Rate = recipe.Rate,
                View = recipe.View,
                CreatedAt = recipe.CreatedAt,
                UpdatedAt = recipe.UpdatedAt,
            };
        }

        public async Task Update(RecipeInfo entity)
        {
            var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == entity.Id);

            if (recipe != null)
            {
                recipe.Title = entity.Title;
                recipe.Description = entity.Description;
                recipe.BackgroundImage = entity.BackgroundImage;

                _context.Recipes.Update(recipe);
                await _context.SaveChangesAsync();
            }
        }
    }
}
