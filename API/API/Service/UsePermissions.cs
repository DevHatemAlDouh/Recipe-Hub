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

        public UserPermissionInfo GetById(int id)
        {
            var permission = _context.UserPermissions.FirstOrDefault(p => p.Id == id);
            if (permission == null) return null;

            return new UserPermissionInfo
            {
                Id = permission.Id,
                UserID = permission.UserID,  
                PermissionID = permission.PermissionID
            };
        }

        public void Grant(UserPermissionInfo entity)
        {
            var usarpermission = new UserPermission
            {
                Id = entity.Id,
                UserID = entity.UserID,
                PermissionID = entity.PermissionID,

                Permission = _context.Permissions.FirstOrDefault(p => p.Id == entity.PermissionID),
                User = _context.Users.FirstOrDefault(u => u.Id == entity.UserID)

            };
            _context.UserPermissions.Add(usarpermission);
            _context.SaveChanges();
        }

        public void Revoke(int id)
        {
            var userpermission = _context.UserPermissions.FirstOrDefault(p => p.Id == id);
            if (userpermission != null)
            {
                _context.UserPermissions.Remove(userpermission);
                _context.SaveChanges();
            }
        }

        public IEnumerable<UserPermissionInfo> GetAllPermation(int id)
        {
            return _context.UserPermissions.Select(u => new UserPermissionInfo
            {
                Id = u.Id,
                UserID = u.UserID,
                PermissionID = u.PermissionID,
            }).Where(u => u.UserID == id).ToList();
        }
    }
}
