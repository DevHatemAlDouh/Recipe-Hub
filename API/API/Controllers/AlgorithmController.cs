using API.Models;
using API.Service;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlgorithmController : ControllerBase
    {
        private readonly AlgorithmService _algorithmService;

        public AlgorithmController(AlgorithmService algorithmService) 
        {
            _algorithmService = algorithmService;
        }
        [HttpGet("Home")]
        public async Task<ActionResult<IEnumerable<Algorithm>>> Home(int UserId)
        {
            var users = await _algorithmService.Home(UserId);
            return Ok(users);
        }
    }
}
