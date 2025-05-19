using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class AlgorithmService
    {
        private readonly APIContext _context;

        public AlgorithmService(APIContext context) 
        {
            _context = context; 
        }

        public async Task<ICollection<Algorithm>> Home(int userid)
        {
            var users = await _context.Users.Select(u => new UserInfo
            {
                Id = u.Id,
                UserName = u.UserName,
                UserImage = u.UserImage,
                PhoneNumber = u.PhoneNumber,
                CountryCode = u.CountryCode,
                Email = u.Email,
                Password = u.Password,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            }).ToListAsync();

            List<Algorithm> algorithm = new List<Algorithm>();

            if (users.Where(u => u.Id == userid).Any())
            {
                List<IngredientInfo> Nag_ingredients = new List<IngredientInfo>();
                List<IngredientInfo> Recipe_ingredients = new List<IngredientInfo>();
                List<CategoryInfo> Recipe_categories = new List<CategoryInfo>();
                List<SuggestionInfo> Recipe_suggestions = new List<SuggestionInfo>();
                List<Commenters> commenters = new List<Commenters>();
                List<StepInfo> Recipe_Steps = new List<StepInfo>();

                var ingredients = await _context.Ingredients.Select(i => new IngredientInfo
                {
                    Id = i.Id,
                    Name = i.Name,
                    CreatedAt = i.CreatedAt,
                    UpdatedAt = i.UpdatedAt
                }).ToListAsync();

                var favorites = await _context.Favorites.Where(u => u.UserID == userid).ToListAsync();

                foreach (var favorite in favorites)
                {
                    if (favorite.Type == "Nag")
                    {
                        Nag_ingredients.Add(ingredients.FirstOrDefault(i => i.Id == favorite.IngredientID));
                    }
                }

                var nagIngredientIds = Nag_ingredients.Select(i => i.Id).ToHashSet();



                var categories = await _context.Categories.Select(c => new CategoryInfo
                {
                    Id = c.Id,
                    Name = c.Name,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                }).ToListAsync();

                var comments = await _context.Comments.Select(c => new CommentInfo
                {
                    Id = c.Id,
                    UserID = c.UserID,
                    RecipeID = c.RecipeID,
                    SupCommentID = c.SupCommentID,
                    Description = c.Description,
                    Rate = c.Rate,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                }).ToListAsync();

                var Recipes_categories = await _context.RecipeCategories.Select(rc => new RecipeCategoryInfo
                {
                    Id = rc.Id,
                    CategoryID = rc.CategoryID,
                    RecipeID = rc.RecipeID,
                    CreatedAt = rc.CreatedAt,
                    UpdatedAt = rc.UpdatedAt
                }).ToListAsync();

                var Recipes_Ingredients = await _context.RecipeIngredients.Select(ri => new RecipeIngredientinfo
                {
                    Id = ri.Id,
                    RecipeID = ri.RecipeID,
                    IngredientID = ri.IngredientID,
                    Quantity = ri.Quantity,
                    Unit = ri.Unit,
                    CreatedAt = ri.CreatedAt,
                    UpdatedAt = ri.UpdatedAt
                }).ToListAsync();

                var steps = await _context.Steps.Select(s => new StepInfo
                {
                    Id = s.Id,
                    RecipeID = s.RecipeID,
                    StepNumber = s.StepNumber,
                    Description = s.Description,
                    BackgroundImage = s.BackgroundImage,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt
                }).ToListAsync();

                var suggestions = await _context.Suggestions.Select(s => new SuggestionInfo
                {
                    Id = s.Id,
                    UserID = s.UserID,
                    RecipeID = s.RecipeID,
                    Description = s.Description,
                    CreatedAt = s.CreatedAt,
                    UpdatedAt = s.UpdatedAt
                }).ToListAsync();

                var recipes = await _context.Recipes.Select(r => new RecipeInfo
                {
                    Id = r.Id,
                    UserID = r.UserID,
                    Title = r.Title,
                    Description = r.Description,
                    persons = r.persons,
                    Rate = r.Rate,
                    View = r.View,
                    BackgroundImage = r.BackgroundImage,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt,
                }).ToListAsync();

                foreach (var recipe in recipes.Where(r => r.Id != userid))
                {
                    foreach (var category in Recipes_categories.Where(rc => rc.RecipeID == recipe.Id))
                    {
                        Recipe_categories.Add(categories.FirstOrDefault(c => c.Id == category.CategoryID));
                    }

                    foreach (var comment in comments.Where(c => c.RecipeID == recipe.Id))
                    {
                        commenters.Add(new Commenters
                        {
                            Comment = comment,
                            User = users.FirstOrDefault(u => u.Id == comment.UserID)
                        });
                    }

                    foreach (var ingredient in Recipes_Ingredients.Where(ri => ri.RecipeID == recipe.Id))
                    {
                        Recipe_ingredients.Add(ingredients.FirstOrDefault(i => i.Id == ingredient.IngredientID));
                    }

                    foreach (var step in steps.Where(s => s.RecipeID == recipe.Id))
                    {
                        Recipe_Steps.Add(step);
                    }

                    foreach (var suggestion in suggestions.Where(s => s.RecipeID == recipe.Id))
                    {
                        Recipe_suggestions.Add(suggestion);
                    }

                    Recipes_Ingredients.RemoveAll(ri => nagIngredientIds.Contains(ri.IngredientID));

                    algorithm.Add(new Algorithm
                    {
                        User = users.FirstOrDefault(u => u.Id == recipe.UserID),
                        Recipe = recipe,
                        categories = Recipe_categories,
                        Commenters = commenters,
                        ingredients = ingredients,
                        steps = Recipe_Steps,
                        suggestions = Recipe_suggestions
                    });
                }
            }

            return algorithm;
        }
    }
}
