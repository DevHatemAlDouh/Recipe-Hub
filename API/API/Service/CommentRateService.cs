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

        public async Task<IEnumerable<CommentRateInfo>> GetAll()
        {
            var recipes = await _context.CommentRates.Select(u => new CommentRateInfo
            {
                Id = u.Id,
                UserID = u.UserID,
                CommentID = u.CommentID,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,

            }).ToListAsync();

            if (!recipes.Any())
            {
                return new List<CommentRateInfo>();
            }

            return recipes;
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
            var commentRate = await GetAll();
            if (commentRate != null)
            {
                foreach (var comment in commentRate)
                {
                    if (comment.CommentID == id)
                    {
                        var commentrate = await _context.CommentRates.FirstOrDefaultAsync(f => f.Id == id);
                        _context.CommentRates.Remove(commentrate);
                        await _context.SaveChangesAsync();
                    }
                    
                }
                    
            }
        }

        public async Task Update(Rate rate)
        {
            // Check if the comment exists
            var comment = await _context.Comments.FirstOrDefaultAsync(c => c.Id == rate.subjectid);

            if (comment == null)
            {
                // Handle case where comment does not exist
                throw new Exception("Comment not found.");
            }

            // Check if there's already a CommentRate for this user and comment
            var existingRate = await _context.CommentRates
                .FirstOrDefaultAsync(cr => cr.CommentID == rate.subjectid && cr.UserID == rate.userid);

            if (existingRate == null)
            {
                // Create a new CommentRateInfo entity
                var newRateInfo = new CommentRateInfo
                {
                    UserID = rate.userid,
                    CommentID = rate.subjectid
                };

                // Use the Add method to add the new rate
                await Add(newRateInfo);
            }

            // Update the comment's rate count
            var commentRates = await _context.CommentRates.Where(cr => cr.CommentID == rate.subjectid).ToListAsync();
            comment.Rate = commentRates.Count;

            // Update timestamps
            if (comment.CreatedAt != null)
            {
                comment.UpdatedAt = DateTime.Now; // Update UpdatedAt if CreatedAt exists
            }
            else
            {
                comment.CreatedAt = DateTime.Now; // Set CreatedAt if it was null
            }

            // Save changes
            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();
        }
    }
}
