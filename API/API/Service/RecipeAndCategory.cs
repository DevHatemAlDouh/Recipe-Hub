using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class RecipeAndCategory
    {
        private readonly APIContext _context;

        public RecipeAndCategory(APIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CategoryInfo>> GetAllCategoriesInRecipe(int RecipeID)
        {
            var categoriesInRecipe = await _context.RecipeCategories
                .Where(c => c.RecipeID == RecipeID)
                .ToListAsync();

            if (!categoriesInRecipe.Any())
            {
                return new List<CategoryInfo>();
            }

            var categories = new List<CategoryInfo>();
            foreach (var category in categoriesInRecipe)
            {
                var categoryInfo = await _context.Categories
                    .Where(c => c.Id == category.CategoryID)
                    .Select(c => new CategoryInfo
                    {
                        Id = c.Id,
                        Name = c.Name
                    }).ToListAsync();

                categories.AddRange(categoryInfo);
            }
            return categories;
        }

        public async Task<IEnumerable<RecipeInfo>> GetAllRecipeWithCategory(int CategoryID)
        {
            var RecipesHaveCategory = await _context.RecipeCategories
                .Where(c => c.CategoryID == CategoryID)
                .ToListAsync();

            if (!RecipesHaveCategory.Any())
            {
                return new List<RecipeInfo>();
            }

            var recipes = new List<RecipeInfo>();
            foreach (var recipe in RecipesHaveCategory)
            {
                var recipeInfo = await _context.Recipes
                    .Where(c => c.Id == recipe.RecipeID)
                    .Select(c => new RecipeInfo
                    {
                        Id = c.Id,
                        UserID = c.UserID,
                        Title = c.Title,
                        BackgroundImage = c.BackgroundImage,
                        Description = c.Description,
                        Rate = c.Rate
                    }).ToListAsync();

                recipes.AddRange(recipeInfo);
            }
            return recipes;
        }
    }
}
