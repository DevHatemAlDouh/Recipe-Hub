using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;

namespace API.Service
{
    public class UserService : ICRUDService<UserInfo>
    {
        private readonly APIContext _context;

        public UserService(APIContext context)
        {
            _context = context;
        }

        private byte[] ConvertPngToWebp(byte[] pngBytes)
        {
            using (var inputStream = new MemoryStream(pngBytes))
            using (var image = Image.Load(inputStream))
            using (var outputStream = new MemoryStream())
            {
                image.Save(outputStream, new WebpEncoder());
                return outputStream.ToArray();
            }
        }

        public async Task Add(UserInfo entity)
        {
            byte[] webpImage = ConvertPngToWebp(entity.UserImage); // Convert to WEBP

            var user = new User
            {
                UserName = entity.UserName,
                PhoneNumber = entity.PhoneNumber,
                CountryCode = entity.CountryCode,
                Email = entity.Email,
                Password = entity.Password,
                UserImage = webpImage, // Save the WEBP image
                CreatedAt = DateTime.Now,
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
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user != null)
            {
                _context.Users.Remove(user);
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

            return users.Any() ? users : new List<UserInfo>();
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

                // Convert UserImage to WEBP before saving
                user.UserImage = ConvertPngToWebp(entity.UserImage);
                user.UpdatedAt = DateTime.Now;

                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }
        }
    }
}