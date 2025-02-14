using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API.Service
{
    public class RecipeRateService
    {
        private readonly APIContext _context;
        public RecipeRateService(APIContext context)
        {
            _context = context;
        }

        public async Task<RecipeRateInfo> GetById(int id)
        {
            var recipe = await _context.RecipeRates.FirstOrDefaultAsync(r => r.Id == id);
            if (recipe == null) return null;

            return new RecipeRateInfo
            {
                Id = recipe.Id,
                UserID = recipe.UserID,
                RecipeID = recipe.RecipeID
            };
        }

        public async Task Add(RecipeRateInfo entity)
        {
            var recipeRate = new RecipeRate
            {
                UserID = entity.UserID,
                RecipeID = entity.RecipeID,
            };
            await _context.RecipeRates.AddAsync(recipeRate);
            await _context.SaveChangesAsync();
            entity.Id = recipeRate.Id; // Update the entity with the generated Id

        }

        public async Task Delete(int id)
        {
            var recipeRate = await _context.RecipeRates.FirstOrDefaultAsync(f => f.Id == id);
            if (recipeRate != null)
            {
                _context.RecipeRates.Remove(recipeRate);
                await _context.SaveChangesAsync();
            }
        }

        public async Task Update(int recipeID)
        {
            var recipeRates = await _context.RecipeRates.Where(rr => rr.RecipeID == recipeID).ToListAsync();
            var Count = recipeRates.Count;
            var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == recipeID);
            recipe.Rate = Count;
            _context.Recipes.Update(recipe);
        }
    }
}
