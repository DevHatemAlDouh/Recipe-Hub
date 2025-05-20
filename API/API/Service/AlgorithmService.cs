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

            if (users.Any(u => u.Id == userid))
            {
                List<IngredientInfo> Nag_ingredients = new List<IngredientInfo>();
                List<IngredientInfo> Recipe_ingredients = new List<IngredientInfo>();
                List<Commenters> commenters = new List<Commenters>();

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
                    List<IngredientInfo> recipeIngredients = new List<IngredientInfo>();

                    foreach (var ingredient in Recipes_Ingredients.Where(ri => ri.RecipeID == recipe.Id))
                    {
                        recipeIngredients.Add(ingredients.FirstOrDefault(i => i.Id == ingredient.IngredientID));
                    }

                    // Check if any Nag_ingredient is in Recipe_ingredients
                    if (!recipeIngredients.Any(ri => Nag_ingredients.Any(ni => ni.Id == ri.Id)))
                    {
                        foreach (var comment in comments.Where(c => c.RecipeID == recipe.Id))
                        {
                            commenters.Add(new Commenters
                            {
                                Comment = comment,
                                User = users.FirstOrDefault(u => u.Id == comment.UserID)
                            });
                        }

                        algorithm.Add(new Algorithm
                        {
                            User = users.FirstOrDefault(u => u.Id == recipe.UserID),
                            Recipe = recipe,
                            Commenters = commenters,
                            ingredients = recipeIngredients,
                        });
                    }
                }
            }

            return algorithm;
        }
    }
}
