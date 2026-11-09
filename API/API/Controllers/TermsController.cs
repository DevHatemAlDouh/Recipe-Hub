using API.Models;
using API.Service;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TermsController : Controller
    {
        private readonly ICRUDService<TermsInfo> _termsService;

        public TermsController(ICRUDService<TermsInfo> termsService)
        {
            _termsService = termsService;
        }

        // GET: api/Terms
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<TermsInfo>>> GetIngredients()
        {
            var ingrediens = await _termsService.GetAll();
            return Ok(ingrediens);
        }

        // GET: api/Ingredients/5
        [HttpGet("GetById/{termId}")]
        public async Task<ActionResult<TermsInfo>> GetIngredient(int termId)
        {
            var ingredien = await _termsService.GetById(termId);

            if (ingredien == null)
            {
                return NotFound();
            }

            return Ok(ingredien);
        }

        // PUT: api/Ingredients/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("Update/{termId}")]
        public async Task<IActionResult> PutIngredient(int termId, TermsInfo TermsInfo)
        {
            if (termId != TermsInfo.Id)
            {
                return BadRequest();
            }

            await _termsService.Update(TermsInfo);
            return NoContent();
        }

        // POST: api/Ingredients
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Add")]
        public async Task<ActionResult<IngredientInfo>> PostIngredient(TermsInfo TermsInfo)
        {
            await _termsService.Add(TermsInfo);
            return NoContent();
        }

        // DELETE: api/Ingredients/5
        [HttpDelete("Delete/{termId}")]
        public async Task<IActionResult> DeleteIngredient(int termId)
        {
            var ingredient = await _termsService.GetById(termId);
            if (ingredient == null)
            {
                return NotFound();
            }

            await _termsService.Delete(termId);
            return NoContent();
        }
    }
}
