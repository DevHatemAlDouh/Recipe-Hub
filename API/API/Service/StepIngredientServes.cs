using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class StepIngredientServes
    {
        private readonly APIContext _context;
        public StepIngredientServes(APIContext context)
        {
            _context = context;
        }

        public async Task Add(StepIngredientinfo entity)
        {
            var stepIngredient = new StepIngredient
            {
                StepID = entity.StepID,
                IngredientID = entity.IngredientID,
                Quantity = entity.Quantity,
                Unit = entity.Unit,
                CreatedAt = DateTime.Now
            };
            await _context.StepIngredients.AddAsync(stepIngredient);
            await _context.SaveChangesAsync();
            entity.Id = stepIngredient.Id; // Update the entity with the generated Id

        }

        public async Task Delete(int id)
        {
            var stepIngredient = await _context.StepIngredients.FirstOrDefaultAsync(f => f.StepID == id);
            if (stepIngredient != null)
            {
                _context.StepIngredients.Remove(stepIngredient);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<StepIngredientinfo>> GetAll()
        {
            return await _context.StepIngredients.Select(f => new StepIngredientinfo
            {
                Id = f.Id,
                StepID = f.StepID,
                IngredientID = f.IngredientID,
                Quantity = f.Quantity,
                Unit = f.Unit,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt
            }).ToListAsync();
        }

        public async Task<IEnumerable<StepIngredientinfo>> GetById(int id)
        {
            var stepIngredient = await _context.StepIngredients.FirstOrDefaultAsync(f => f.StepID == id);
            if (stepIngredient == null) return null;

            return await _context.StepIngredients.Select(f => new StepIngredientinfo
            {
                Id = f.Id,
                StepID = f.StepID,
                IngredientID = f.IngredientID,
                Quantity = f.Quantity,
                Unit = f.Unit,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt
            }).ToListAsync();
        }

        public async Task Update(StepIngredientinfo entity)
        {
            var stepIngredient = await _context.StepIngredients.FirstOrDefaultAsync(u => u.StepID == entity.Id);
            if (stepIngredient != null)
            {
                stepIngredient.StepID = entity.StepID;
                stepIngredient.IngredientID = entity.IngredientID;
                stepIngredient.Quantity = entity.Quantity;
                stepIngredient.Unit = entity.Unit;
                stepIngredient.CreatedAt = entity.CreatedAt;
                stepIngredient.UpdatedAt = DateTime.Now;

                _context.StepIngredients.Update(stepIngredient);
                await _context.SaveChangesAsync();
            }
        }
    }
}
