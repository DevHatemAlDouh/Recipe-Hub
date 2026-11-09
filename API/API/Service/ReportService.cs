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
                solved = false,
                CreatedAt = DateTime.Now

            };
            await _context.Reports.AddAsync(report);
            await _context.SaveChangesAsync();
            entity.Id = report.Id; // Update the entity with the generated Id
        }

        public async Task Update(ReportInfo entity)
        {
            var report = await _context.Reports.FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (report != null)
            {
                report.solved = true;
                report.UpdatedAt = DateTime.Now;

                _context.Reports.Update(report);
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
                solved = u.solved,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
            }).ToListAsync();

            if (!reports.Any())
            {
                return new List<ReportInfo>();
            }

            return reports;
        }

        public async Task<IEnumerable<ReportInfo>> GetAllnonSolved()
        {
            var reports = await _context.Reports
                .Where(r => r.solved == false)
                .Select(u => new ReportInfo
                {
                    Id = u.Id,
                    FromUserID = u.FromUserID,
                    AtUserID = u.AtUserID,
                    Type = u.Type,
                    Description = u.Description,
                    solved = u.solved,
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
                solved = report.solved,
                Type = report.Type,
                CreatedAt = report.CreatedAt,
                UpdatedAt = report.UpdatedAt
            };
        }
    }
}
