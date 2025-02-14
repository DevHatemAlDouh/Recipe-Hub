using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class RecipeSteps
    {
        private readonly APIContext _context;

        public RecipeSteps(APIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StepInfo>> GetAll(int ID)
        {
            var steps = await _context.Steps
                .Where(r => r.RecipeID == ID)
                .Select(r => new StepInfo
                {
                    Id = r.Id,
                    RecipeID = r.RecipeID,
                    Description = r.Description,
                    BackgroundImage = r.BackgroundImage,
                    StepNumber = r.StepNumber
                }).ToListAsync();

            if (!steps.Any())
            {
                return new List<StepInfo>();
            }

            return steps;
        }
    }
}
