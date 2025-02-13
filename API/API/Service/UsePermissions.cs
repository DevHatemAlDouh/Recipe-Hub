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
            var usarpermission = new UserPermission
            {
                Id = entity.Id,
                UserID = entity.UserID,
                PermissionID = entity.PermissionID,

                Permission = await _context.Permissions.FirstOrDefaultAsync(p => p.Id == entity.PermissionID),
                User = await _context.Users.FirstOrDefaultAsync(u => u.Id == entity.UserID)

            };
            await _context.UserPermissions.AddAsync(usarpermission);
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
            return await _context.UserPermissions.Select(u => new UserPermissionInfo
            {
                Id = u.Id,
                UserID = u.UserID,
                PermissionID = u.PermissionID,
            }).Where(u => u.UserID == id).ToListAsync();
        }
    }
}
