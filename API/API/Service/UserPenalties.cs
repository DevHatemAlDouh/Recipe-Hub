using API.Data;
using API.Models;

namespace API.Service
{
    public class UserPenalties
    {
        private readonly APIContext _context;

        public UserPenalties(APIContext context)
        {
            _context = context;
        }

        public UserPenaltyInfo GetById(int id)
        {
            var penalty = _context.UserPenalties.FirstOrDefault(p => p.Id == id);
            if (penalty == null) return null;

            return new UserPenaltyInfo
            {
                Id = penalty.Id,
                UserID = penalty.UserID,
                PenaltyID = penalty.PenaltyID,
            };
        }

        public void Grant(UserPenaltyInfo entity)
        {
            var userpenalty = new UserPenalty
            {
                Id = entity.Id,
                UserID = entity.UserID,
                PenaltyID = entity.PenaltyID,

                Penalty = _context.Penalties.FirstOrDefault(p => p.Id == entity.PenaltyID),
                User = _context.Users.FirstOrDefault(u => u.Id == entity.UserID)

            };
            _context.UserPenalties.Add(userpenalty);
            _context.SaveChanges();
        }

        public IEnumerable<UserPenaltyInfo> GetAllpenalty(int id)
        {
            return _context.UserPenalties.Select(u => new UserPenaltyInfo
            {
                Id = u.Id,
                UserID = u.UserID,
                PenaltyID = u.PenaltyID
            }).Where(u => u.UserID == id).ToList();
        }
    }
}
