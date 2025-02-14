using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class RecipeSuggestions
    {
        private readonly APIContext _context;

        public RecipeSuggestions(APIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SuggestionInfo>> GetAll(int recipeId)
        {
            var suggestions = await _context.Suggestions
                .Where(s => s.Step.RecipeID == recipeId)
                .Select(s => new SuggestionInfo
                {
                    Id = s.Id,
                    UserID = s.UserID,
                    StepID = s.StepID,
                    Description = s.Description
                }).ToListAsync();

            if (!suggestions.Any())
            {
                return new List<SuggestionInfo>();
            }

            return suggestions;
        }
    }
}
