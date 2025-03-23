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

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StepsController : ControllerBase
    {
        private readonly ICRUDService<StepInfo> _stepService;

        public StepsController(ICRUDService<StepInfo> stepService)
        {
            _stepService = stepService;
        }

        // GET: api/Steps
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<StepInfo>>> GetStepInfo()
        {
            var steps = await _stepService.GetAll();
            return Ok(steps);
        }

        // GET: api/Steps/5
        [HttpGet("GetById/{stepId}")]
        public async Task<ActionResult<StepInfo>> GetStepInfo(int stepId)
        {
            var step = await _stepService.GetById(stepId);

            if (step == null)
            {
                return NotFound();
            }

            return Ok(step);
        }

        // PUT: api/Steps/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("Update/{stepId}")]
        public async Task<IActionResult> PutStepInfo(int stepId, StepInfo stepInfo)
        {
            if (stepId != stepInfo.Id)
            {
                return BadRequest();
            }

            await _stepService.Update(stepInfo);
            return NoContent();
        }

        // POST: api/Steps
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Add")]
        public async Task<ActionResult<StepInfo>> PostStepInfo(StepInfo stepInfo)
        {
            await _stepService.Add(stepInfo);
            return NoContent();
        }

        // DELETE: api/Steps/5
        [HttpDelete("Delete/{stepId}")]
        public async Task<IActionResult> DeleteStepInfo(int stepId)
        {
            var step = _stepService.GetById(stepId);
            if (step == null)
            {
                return NotFound();
            }

            await _stepService.Delete(stepId);
            return NoContent();
        }
    }
}
