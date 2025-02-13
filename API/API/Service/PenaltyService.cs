using API.Data;
using API.Models;

namespace API.Service
{
    public class PenaltyService : ICRUD<PenaltyInfo>
    {
        private readonly APIContext _context;

        public PenaltyService(APIContext context)
        {
            _context = context;
        }

        public void Add(PenaltyInfo entity)
        {
            var Penalty = new Penalty
            {
                Id = entity.Id,
                Description = entity.Description,
                TimeOut = entity.TimeOut,
                Type = entity.Type,
                UserPenalties = new List<UserPenalty>()


            };
            _context.Penalties.Add(Penalty);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            // Start by retrieving the user directly from the context
            var Penalty = _context.Penalties.FirstOrDefault(p => p.Id == id);

            // Check if the user exists
            if (Penalty != null)
            {
                // Remove the user from the context
                _context.Penalties.Remove(Penalty);
                // Save changes to the database
                _context.SaveChanges();
            }
        }

        public IEnumerable<PenaltyInfo> GetAll()
        {
            return _context.Penalties.Select(u => new PenaltyInfo
            {
                Id = u.Id,
                Type = u.Type,
                Description = u.Description,
                TimeOut = u.TimeOut
            }).ToList();
        }

        public PenaltyInfo GetById(int id)
        {
            var Penalty = _context.Penalties.FirstOrDefault(p => p.Id == id);
            if (Penalty == null) return null;

            return new PenaltyInfo
            {
                Id = Penalty.Id,
                Type = Penalty.Type,
                Description = Penalty.Description,
                TimeOut = Penalty.TimeOut
            };
        }

        public void Update(PenaltyInfo entity)
        {
            var Penalty = _context.Penalties.FirstOrDefault(u => u.Id == entity.Id);
            if (Penalty != null)
            {
                Penalty.TimeOut = entity.TimeOut;
                Penalty.Description = entity.Description;
                Penalty.Type = entity.Type;
                _context.Penalties.Update(Penalty);
                _context.SaveChanges();
            }
        }
    }
}
