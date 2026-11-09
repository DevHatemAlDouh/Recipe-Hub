using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class CommentService : ICRUDService<CommentInfo>
    {
        private readonly APIContext _context;

        public CommentService(APIContext context)
        {
            _context = context;
        }

        public async Task Add(CommentInfo entity)
        {
            var comment = new Comment
            {
                RecipeID = entity.RecipeID,
                UserID = entity.UserID,
                Description = entity.Description,
                SupCommentID = entity.SupCommentID,
                Rate = entity.Rate,
                CreatedAt = DateTime.Now,
                CommentRates = new List<CommentRate>()
            };
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
            entity.Id = comment.Id; // Update the entity with the generated Id
        }

        public async Task Delete(int id)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == id);
            if (comment != null)
            {
                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<CommentInfo>> GetAll()
        {
            return await _context.Comments.Select(c => new CommentInfo
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
        }

        public async Task<CommentInfo> GetById(int id)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == id);
            if (comment == null) return null;

            return new CommentInfo
            {
                Id = comment.Id,
                RecipeID = comment.RecipeID,
                UserID = comment.UserID,
                Description = comment.Description,
                SupCommentID = comment.SupCommentID,
                Rate = comment.Rate,
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt
            };
        }

        public async Task Update(CommentInfo entity)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == entity.Id);
            if (comment != null)
            {
                comment.Description = entity.Description;
                comment.SupCommentID = entity.SupCommentID;
                comment.Rate = entity.Rate;
                comment.UpdatedAt = DateTime.Now;

                _context.Comments.Update(comment);
                await _context.SaveChangesAsync();
            }
        }
    }
}
