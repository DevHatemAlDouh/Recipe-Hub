using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class CategoryService : ICRUDService<CategoryInfo>
    {
        private readonly APIContext _context;

        public CategoryService(APIContext context)
        {
            _context = context;
        }

        public async Task Add(CategoryInfo entity)
        {
            var category = new Category
            {
                Name = entity.Name,
                CreatedAt = DateTime.Now,
                RecipeCategories = new List<RecipeCategory>()
            };

            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            entity.Id = category.Id; // Update the entity with the generated Id
        }

        public async Task<CategoryInfo> GetById(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (category == null) return null;

            return new CategoryInfo
            {
                Id = category.Id,
                Name = category.Name,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };
        }

        public async Task Update(CategoryInfo entity)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (category != null)
            {
                category.Name = entity.Name;
                category.UpdatedAt = DateTime.Now;

                _context.Categories.Update(category);
                await _context.SaveChangesAsync();
            }
        }

        public async Task Delete(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(u => u.Id == id);
            if (category != null)
            {
                _context.Categories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<CategoryInfo>> GetAll()
        {
            var categories = await _context.Categories.Select(c => new CategoryInfo
            {
                Id = c.Id,
                Name = c.Name,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            }).ToListAsync();

            if (!categories.Any())
            {
                return new List<CategoryInfo>();
            }

            return categories;
        }
    }
}
