using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;

namespace API.Service
{
    public class StepService : ICRUDService<StepInfo>
    {
        private readonly APIContext _context;

        public StepService(APIContext context)
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

        public async Task Add(StepInfo entity)
        {
            byte[] webpImage = ConvertPngToWebp(entity.BackgroundImage); // Convert to WEBP

            var step = new Step
            {
                Description = entity.Description,
                RecipeID = entity.RecipeID,
                StepNumber = entity.StepNumber,
                BackgroundImage = webpImage, // Save the WEBP image
                CreatedAt = DateTime.Now,
            };

            await _context.Steps.AddAsync(step);
            await _context.SaveChangesAsync();
            entity.Id = step.Id; // Update the entity with the generated Id
        }

        public async Task Delete(int id)
        {
            var step = await _context.Steps.FirstOrDefaultAsync(u => u.Id == id);
            if (step != null)
            {
                _context.Steps.Remove(step);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<StepInfo>> GetAll()
        {
            var steps = await _context.Steps.Select(u => new StepInfo
            {
                Id = u.Id,
                Description = u.Description,
                RecipeID = u.RecipeID,
                StepNumber = u.StepNumber,
                BackgroundImage = u.BackgroundImage,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            }).ToListAsync();

            return steps.Any() ? steps : new List<StepInfo>();
        }

        public async Task<StepInfo> GetById(int id)
        {
            var step = await _context.Steps.FirstOrDefaultAsync(p => p.Id == id);
            if (step == null) return null;

            return new StepInfo
            {
                Id = step.Id,
                Description = step.Description,
                RecipeID = step.RecipeID,
                StepNumber = step.StepNumber,
                BackgroundImage = step.BackgroundImage,
                CreatedAt = step.CreatedAt,
                UpdatedAt = step.UpdatedAt
            };
        }

        public async Task Update(StepInfo entity)
        {
            var step = await _context.Steps.FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (step != null)
            {
                step.Description = entity.Description;
                step.RecipeID = entity.RecipeID;
                step.StepNumber = entity.StepNumber;

                // Convert BackgroundImage to WEBP before saving
                step.BackgroundImage = ConvertPngToWebp(entity.BackgroundImage);
                step.UpdatedAt = DateTime.Now;

                _context.Steps.Update(step);
                await _context.SaveChangesAsync();
            }
        }
    }
}