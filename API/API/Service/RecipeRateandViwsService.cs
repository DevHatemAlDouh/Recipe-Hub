using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API.Service
{
    public class RecipeRateandViwsService
    {
        private readonly APIContext _context;
        public RecipeRateandViwsService(APIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RecipeRateInfo>> GetAll()
        {
            var recipes = await _context.RecipeRates.Select(u => new RecipeRateInfo
            {
                Id = u.Id,
                UserID = u.UserID,
                RecipeID = u.RecipeID,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,

            }).ToListAsync();

            if (!recipes.Any())
            {
                return new List<RecipeRateInfo>();
            }

            return recipes;
        }

        public async Task<RecipeRateInfo> GetById(int id)
        {
            var recipe = await _context.RecipeRates.FirstOrDefaultAsync(r => r.Id == id);
            if (recipe == null) return null;

            return new RecipeRateInfo
            {
                Id = recipe.Id,
                UserID = recipe.UserID,
                RecipeID = recipe.RecipeID,
                CreatedAt = recipe.CreatedAt,
                UpdatedAt = recipe.UpdatedAt
            };
        }

        public async Task Add(RecipeRateInfo entity)
        {
            var recipeRate = new RecipeRate
            {
                UserID = entity.UserID,
                RecipeID = entity.RecipeID,
                CreatedAt = DateTime.Now
            };
            await _context.RecipeRates.AddAsync(recipeRate);
            await _context.SaveChangesAsync();
            entity.Id = recipeRate.Id; // Update the entity with the generated Id

        }

        public async Task Delete(int id)
        {
            var recipeRate = await GetAll();
            if (recipeRate != null)
            {
                foreach (var rate in recipeRate)
                {
                    if (rate.RecipeID == id)
                    {
                        var reciperate = await _context.RecipeRates.FirstOrDefaultAsync(f => f.RecipeID == rate.RecipeID);
                        _context.RecipeRates.Remove(reciperate);
                        await _context.SaveChangesAsync();
                    }
                }
                
            }
        }

        public async Task UpdateRate(int recipeID)
        {
            var recipeRates = await _context.RecipeRates.Where(rr => rr.RecipeID == recipeID).ToListAsync();
            var Count = recipeRates.Count;
            var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == recipeID);
            recipe.Rate = Count;
            _context.Recipes.Update(recipe);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateView(int recipeID)
        {
            var recipe = await _context.Recipes.FirstOrDefaultAsync(rv => rv.Id == recipeID);
            recipe.View += 1;
            _context.Recipes.Update(recipe);
            await _context.SaveChangesAsync();
        }
    }
}
