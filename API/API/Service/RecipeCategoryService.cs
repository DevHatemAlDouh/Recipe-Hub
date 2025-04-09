using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class RecipeCategoryService
    {
        private readonly APIContext _context;
        public RecipeCategoryService(APIContext context)
        {
            _context = context;
        }

        public async Task Add(RecipeCategoryInfo entity)
        {
            var recipeCategory = new RecipeCategory
            {
                RecipeID = entity.RecipeID,
                CategoryID = entity.CategoryID,
                CreatedAt = DateTime.Now
            };
            await _context.RecipeCategories.AddAsync(recipeCategory);
            await _context.SaveChangesAsync();
            entity.Id = recipeCategory.Id; // Update the entity with the generated Id

        }

        public async Task<RecipeCategoryInfo> GetById(int id)
        {
            var recipeIngredient = await _context.RecipeCategories.FirstOrDefaultAsync(p => p.Id == id);
            if (recipeIngredient == null) return null;

            return new RecipeCategoryInfo
            {
                Id = recipeIngredient.Id,
                CategoryID = recipeIngredient.CategoryID,
                RecipeID = recipeIngredient.RecipeID,
                CreatedAt = recipeIngredient.CreatedAt,
                UpdatedAt = recipeIngredient.UpdatedAt
            };
        }

        public async Task DeleteAll(int id)
        {

            var recipeCategory = await GetAll(id);
            if (recipeCategory != null)
            {
                foreach (var Category in recipeCategory)
                {
                    await Delete(Category.Id);
                }

            }
        }

        public async Task Delete(int id)
        {

            var recipeCategory = await GetById(id);
            if (recipeCategory != null)
            {
                var recipecategory = await _context.RecipeCategories.FirstOrDefaultAsync(f => f.Id == id);
                _context.RecipeCategories.Remove(recipecategory);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<RecipeCategoryInfo>> GetAll(int RecipeID)
        {
            var recipeCategory = await _context.RecipeCategories
                .Where(r => r.RecipeID == RecipeID)
                .Select(r => new RecipeCategoryInfo
                {
                    Id = r.Id,
                    RecipeID = r.RecipeID,
                    CategoryID = r.CategoryID,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                }).ToListAsync();

            if (!recipeCategory.Any())
            {
                return new List<RecipeCategoryInfo>();
            }

            return recipeCategory;
        }

        public async Task Update(RecipeCategoryInfo entity)
        {
            var recipeCategory = await _context.RecipeCategories.FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (recipeCategory != null)
            {
                recipeCategory.RecipeID = entity.RecipeID;
                recipeCategory.CategoryID = entity.CategoryID;
                recipeCategory.CreatedAt = entity.CreatedAt;
                recipeCategory.UpdatedAt = DateTime.Now;

                _context.RecipeCategories.Update(recipeCategory);
                await _context.SaveChangesAsync();
            }
        }
    }
}
