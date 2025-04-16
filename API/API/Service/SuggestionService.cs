using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class SuggestionService : ICRUDService<SuggestionInfo>
    {
        private readonly APIContext _context;

        public SuggestionService(APIContext context)
        {
            _context = context;
        }

        public async Task Add(SuggestionInfo entity)
        {
            var suggestion = new Suggestion
            {
                UserID = entity.UserID,
                StepID = entity.StepID,
                Description = entity.Description,
                CreatedAt = DateTime.Now
            };

            await _context.Suggestions.AddAsync(suggestion);
            await _context.SaveChangesAsync();
            entity.Id = suggestion.Id; // Update the entity with the generated Id
        }

        public async Task<SuggestionInfo> GetById(int id)
        {
            var suggestion = await _context.Suggestions.FirstOrDefaultAsync(s => s.Id == id);
            if (suggestion == null) return null;

            return new SuggestionInfo
            {
                Id = suggestion.Id,
                UserID = suggestion.UserID,
                StepID = suggestion.StepID,
                Description = suggestion.Description,
                CreatedAt = suggestion.CreatedAt,
                UpdatedAt = suggestion.UpdatedAt
            };
        }

        public async Task Update(SuggestionInfo entity)
        {
            var suggestion = await _context.Suggestions.FirstOrDefaultAsync(s => s.Id == entity.Id);
            if (suggestion != null)
            {
                suggestion.UserID = entity.UserID;
                suggestion.StepID = entity.StepID;
                suggestion.Description = entity.Description;
                suggestion.UpdatedAt = DateTime.Now;

                _context.Suggestions.Update(suggestion);
                await _context.SaveChangesAsync();
            }
        }

        public async Task Delete(int id)
        {
            var suggestion = await _context.Suggestions.FirstOrDefaultAsync(s => s.Id == id);
            if (suggestion != null)
            {
                _context.Suggestions.Remove(suggestion);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<SuggestionInfo>> GetAll()
        {
            var suggestions = await _context.Suggestions.Select(s => new SuggestionInfo
            {
                Id = s.Id,
                UserID = s.UserID,
                StepID = s.StepID,
                Description = s.Description,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            }).ToListAsync();

            if (!suggestions.Any())
            {
                return new List<SuggestionInfo>();
            }

            return suggestions;
        }
    }
}
