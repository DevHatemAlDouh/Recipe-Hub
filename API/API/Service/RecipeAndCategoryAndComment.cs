using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class RecipeAndCategoryAndComment
    {
        private readonly APIContext _context;

        public RecipeAndCategoryAndComment(APIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CategoryInfo>> GetAllCategoriesInRecipe(int RecipeID)
        {
            var categoriesInRecipe = await _context.RecipeCategories
                .Where(c => c.RecipeID == RecipeID)
                .ToListAsync();

            var categories = new List<CategoryInfo>();
            if (categoriesInRecipe.Any())
            {
                foreach (var category in categoriesInRecipe)
                {
                    var categoryInfo = await _context.Categories
                        .Where(c => c.Id == category.CategoryID)
                        .Select(c => new CategoryInfo
                        {
                            Id = c.Id,
                            Name = c.Name,
                            CreatedAt = c.CreatedAt,
                            UpdatedAt = c.UpdatedAt
                        }).ToListAsync();

                    categories.AddRange(categoryInfo);
                }
            }
            return categories;
        }

        public async Task<IEnumerable<CommentInfo>> GetAllCommentsInRecipe(int CommentID)
        {
            var commentsInRecipe = await _context.CommentRates
                .Where(c => c.CommentID == CommentID)
                .ToListAsync();
            var comments = new List<CommentInfo>();
            if (commentsInRecipe.Any())
            {
                foreach (var comment in commentsInRecipe)
                {
                    var commentInfo = await _context.Comments
                        .Where(c => c.Id == comment.CommentID)
                        .Select(c => new CommentInfo
                        {
                            Id = c.Id,
                            RecipeID = c.RecipeID,
                            UserID = c.UserID,
                            Description = c.Description,
                            SupCommentID = c.SupCommentID,
                            Rate = c.Rate,
                            CreatedAt = c.CreatedAt,
                            UpdatedAt = c.UpdatedAt
                        }).ToListAsync();

                    comments.AddRange(commentInfo);
                }
            }
            return comments;
        }

        public async Task<IEnumerable<RecipeInfo>> GetAllRecipeWithCategory(int CategoryID)
        {
            var RecipesHaveCategory = await _context.RecipeCategories
                .Where(c => c.CategoryID == CategoryID)
                .ToListAsync();
            var recipes = new List<RecipeInfo>();
            if (RecipesHaveCategory.Any())
            {
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
                            Rate = c.Rate,
                            CreatedAt = c.CreatedAt,
                            UpdatedAt = c.UpdatedAt
                        }).ToListAsync();

                    recipes.AddRange(recipeInfo);
                }
            }
            return recipes;
        }
    }
}
