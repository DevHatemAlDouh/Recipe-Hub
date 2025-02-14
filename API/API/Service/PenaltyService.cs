using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class PenaltyService : ICRUDService<PenaltyInfo>
    {
        private readonly APIContext _context;

        public PenaltyService(APIContext context)
        {
            _context = context;
        }

        public async Task Add(PenaltyInfo entity)
        {
            var penalty = new Penalty
            {
                Description = entity.Description,
                TimeOut = entity.TimeOut,
                Type = entity.Type,
                UserPenalties = new List<UserPenalty>()
            };
            await _context.Penalties.AddAsync(penalty);
            await _context.SaveChangesAsync();
            entity.Id = penalty.Id; // Update the entity with the generated Id
        }

        public async Task Delete(int id)
        {
            var penalty = await _context.Penalties.FirstOrDefaultAsync(p => p.Id == id);
            if (penalty != null)
            {
                _context.Penalties.Remove(penalty);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<PenaltyInfo>> GetAll()
        {
            var penalties = await _context.Penalties.Select(u => new PenaltyInfo
            {
                Id = u.Id,
                Type = u.Type,
                Description = u.Description,
                TimeOut = u.TimeOut
            }).ToListAsync();

            if (!penalties.Any())
            {
                return new List<PenaltyInfo>();
            }

            return penalties;
        }


        public async Task<PenaltyInfo> GetById(int id)
        {
            var penalty = await _context.Penalties.FirstOrDefaultAsync(p => p.Id == id);
            if (penalty == null) return null;

            return new PenaltyInfo
            {
                Id = penalty.Id,
                Type = penalty.Type,
                Description = penalty.Description,
                TimeOut = penalty.TimeOut
            };
        }

        public async Task Update(PenaltyInfo entity)
        {
            var penalty = await _context.Penalties.FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (penalty != null)
            {
                penalty.TimeOut = entity.TimeOut;
                penalty.Description = entity.Description;
                penalty.Type = entity.Type;
                _context.Penalties.Update(penalty);
                await _context.SaveChangesAsync();
            }
        }
    }
}
