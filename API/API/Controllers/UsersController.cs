using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ICRUD<UserInfo> _userService;
        private readonly UsePermissions _usePermissions;

        public UsersController(ICRUD<UserInfo> userService, UsePermissions usePermissions)
        {
            _userService = userService;
            _usePermissions = usePermissions;
        }

        // GET: api/users
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<UserInfo>>> GetUsers()
        {
            var users = await Task.FromResult(_userService.GetAll());
            return Ok(users);
        }

        // GET: api/users/{userId}
        [HttpGet("GetById{userId}")]
        public async Task<ActionResult<UserInfo>> GetUser(int userId)
        {
            var user = _userService.GetById(userId);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // GET: api/UserPermissions/{userId}
        [HttpGet("GetPermissionById{userId}")]
        public async Task<ActionResult<IEnumerable<UserPermissionInfo>>> UserPermissions(int userId)
        {
            var user = _userService.GetById(userId);

            if (user == null)
            {
                return NotFound();
            }

            var Permissions = await Task.FromResult(_usePermissions.GetAllPermation(userId));
            return Ok(Permissions);
        }

        // PUT: api/users/{userId}
        [HttpPut("Update{userId}")]
        public async Task<IActionResult> PutUser(int userId, UserInfo userInfo)
        {
            if (userId != userInfo.Id)
            {
                return BadRequest();
            }

            _userService.Update(userInfo);
            return NoContent();
        }

        // POST: api/users
        [HttpPost("Add")]
        public async Task<ActionResult<UserInfo>> PostUser(UserInfo userInfo)
        {
            _userService.Add(userInfo);
            return CreatedAtAction(nameof(GetUser), new { userId = userInfo.Id }, userInfo);
        }

        // DELETE: api/users/{userId}
        [HttpDelete("Delete{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var user = _userService.GetById(userId);
            if (user == null)
            {
                return NotFound();
            }

            _userService.Delete(userId);
            return NoContent();
        }
    }
}