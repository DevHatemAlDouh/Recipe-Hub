using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class IngredientService : ICRUDService<IngredientInfo>
    {
        private readonly APIContext _context;

        public IngredientService(APIContext context)
        {
            _context = context;
        }

        public async Task Add(IngredientInfo entity)
        {
            var ingredient = new Ingredient
            {
                Name = entity.Name,
                Description = entity.Description,
                StepIngredients = new List<StepIngredient>()
            };

            await _context.Ingredients.AddAsync(ingredient);
            await _context.SaveChangesAsync();
            entity.Id = ingredient.Id; // Update the entity with the generated Id
        }

        public async Task Delete(int id)
        {
            // Start by retrieving the user directly from the context
            var ingredient = await _context.Ingredients.FirstOrDefaultAsync(u => u.Id == id);

            // Check if the user exists
            if (ingredient != null)
            {
                // Remove the user from the context
                _context.Ingredients.Remove(ingredient);
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<IngredientInfo>> GetAll()
        {
            var ingredients = await _context.Ingredients.Select(u => new IngredientInfo
            {
                Id = u.Id,
                Description = u.Description,
                Name = u.Name
            }).ToListAsync();

            if (!ingredients.Any())
            {
                return new List<IngredientInfo>();
            }

            return ingredients;
        }


        public async Task<IngredientInfo> GetById(int id)
        {
            var ingredient = await _context.Ingredients.FirstOrDefaultAsync(p => p.Id == id);
            if (ingredient == null) return null;

            return new IngredientInfo
            {
                Id = ingredient.Id,
                Description = ingredient.Description,
                Name = ingredient.Name
            };
        }

        public async Task Update(IngredientInfo entity)
        {
            var ingredient = await _context.Ingredients.FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (ingredient != null)
            {
                ingredient.Name = entity.Name;
                ingredient.Description = entity.Description;

                _context.Ingredients.Update(ingredient);
                await _context.SaveChangesAsync();
            }
        }
    }
}
