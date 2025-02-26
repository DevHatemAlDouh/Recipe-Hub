using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class UserService : ICRUDService<UserInfo>
    {
        private readonly APIContext _context;

        public UserService(APIContext context)
        {
            _context = context;
        }

        public async Task Add(UserInfo entity)
        {
            var user = new User
            {
                UserName = entity.UserName,
                PhoneNumber = entity.PhoneNumber,
                CountryCode = entity.CountryCode,
                Email = entity.Email,
                Password = entity.Password,
                UserImage = entity.UserImage,
                CreatedAt = DateTime.Now,

                // Initialize collections if necessary
                Recipes = new List<Recipe>(),
                Comments = new List<Comment>(),
                CommentRates = new List<CommentRate>(),
                RecipeRates = new List<RecipeRate>(),
                UserPenalties = new List<UserPenalty>()
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            entity.Id = user.Id; // Update the entity with the generated Id
        }

        public async Task Delete(int id)
        {
            // Start by retrieving the user directly from the context
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            // Check if the user exists
            if (user != null)
            {
                // Remove the user from the context
                _context.Users.Remove(user);
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<UserInfo>> GetAll()
        {
            var users = await _context.Users.Select(u => new UserInfo
            {
                Id = u.Id,
                UserName = u.UserName,
                PhoneNumber = u.PhoneNumber,
                CountryCode = u.CountryCode,
                Email = u.Email,
                Password = u.Password,
                UserImage = u.UserImage,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            }).ToListAsync();

            if (!users.Any())
            {
                return new List<UserInfo>();
            }

            return users;
        }

        public async Task<UserInfo> GetById(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(p => p.Id == id);
            if (user == null) return null;

            return new UserInfo
            {
                Id = user.Id,
                UserName = user.UserName,
                PhoneNumber = user.PhoneNumber,
                CountryCode = user.CountryCode,
                Email = user.Email,
                Password = user.Password,
                UserImage = user.UserImage,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };
        }

        public async Task Update(UserInfo entity)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (user != null)
            {
                user.UserName = entity.UserName;
                user.PhoneNumber = entity.PhoneNumber;
                user.CountryCode = entity.CountryCode;
                user.Email = entity.Email;
                user.Password = entity.Password;
                user.UserImage = entity.UserImage;
                user.UpdatedAt = DateTime.Now;

                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }
        }

    }
}