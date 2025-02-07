using API.Data;
using API.Models;

namespace API.Service
{
    public class UserService : ICRUD<User>
    {
        private readonly APIContext _context;

        public UserService(APIContext context)
        {
            _context = context;
        }
        public void Add(User entity)
        {
            _context.Users.Add(entity);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var product = GetById(id);
            if (product != null)
            {
                _context.Users.Remove(product);
                _context.SaveChanges();
            }
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users.ToList();
        }

        public User GetById(int id)
        {
            return _context.Users.FirstOrDefault(p => p.ID == id);
        }

        public void Update(User entity)
        {
            _context.Users.Update(entity);
            _context.SaveChanges();
        }
    }
}
