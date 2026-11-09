using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class PenaltyTermsService
    {
        private readonly APIContext _context;
        public PenaltyTermsService(APIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TermsInfo>> GetAll(int PenaltyID)
        {
            var recipeCategory = await _context.Terms
                .Where(r => r.penaltyid == PenaltyID)
                .Select(r => new TermsInfo
                {
                    Id = r.Id,
                    penaltyid = r.penaltyid,
                    permissionid = r.permissionid,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                }).ToListAsync();

            if (!recipeCategory.Any())
            {
                return new List<TermsInfo>();
            }

            return recipeCategory;
        }
    }
}
