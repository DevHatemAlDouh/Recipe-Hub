using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using API.Service;
using System.Net;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PenaltiesController : ControllerBase
    {
        private readonly ICRUDService<PenaltyInfo> _penaltyService;
        private readonly UserPenalties _userPenalties;

        public PenaltiesController(ICRUDService<PenaltyInfo> penaltyService, UserPenalties userPenalties)
        {
            _penaltyService = penaltyService;
            _userPenalties = userPenalties;
        }

        // GET: api/Penalties
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<PenaltyInfo>>> GetPenaltys()
        {
            var penalties = await Task.FromResult(_penaltyService.GetAll());
            return Ok(penalties);
        }

        // GET: api/Penalties/5
        [HttpGet("GetById/{penaltyId}")]
        public async Task<ActionResult<PenaltyInfo>> GetPenalty(int penaltyId)
        {
            var penalty = await _penaltyService.GetById(penaltyId);

            if (penalty == null)
            {
                return NotFound();
            }

            return Ok(penalty);
        }

        // PUT: api/Penalties/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("Update/{penaltyId}")]
        public async Task<IActionResult> PutPenalty(int penaltyId, PenaltyInfo penaltyInfo)
        {
            if (penaltyId != penaltyInfo.Id)
            {
                return BadRequest();
            }

            await _penaltyService.Update(penaltyInfo);
            return NoContent();
        }

        // POST: api/Penalties
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Add")]
        public async Task<ActionResult<PenaltyInfo>> PostPenalty(PenaltyInfo penaltyInfo)
        {
            await _penaltyService.Add(penaltyInfo);
            return CreatedAtAction(nameof(GetPenalty), new { permissionId = penaltyInfo.Id }, penaltyInfo);
        }

        // POST: api/Penalties/GrantPenalties
        [HttpPost("GrantPenalties")]
        public async Task<ActionResult<UserPenaltyInfo>> Grant(UserPenaltyInfo userpenalty)
        {
            await _userPenalties.Grant(userpenalty);
            return NoContent();
        }

        // DELETE: api/Penalties/5
        [HttpDelete("Delete/{penaltyId}")]
        public async Task<IActionResult> DeletePenalty(int penaltyId)
        {
            var penalty = _penaltyService.GetById(penaltyId);
            if (penalty == null)
            {
                return NotFound();
            }

             await _penaltyService.Delete(penaltyId);
            return NoContent();
        }
    }
}
