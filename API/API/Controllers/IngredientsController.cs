using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Service;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngredientsController : ControllerBase
    {
        private readonly ICRUDService<IngredientInfo> _ingredienService;

        public IngredientsController(ICRUDService<IngredientInfo> ingredienService)
        {
            _ingredienService = ingredienService;
        }

        // GET: api/Ingredients
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<IngredientInfo>>> GetIngredients()
        {
            var ingrediens = await _ingredienService.GetAll();
            return Ok(ingrediens);
        }

        // GET: api/Ingredients/5
        [HttpGet("GetById/{ingredienId}")]
        public async Task<ActionResult<IngredientInfo>> GetIngredient(int ingredienId)
        {
            var ingredien = await _ingredienService.GetById(ingredienId);

            if (ingredien == null)
            {
                return NotFound();
            }

            return Ok(ingredien);
        }

        // PUT: api/Ingredients/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("Update/{ingredienId}")]
        public async Task<IActionResult> PutIngredient(int ingredienId, IngredientInfo ingredientInfo)
        {
            if (ingredienId != ingredientInfo.Id)
            {
                return BadRequest();
            }

            await _ingredienService.Update(ingredientInfo);
            return NoContent();
        }

        // POST: api/Ingredients
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Add")]
        public async Task<ActionResult<IngredientInfo>> PostIngredient(IngredientInfo ingredientInfo)
        {
            await _ingredienService.Add(ingredientInfo);
            return CreatedAtAction(nameof(GetIngredient), new { ingredientId = ingredientInfo.Id }, ingredientInfo);
        }

        // DELETE: api/Ingredients/5
        [HttpDelete("Delete/{ingredientId}")]
        public async Task<IActionResult> DeleteIngredient(int ingredientId)
        {
            var ingredient = await _ingredienService.GetById(ingredientId);
            if (ingredient == null)
            {
                return NotFound();
            }

            await _ingredienService.Delete(ingredientId);
            return NoContent();
        }
    }
}
