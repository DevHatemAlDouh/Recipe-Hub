using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class TermsService : ICRUDService<TermsInfo>
    {
        private readonly APIContext _context;
        public TermsService(APIContext context)
        {
            _context = context;
        }
        public async Task Add(TermsInfo entity)
        {
            var term = new Terms
            {
                penaltyid = entity.penaltyid,
                permissionid = entity.permissionid,
                CreatedAt = DateTime.Now,

            };
            await _context.Terms.AddAsync(term);
            await _context.SaveChangesAsync();
            entity.Id = term.Id; // Update the entity with the generated Id
        }
        public async Task Delete(int id)
        {
            // Start by retrieving the user directly from the context
            var term = await _context.Terms.FirstOrDefaultAsync(r => r.Id == id);

            // Check if the user exists
            if (term != null)
            {
                // Remove the user from the context
                _context.Terms.Remove(term);
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<TermsInfo>> GetAll()
        {
            var terms = await _context.Terms.Select(u => new TermsInfo
            {
                Id = u.Id,
                penaltyid = u.penaltyid,
                permissionid = u.permissionid,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,

            }).ToListAsync();

            if (!terms.Any())
            {
                return new List<TermsInfo>();
            }

            return terms;
        }
        public async Task<TermsInfo> GetById(int id)
        {
            var term = await _context.Terms.FirstOrDefaultAsync(r => r.Id == id);
            if (term == null) return null;

            return new TermsInfo
            {
                Id = term.Id,
                penaltyid = term.penaltyid,
                permissionid = term.permissionid,
                CreatedAt = term.CreatedAt,
                UpdatedAt = term.UpdatedAt,
            };
        }
        public async Task Update(TermsInfo entity)
        {
            var term = await _context.Terms.FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (term != null)
            {
                term.penaltyid = entity.penaltyid;
                term.permissionid = entity.permissionid;
                term.UpdatedAt = DateTime.Now;

                _context.Terms.Update(term);
                await _context.SaveChangesAsync();
            }
        } 
    }
}
