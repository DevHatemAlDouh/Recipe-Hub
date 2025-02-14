using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Service;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuggestionsController : ControllerBase
    {
        private readonly ICRUDService<SuggestionInfo> _suggestionService;

        public SuggestionsController(ICRUDService<SuggestionInfo> suggestionService)
        {
            _suggestionService = suggestionService;
        }

        // GET: api/Suggestions
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<SuggestionInfo>>> GetSuggestions()
        {
            var suggestions = await _suggestionService.GetAll();
            return Ok(suggestions);
        }

        // GET: api/Suggestions/5
        [HttpGet("GetById/{id}")]
        public async Task<ActionResult<SuggestionInfo>> GetSuggestion(int id)
        {
            var suggestion = await _suggestionService.GetById(id);

            if (suggestion == null)
            {
                return NotFound();
            }

            return Ok(suggestion);
        }

        // PUT: api/Suggestions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> PutSuggestion(int id, SuggestionInfo suggestionInfo)
        {
            if (id != suggestionInfo.Id)
            {
                return BadRequest();
            }

            await _suggestionService.Update(suggestionInfo);
            return NoContent();
        }

        // POST: api/Suggestions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Add")]
        public async Task<ActionResult<SuggestionInfo>> PostSuggestion(SuggestionInfo suggestionInfo)
        {
            await _suggestionService.Add(suggestionInfo);
            return CreatedAtAction(nameof(GetSuggestion), new { id = suggestionInfo.Id }, suggestionInfo);
        }

        // DELETE: api/Suggestions/5
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteSuggestion(int id)
        {
            var suggestion = await _suggestionService.GetById(id);
            if (suggestion == null)
            {
                return NotFound();
            }

            await _suggestionService.Delete(id);
            return NoContent();
        }
    }
}
