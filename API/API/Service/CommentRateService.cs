using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class CommentRateService
    {
        private readonly APIContext _context;
        public CommentRateService(APIContext context)
        {
            _context = context;
        }

        public async Task<CommentRateInfo> GetById(int id)
        {
            var commentRate = await _context.CommentRates.FirstOrDefaultAsync(r => r.Id == id);
            if (commentRate == null) return null;

            return new CommentRateInfo
            {
                Id = commentRate.Id,
                UserID = commentRate.UserID,
                CommentID = commentRate.CommentID,
                CreatedAt = commentRate.CreatedAt,
                UpdatedAt = commentRate.UpdatedAt
            };
        }

        public async Task Add(CommentRateInfo entity)
        {
            var commentRate = new CommentRate
            {
                UserID = entity.UserID,
                CommentID = entity.CommentID,
                CreatedAt = DateTime.Now
            };
            await _context.CommentRates.AddAsync(commentRate);
            await _context.SaveChangesAsync();
            entity.Id = commentRate.Id; // Update the entity with the generated Id

        }

        public async Task Delete(int id)
        {
            var commentRate = await _context.CommentRates.FirstOrDefaultAsync(f => f.Id == id);
            if (commentRate != null)
            {
                _context.CommentRates.Remove(commentRate);
                await _context.SaveChangesAsync();
            }
        }

        public async Task Update(int commentID)
        {
            var commentRate = await _context.CommentRates.Where(rr => rr.CommentID == commentID).ToListAsync();
            var Count = commentRate.Count;
            var comment = await _context.Comments.FirstOrDefaultAsync(r => r.Id == commentID);
            comment.Rate = Count;
            if(comment.CreatedAt != null)
            {
                comment.CreatedAt = DateTime.Now;
            }
            else
            {
                comment.UpdatedAt = DateTime.Now;
            }
            await _context.SaveChangesAsync();
            _context.Comments.Update(comment);
        }
    }
}
