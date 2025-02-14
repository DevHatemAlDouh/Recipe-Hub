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
        private readonly ICRUDService<UserInfo> _userService;
        private readonly UserPenalties _userPenalties;
        private readonly UsePermissions _usePermissions;
        private readonly UserRecipes _userRecipes;
        private readonly FavoriteService _favoriteService;

        public UsersController(
            ICRUDService<UserInfo> userService,
            UsePermissions usePermissions,
            UserPenalties userPenalties,
            UserRecipes userRecipes,
            FavoriteService favoriteService)
        {
            _userService = userService;
            _usePermissions = usePermissions;
            _userPenalties = userPenalties;
            _userRecipes = userRecipes;
            _favoriteService = favoriteService;
        }

        // GET: api/users
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<UserInfo>>> GetUsers()
        {
            var users = await Task.FromResult(_userService.GetAll());
            return Ok(users);
        }

        // GET: api/users
        [HttpGet("GetAllFavorite")]
        public async Task<ActionResult<IEnumerable<FavoriteInfo>>> GetFavorites()
        {
            var favorites = await Task.FromResult(_favoriteService.GetAll());
            return Ok(favorites);
        }

        // GET: api/users/GetAllMyRecipes/{userId}
        [HttpGet("GetAllMyRecipes/{userId}")]
        public async Task<ActionResult<IEnumerable<UserInfo>>> GetMyRecipes(int userId)
        {
            var users = await Task.FromResult(_userRecipes.GetAll(userId));
            return Ok(users);
        }

        // GET: api/users/GetById/{userId}
        [HttpGet("GetById/{userId}")]
        public async Task<ActionResult<UserInfo>> GetUser(int userId)
        {
            var user = await _userService.GetById(userId);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // GET: api/users/UserPermissions/{userId}
        [HttpGet("GetPenaltyById/{userId}")]
        public async Task<ActionResult<IEnumerable<UserPermissionInfo>>> UserPermissions(int userId)
        {
            var user = _userService.GetById(userId);

            if (user == null)
            {
                return NotFound();
            }

            var Penalties = await Task.FromResult(_userPenalties.GetAllpenalty(userId));
            return Ok(Penalties);
        }

        // GET: api/users/UserPermissions/{userId}
        [HttpGet("GetPermissionById/{userId}")]
        public async Task<ActionResult<IEnumerable<UserPermissionInfo>>> UserPenalties(int userId)
        {
            var user = _userService.GetById(userId);

            if (user == null)
            {
                return NotFound();
            }

            var Permissions = await Task.FromResult(_usePermissions.GetAllPermation(userId));
            return Ok(Permissions);
        }

        // PUT: api/users/Update/{userId}
        [HttpPut("Update/{userId}")]
        public async Task<IActionResult> PutUser(int userId, UserInfo userInfo)
        {
            if (userId != userInfo.Id)
            {
                return BadRequest();
            }

            await _userService.Update(userInfo);
            return NoContent();
        }

        // POST: api/users
        [HttpPost("Add")]
        public async Task<ActionResult<UserInfo>> PostUser(UserInfo userInfo)
        {
            await _userService.Add(userInfo);
            return CreatedAtAction(nameof(GetUser), new { userId = userInfo.Id }, userInfo);
        }

        // POST: api/users
        [HttpPost("AddFavorite")]
        public async Task<ActionResult<FavoriteInfo>> PostFavorite(FavoriteInfo favoriteInfo)
        {
            await _favoriteService.Add(favoriteInfo);
            return NoContent();
        }

        // DELETE: api/users/{userId}
        [HttpDelete("Delete/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var user = await _userService.GetById(userId);
            if (user == null)
            {
                return NotFound();
            }

            await _userService.Delete(userId);
            return NoContent();
        }

        // DELETE: api/users/{userId}
        [HttpDelete("DeleteFavorite/{favoriteId}")]
        public async Task<IActionResult> DeleteFavorite(int favoriteId)
        {
            var user = await _favoriteService.GetById(favoriteId);
            if (user == null)
            {
                return NotFound();
            }

            await _favoriteService.Delete(favoriteId);
            return NoContent();
        }
    }
}