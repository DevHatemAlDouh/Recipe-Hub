using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class UserPenalties
    {
        private readonly APIContext _context;

        public UserPenalties(APIContext context)
        {
            _context = context;
        }

        public async Task<UserPenaltyInfo> GetById(int id)
        {
            var penalty = await _context.UserPenalties.FirstOrDefaultAsync(p => p.Id == id);
            if (penalty == null) return null;

            return new UserPenaltyInfo
            {
                Id = penalty.Id,
                UserID = penalty.UserID,
                PenaltyID = penalty.PenaltyID,
            };
        }

        public async Task Grant(UserPenaltyInfo entity)
        {
            var userpenalty = new UserPenalty
            {
                Id = entity.Id,
                UserID = entity.UserID,
                PenaltyID = entity.PenaltyID,

                Penalty = await _context.Penalties.FirstOrDefaultAsync(p => p.Id == entity.PenaltyID),
                User = await _context.Users.FirstOrDefaultAsync(u => u.Id == entity.UserID)

            };
            await _context.UserPenalties.AddAsync(userpenalty);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<UserPenaltyInfo>> GetAllpenalty(int id)
        {
            return await _context.UserPenalties.Select(u => new UserPenaltyInfo
            {
                Id = u.Id,
                UserID = u.UserID,
                PenaltyID = u.PenaltyID
            }).Where(u => u.UserID == id).ToListAsync();
        }
    }
}
