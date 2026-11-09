using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class FavoriteService
    {
        private readonly APIContext _context;
        public FavoriteService(APIContext context)
        {
            _context = context;
        }

        public async Task Add(FavoriteInfo entity)
        {
            var favorite = new Favorite
            {
                UserID = entity.UserID,
                IngredientID = entity.IngredientID,
                Type = entity.Type,
                CreatedAt = DateTime.Now
            };
            await _context.Favorites.AddAsync(favorite);
            await _context.SaveChangesAsync();
            entity.Id = favorite.Id; // Update the entity with the generated Id

        }

        public async Task Delete(int id)
        {
            var favorite = await _context.Favorites.FirstOrDefaultAsync(f => f.Id == id);
            if (favorite != null)
            {
                _context.Favorites.Remove(favorite);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<FavoriteInfo>> GetAll()
        {
            return await _context.Favorites.Select(f => new FavoriteInfo
            {
                Id = f.Id,
                UserID = f.UserID,
                IngredientID = f.IngredientID,
                Type = f.Type,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt
            }).ToListAsync();
        }

        public async Task<IEnumerable<FavoriteInfo>> GetAllMy(int userID)
        {
            return await _context.Favorites.Where(f => f.UserID == userID).Select(f => new FavoriteInfo
            {
                Id = f.Id,
                UserID = f.UserID,
                IngredientID = f.IngredientID,
                Type = f.Type,
                CreatedAt = f.CreatedAt,
                UpdatedAt = f.UpdatedAt
            }).ToListAsync();
        }

        public async Task<FavoriteInfo> GetById(int id)
        {
            var favorite = await _context.Favorites.FirstOrDefaultAsync(f => f.Id == id);
            if (favorite == null) return null;

            return new FavoriteInfo
            {
                Id = favorite.Id,
                UserID = favorite.UserID,
                IngredientID = favorite.IngredientID,
                Type = favorite.Type,
                CreatedAt = favorite.CreatedAt,
                UpdatedAt = favorite.UpdatedAt
            };
        }
    }
}
