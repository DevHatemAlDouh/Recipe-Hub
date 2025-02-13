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
            return await _context.Steps.Select(r => new StepInfo
            {
                Id = r.Id,
                RecipeID = r.RecipeID,
                Description = r.Description,
                BackgroundImage = r.BackgroundImage,
                StepNumber = r.StepNumber
            }).Where(r => r.RecipeID == ID).ToListAsync();
        }
    }
}
