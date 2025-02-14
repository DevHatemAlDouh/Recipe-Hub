using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;


namespace API.Service
{
    public class PermissionService : ICRUDService<PermissionInfo>
    {
        private readonly APIContext _context;

        public PermissionService(APIContext context)
        {
            _context = context;
        }

        public async Task Add(PermissionInfo entity)
        {
            var permission = new Permission
            {
                Id = entity.Id,
                Title = entity.Title,
                UserPermissions = new List<UserPermission>()

            };
            await _context.Permissions.AddAsync(permission);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var entity = await _context.Permissions.FindAsync(id);
            if (entity != null)
            {
                _context.Permissions.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<PermissionInfo>> GetAll()
        {
            var permissions = await _context.Permissions.Select(u => new PermissionInfo
            {
                Id = u.Id,
                Title = u.Title
            }).ToListAsync();

            if (!permissions.Any())
            {
                return new List<PermissionInfo>();
            }

            return permissions;
        }


        public async Task<PermissionInfo> GetById(int id)
        {
            var permission = await _context.Permissions.FirstOrDefaultAsync(p => p.Id == id);
            if (permission == null) return null;

            return new PermissionInfo
            {
                Id = permission.Id,
                Title = permission.Title
            };
        }

        public async Task Update(PermissionInfo entity)
        {
            var permission = await _context.Permissions.FirstOrDefaultAsync(u => u.Id == entity.Id);
            if (permission != null)
            {
                permission.Title = entity.Title;

                _context.Permissions.Update(permission);
                await _context.SaveChangesAsync();
            }
        }
    }
}
