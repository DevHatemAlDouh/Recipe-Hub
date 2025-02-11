using API.Data;
using API.Models;

namespace API.Service
{
    public class PermissionService : ICRUD<PermissionInfo>
    {
        private readonly APIContext _context;

        public PermissionService(APIContext context)
        {
            _context = context;
        }

        public void Add(PermissionInfo entity)
        {
            var permission = new Permission
            {
                Id = entity.Id,
                Title = entity.Title,
                UserPermissions = new List<UserPermission>()

            };
            _context.Permissions.Add(permission);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            // Start by retrieving the user directly from the context
            var permission = _context.Permissions.FirstOrDefault(p => p.Id == id);

            // Check if the user exists
            if (permission != null)
            {
                // Remove the user from the context
                _context.Permissions.Remove(permission);
                // Save changes to the database
                _context.SaveChanges();
            }
        }

        public IEnumerable<PermissionInfo> GetAll()
        {
            return _context.Permissions.Select(u => new PermissionInfo
            {
                Id = u.Id,
                Title = u.Title
            }).ToList();
        }

        public PermissionInfo GetById(int id)
        {
            var permission = _context.Permissions.FirstOrDefault(p => p.Id == id);
            if (permission == null) return null;

            return new PermissionInfo
            {
                Id = permission.Id,
                Title = permission.Title
            };
        }

        public void Update(PermissionInfo entity)
        {
            var permission = _context.Permissions.FirstOrDefault(u => u.Id == entity.Id);
            if (permission != null)
            {
                permission.Title = entity.Title;
                _context.Permissions.Update(permission);
                _context.SaveChanges();
            }
        }

        
    }
}
