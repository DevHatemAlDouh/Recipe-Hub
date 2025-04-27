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

        public async Task<IEnumerable<CommentInfo>> GetAllCommentsInRecipe(int RecipeId)
        {

            var comments = new List<CommentInfo>();
            
            var commentInfo = await _context.Comments
                .Where(c => c.RecipeID == RecipeId)
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
