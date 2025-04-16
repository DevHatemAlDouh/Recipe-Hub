
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
                Description = entity.Description,
                RecipeID = entity.RecipeID,
                StepNumber = entity.StepNumber,
                BackgroundImage = entity.BackgroundImage,
                CreatedAt = DateTime.Now,
                
                Suggestions = new List<Suggestion>(),
            };

            await _context.Steps.AddAsync(step);
            await _context.SaveChangesAsync();
            entity.Id = step.Id; // Update the entity with the generated Id
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
            var steps = await _context.Steps.Select(u => new StepInfo
            {
                Id = u.Id,
                Description = u.Description,
                RecipeID = u.RecipeID,
                StepNumber = u.StepNumber,
                BackgroundImage = u.BackgroundImage,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            }).ToListAsync();

            if (!steps.Any())
            {
                return new List<StepInfo>();
            }

            return steps;
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
                BackgroundImage = step.BackgroundImage,
                CreatedAt = step.CreatedAt,
                UpdatedAt = step.UpdatedAt
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
                step.UpdatedAt = DateTime.Now;

                _context.Steps.Update(step);
                await _context.SaveChangesAsync();
            }
        }
    }
}
