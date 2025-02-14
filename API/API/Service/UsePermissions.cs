using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Service
{
    public class UsePermissions
    {
        private readonly APIContext _context;

        public UsePermissions(APIContext context)
        {
            _context = context;
        }

        public async Task<UserPermissionInfo> GetById(int id)
        {
            var permission = await _context.UserPermissions.FirstOrDefaultAsync(p => p.Id == id);
            if (permission == null) return null;

            return new UserPermissionInfo
            {
                Id = permission.Id,
                UserID = permission.UserID,  
                PermissionID = permission.PermissionID
            };
        }

        public async Task Grant(UserPermissionInfo entity)
        {
            var permission = await _context.Permissions.FirstOrDefaultAsync(p => p.Id == entity.PermissionID);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == entity.UserID);

            if (permission == null || user == null)
            {
                throw new InvalidOperationException("Permission or User not found.");
            }

            var userPermission = new UserPermission
            {
                Id = entity.Id,
                UserID = entity.UserID,
                PermissionID = entity.PermissionID,
                Permission = permission,
                User = user
            };

            await _context.UserPermissions.AddAsync(userPermission);
            await _context.SaveChangesAsync();
        }

        public async Task Revoke(int id)
        {
            var userpermission = await _context.UserPermissions.FirstOrDefaultAsync(p => p.Id == id);
            if (userpermission != null)
            {
                _context.UserPermissions.Remove(userpermission);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<UserPermissionInfo>> GetAllPermation(int id)
        {
            var userPermissions = await _context.UserPermissions
                .Where(u => u.UserID == id)
                .Select(u => new UserPermissionInfo
                {
                    Id = u.Id,
                    UserID = u.UserID,
                    PermissionID = u.PermissionID,
                }).ToListAsync();

            if (!userPermissions.Any())
            {
                return new List<UserPermissionInfo>();
            }

            return userPermissions;
        }
    }
}
