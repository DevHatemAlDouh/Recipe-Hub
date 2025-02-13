using API.Data;
using API.Models;
using System.Collections.Generic;
using System.Linq;

namespace API.Service
{
    public class UserService : ICRUD<UserInfo>
    {
        private readonly APIContext _context;

        public UserService(APIContext context)
        {
            _context = context;
        }

        public void Add(UserInfo entity)
        {
            var user = new User
            {
                Id = entity.Id,
                UserName = entity.UserName,
                PhoneNumber = entity.PhoneNumber,
                CountryCode = entity.CountryCode,
                Email = entity.Email,
                Password = entity.Password,
                // Initialize collections if necessary
                Recipes = new List<Recipe>(),
                Comments = new List<Comment>(),
                CommentRates = new List<CommentRate>(),
                RecipeRates = new List<RecipeRate>(),
                UserPenalties = new List<UserPenalty>()
            };

            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            // Start by retrieving the user directly from the context
            var user = _context.Users.FirstOrDefault(u => u.Id == id);

            // Check if the user exists
            if (user != null)
            {
                // Remove the user from the context
                _context.Users.Remove(user);
                // Save changes to the database
                _context.SaveChanges();
            }
        }

        public IEnumerable<UserInfo> GetAll()
        {
            return _context.Users.Select(u => new UserInfo
            {
                Id = u.Id,
                UserName = u.UserName,
                PhoneNumber = u.PhoneNumber,
                CountryCode = u.CountryCode,
                Email = u.Email,
                Password = u.Password
            }).ToList();
        }

        public UserInfo GetById(int id)
        {
            var user = _context.Users.FirstOrDefault(p => p.Id == id);
            if (user == null) return null;

            return new UserInfo
            {
                Id = user.Id,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                CountryCode = user.CountryCode,
                Email = user.Email,
                Password = user.Password
            };
        }

        public void Update(UserInfo entity)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == entity.Id);
            if (user != null)
            {
                user.UserName = entity.UserName;
                user.PhoneNumber = entity.PhoneNumber;
                user.CountryCode = entity.CountryCode;
                user.Email = entity.Email;
                user.Password = entity.Password;

                _context.Users.Update(user);
                _context.SaveChanges();
            }
        }

    }
}