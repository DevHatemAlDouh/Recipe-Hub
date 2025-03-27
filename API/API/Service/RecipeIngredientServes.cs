using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class RecipeIngredientServes
    {
        private readonly APIContext _context;
        public RecipeIngredientServes(APIContext context)
        {
            _context = context;
        }

        public async Task Add(RecipeIngredientinfo entity)
        {
            var recipeIngredient = new RecipeIngredient
            {
                RecipeID = entity.RecipeID,
                IngredientID = entity.IngredientID,
                Quantity = entity.Quantity,
                Unit = entity.Unit,
                CreatedAt = DateTime.Now
            };
            await _context.RecipeIngredients.AddAsync(recipeIngredient);
            await _context.SaveChangesAsync();
            entity.Id = recipeIngredient.Id; // Update the entity with the generated Id

        }

        public async Task Delete(int id)
        {
           
            var recipeIngredient = await GetAll();
            if (recipeIngredient != null)
            {
                foreach (var Ingredient in recipeIngredient)
                {
                    if (Ingredient.RecipeID == id)
                    {
                        var recipeingredient = await _context.RecipeIngredients.FirstOrDefaultAsync(f => f.RecipeID == Ingredient.RecipeID);
                        _context.RecipeIngredients.Remove(recipeingredient);
                        await _context.SaveChangesAsync();
                    }
                    
                }
               
            }
        }

        public async Task<IEnumerable<RecipeIngredientinfo>> GetAll()
        {
            return await _context.RecipeIngredients.Select(f => new RecipeIngredientinfo
            {
                Id = f.Id,
                RecipeID = f.RecipeID,
                IngredientID = f.IngredientID,
                Quantity = f.Quantity,
                Unit = f.Unit,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt
            }).ToListAsync();
        }

        public async Task<IEnumerable<RecipeIngredientinfo>> GetById(int id)
        {
            var stepIngredient = await _context.RecipeIngredients.FirstOrDefaultAsync(f => f.RecipeID == id);
            if (stepIngredient == null) return null;

            return await _context.RecipeIngredients.Select(f => new RecipeIngredientinfo
            {
                Id = f.Id,
                RecipeID = f.RecipeID,
                IngredientID = f.IngredientID,
                Quantity = f.Quantity,
                Unit = f.Unit,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt
            }).ToListAsync();
        }

        public async Task Update(RecipeIngredientinfo entity)
        {
            var stepIngredient = await _context.RecipeIngredients.FirstOrDefaultAsync(u => u.RecipeID == entity.Id);
            if (stepIngredient != null)
            {
                stepIngredient.RecipeID = entity.RecipeID;
                stepIngredient.IngredientID = entity.IngredientID;
                stepIngredient.Quantity = entity.Quantity;
                stepIngredient.Unit = entity.Unit;
                stepIngredient.CreatedAt = entity.CreatedAt;
                stepIngredient.UpdatedAt = DateTime.Now;

                _context.RecipeIngredients.Update(stepIngredient);
                await _context.SaveChangesAsync();
            }
        }
    }
}
