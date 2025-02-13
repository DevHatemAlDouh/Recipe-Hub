
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class StepService : ICRUDService<StepInfo>
    {
        private readonly APIContext _context;

        public StepService(APIContext context)
        {
            _context = context;
        }
        public async Task Add(StepInfo entity)
        {
            var step = new Step
            {
                Id = entity.Id,
                Description = entity.Description,
                RecipeID = entity.RecipeID,
                StepNumber = entity.StepNumber,
                BackgroundImage = entity.BackgroundImage,
                StepIngredients = new List<StepIngredient>()
            };

            await _context.Steps.AddAsync(step);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            // Start by retrieving the user directly from the context
            var step = await _context.Steps.FirstOrDefaultAsync(u => u.Id == id);

            // Check if the user exists
            if (step != null)
            {
                // Remove the user from the context
                _context.Steps.Remove(step);
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<StepInfo>> GetAll()
        {
            return await _context.Steps.Select(u => new StepInfo
            {
                Id = u.Id,
                Description = u.Description,
                RecipeID = u.RecipeID,
                StepNumber = u.StepNumber,
                BackgroundImage = u.BackgroundImage
            }).ToListAsync();
        }

        public async Task<StepInfo> GetById(int id)
        {
            var step = await _context.Steps.FirstOrDefaultAsync(p => p.Id == id);
            if (step == null) return null;

            return new StepInfo
            {
                Id = step.Id,
                Description = step.Description,
                RecipeID = step.RecipeID,
                StepNumber = step.StepNumber,
                BackgroundImage = step.BackgroundImage
            };
        }

        public async Task Update(StepInfo entity)
        {
            var step = await _context.Steps.FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (step != null)
            {
                step.Description = entity.Description;
                step.RecipeID = entity.RecipeID;
                step.StepNumber = entity.StepNumber;
                step.BackgroundImage = entity.BackgroundImage;

                _context.Steps.Update(step);
                await _context.SaveChangesAsync();
            }
        }
    }
}
