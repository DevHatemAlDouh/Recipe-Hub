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

        public async Task<RecipeIngredientinfo> GetById(int id)
        {
            var recipeIngredient = await _context.RecipeIngredients.FirstOrDefaultAsync(p => p.Id == id);
            if (recipeIngredient == null) return null;

            return new RecipeIngredientinfo
            {
                Id = recipeIngredient.Id,
                IngredientID = recipeIngredient.IngredientID,
                Quantity = recipeIngredient.Quantity,
                Unit = recipeIngredient.Unit,
                CreatedAt = recipeIngredient.CreatedAt,
                UpdatedAt = recipeIngredient.UpdatedAt
            };
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

        public async Task DeleteAll(int id)
        {
           
            var recipeIngredient = await GetAll(id);
            if (recipeIngredient != null)
            {
                foreach (var Ingredient in recipeIngredient)
                {
                    await Delete(Ingredient.Id);
                }
               
            }
        }

        public async Task Delete(int id)
        {

            var recipeIngredient = await GetById(id);
            if (recipeIngredient != null)
            {
                    var recipeingredient = await _context.RecipeIngredients.FirstOrDefaultAsync(f => f.Id == id);
                    _context.RecipeIngredients.Remove(recipeingredient);
                    await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<RecipeIngredientinfo>> GetAll(int RecipeID)
        {
            var recipeIngredient = await _context.RecipeIngredients
                .Where(r => r.RecipeID == RecipeID)
                .Select(r => new RecipeIngredientinfo
                {
                    Id = r.Id,
                    RecipeID = r.RecipeID,
                    IngredientID = r.IngredientID,
                    Quantity = r.Quantity,
                    Unit = r.Unit,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                }).ToListAsync();

            if (!recipeIngredient.Any())
            {
                return new List<RecipeIngredientinfo>();
            }

            return recipeIngredient;
        }

        public async Task Update(RecipeIngredientinfo entity)
        {
            var stepIngredient = await _context.RecipeIngredients.FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (stepIngredient != null)
            {
                stepIngredient.RecipeID = entity.RecipeID;
                stepIngredient.IngredientID = entity.IngredientID;
                stepIngredient.Quantity = entity.Quantity;
                stepIngredient.Unit = entity.Unit;
                stepIngredient.UpdatedAt = DateTime.Now;

                _context.RecipeIngredients.Update(stepIngredient);
                await _context.SaveChangesAsync();
            }
        }
    }
}
