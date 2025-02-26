using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class ReportService
    {
        private readonly APIContext _context;

        public ReportService(APIContext context)
        {
            _context = context;
        }

        public async Task Add(ReportInfo entity)
        {
            var report = new Report
            {
                FromUserID = entity.FromUserID,
                AtUserID = entity.AtUserID,
                Type = entity.Type,
                Description = entity.Description,
                Resolved = entity.Resolved,
                CreatedAt = DateTime.Now

            };
            await _context.Reports.AddAsync(report);
            await _context.SaveChangesAsync();
            entity.Id = report.Id; // Update the entity with the generated Id
        }

        public async Task Delete(int id)
        {
            // Start by retrieving the user directly from the context
            var report = await _context.Reports.FirstOrDefaultAsync(r => r.Id == id);

            // Check if the user exists
            if (report != null)
            {
                // Remove the user from the context
                _context.Reports.Remove(report);
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<ReportInfo>> GetAll()
        {
            var reports = await _context.Reports.Select(u => new ReportInfo
            {
                Id = u.Id,
                FromUserID = u.FromUserID,
                AtUserID = u.AtUserID,
                Type = u.Type,
                Description = u.Description,
                Resolved = u.Resolved,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            }).ToListAsync();

            if (!reports.Any())
            {
                return new List<ReportInfo>();
            }

            return reports;
        }

        public async Task<IEnumerable<ReportInfo>> GetAllnonResolved()
        {
            var reports = await _context.Reports
                .Where(r => r.Resolved == false)
                .Select(u => new ReportInfo
                {
                    Id = u.Id,
                    FromUserID = u.FromUserID,
                    AtUserID = u.AtUserID,
                    Type = u.Type,
                    Description = u.Description,
                    Resolved = u.Resolved,
                    CreatedAt = u.CreatedAt,
                    UpdatedAt = u.UpdatedAt
                }).ToListAsync();

            if (!reports.Any())
            {
                return new List<ReportInfo>();
            }

            return reports;
        }

        public async Task<ReportInfo> GetById(int id)
        {
            var report = await _context.Reports.FirstOrDefaultAsync(r => r.Id == id);
            if (report == null) return null;

            return new ReportInfo
            {
                Id = report.Id,
                AtUserID = report.AtUserID,
                Description = report.Description,
                FromUserID = report.FromUserID,
                Resolved = report.Resolved,
                Type = report.Type,
                CreatedAt = report.CreatedAt,
                UpdatedAt = report.UpdatedAt
            };
        }
    }
}
