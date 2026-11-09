using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;

namespace API.Service
{
    public class RecipeService : ICRUDService<RecipeInfo>
    {
        private readonly APIContext _context;

        public RecipeService(APIContext context)
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

        public async Task Add(RecipeInfo entity)
        {
            byte[] webpImage = ConvertPngToWebp(entity.BackgroundImage);

            var recipe = new Recipe
            {
                UserID = entity.UserID,
                Description = entity.Description,
                BackgroundImage = webpImage, // Save the WEBP image
                Title = entity.Title,
                persons = entity.persons,
                Rate = 0,
                View = 0,
                CreatedAt = DateTime.Now,
                Comments = new List<Comment>(),
                RecipeRates = new List<RecipeRate>(),
                Steps = new List<Step>(),
                Suggestions = new List<Suggestion>(),
                RecipeIngredients = new List<RecipeIngredient>(),
            };

            await _context.Recipes.AddAsync(recipe);
            await _context.SaveChangesAsync();
            entity.Id = recipe.Id; // Update the entity with the generated Id
        }

        public async Task Delete(int id)
        {
            // Start by retrieving the user directly from the context
            var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == id);

            // Check if the user exists
            if (recipe != null)
            {
                // Remove the user from the context
                _context.Recipes.Remove(recipe);
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<RecipeInfo>> GetAll()
        {
            var recipes = await _context.Recipes.Select(u => new RecipeInfo
            {
                Id = u.Id,
                UserID = u.UserID,
                Description = u.Description,
                BackgroundImage = u.BackgroundImage,
                Title = u.Title,
                persons = u.persons,
                Rate = u.Rate,
                View = u.View,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,

            }).ToListAsync();

            if (!recipes.Any())
            {
                return new List<RecipeInfo>();
            }

            return recipes;
        }

        public async Task<RecipeInfo> GetById(int id)
        {
            var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == id);
            if (recipe == null) return null;

            return new RecipeInfo
            {
                Id = recipe.Id,
                UserID = recipe.UserID,
                BackgroundImage = recipe.BackgroundImage,
                Description = recipe.Description,
                Title = recipe.Title,
                persons = recipe.persons,
                Rate = recipe.Rate,
                View = recipe.View,
                CreatedAt = recipe.CreatedAt,
                UpdatedAt = recipe.UpdatedAt,
            };
        }

        public async Task Update(RecipeInfo entity)
        {
            var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == entity.Id);

            if (recipe != null)
            {
                recipe.Title = entity.Title;
                recipe.Description = entity.Description;

                // Convert the BackgroundImage to WEBP before saving
                recipe.BackgroundImage = ConvertPngToWebp(entity.BackgroundImage);

                recipe.persons = entity.persons;
                recipe.UpdatedAt = DateTime.Now;

                _context.Recipes.Update(recipe);
                await _context.SaveChangesAsync();
            }
        }
    }
}
