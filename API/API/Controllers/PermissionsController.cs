using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionsController : ControllerBase
    {
        private readonly ICRUD<PermissionInfo> _permissionService;
        private readonly UsePermissions _usePermissions;

        public PermissionsController(ICRUD<PermissionInfo> permissionService, UsePermissions usePermissions)
        {
            _permissionService = permissionService;
            _usePermissions = usePermissions;
        }

        // GET: api/permissions/GetAll
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<PermissionInfo>>> GetPermissions()
        {
            var permissions = await Task.FromResult(_permissionService.GetAll());
            return Ok(permissions);
        }

        // GET: api/permissions/GetById/{permissionId}
        [HttpGet("GetById/{permissionId}")]
        public async Task<ActionResult<PermissionInfo>> GetPermission(int permissionId)
        {
            var permission = _permissionService.GetById(permissionId);

            if (permission == null)
            {
                return NotFound();
            }

            return Ok(permission);
        }

        // PUT: api/permissions/Update/{permissionId}
        [HttpPut("Update/{permissionId}")]
        public async Task<IActionResult> PutPermission(int permissionId, PermissionInfo permission)
        {
            if (permissionId != permission.Id)
            {
                return BadRequest();
            }

            _permissionService.Update(permission);
            return NoContent();
        }


        // POST: api/permissions/Add
        [HttpPost("Add")]
        public async Task<ActionResult<PermissionInfo>> PostPermission(PermissionInfo permission)
        {
            _permissionService.Add(permission);
            return CreatedAtAction(nameof(GetPermission), new { permissionId = permission.Id }, permission);
        }

        // POST: api/permissions/GrantPermission
        [HttpPost("GrantPermission")]
        public async Task<ActionResult<UserPermissionInfo>> Grant(UserPermissionInfo userpermission)
        {
            _usePermissions.Grant(userpermission);
            return NoContent();
        }

        // DELETE: api/permissions/Revoke/{userpermissionId}
        [HttpDelete("Revoke/{userpermissionId}")]
        public async Task<IActionResult> Revoke(int userpermissionId)
        {
            var userpermission = _usePermissions.GetById(userpermissionId);
            if (userpermission == null)
            {
                return NotFound();
            }

            _usePermissions.Revoke(userpermissionId);
            return NoContent();
        }

        // DELETE: api/permissions/Delete/{permissionId}
        [HttpDelete("Delete/{permissionId}")]
        public async Task<IActionResult> DeletePermission(int permissionId)
        {
            var permission = _permissionService.GetById(permissionId);
            if (permission == null)
            {
                return NotFound();
            }

            _permissionService.Delete(permissionId);
            return NoContent();
        }
    }
}