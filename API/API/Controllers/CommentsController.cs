using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Service;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICRUDService<CommentInfo> _commentService;
        private readonly CommentRateService _commentRateService;

        public CommentsController(ICRUDService<CommentInfo> commentService, CommentRateService commentRateService)
        {
            _commentService = commentService;
            _commentRateService = commentRateService;
        }

        // GET: api/Comments
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<CommentInfo>>> GetComments()
        {
            var comments = await _commentService.GetAll();
            return Ok(comments);
        }

        // GET: api/Comments/5
        [HttpGet("GetById/{id}")]
        public async Task<ActionResult<CommentInfo>> GetComment(int id)
        {
            var comment = await _commentService.GetById(id);

            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment);
        }

        // PUT: api/Comments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> PutComment(int id, CommentInfo commentInfo)
        {
            if (id != commentInfo.Id)
            {
                return BadRequest();
            }

            await _commentService.Update(commentInfo);
            return NoContent();
        }

        [HttpPut("UpdateRate/{commentId}")]
        public async Task<IActionResult> PutCommentRate(int commentId)
        {

            await _commentRateService.Update(commentId);
            return NoContent();
        }

        // POST: api/Comments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Add")]
        public async Task<ActionResult<CommentInfo>> PostComment(CommentInfo commentInfo)
        {
            await _commentService.Add(commentInfo);
            return NoContent();
        }

        [HttpPost("AddRate")]
        public async Task<ActionResult<CommentRateInfo>> PostCommentRate(CommentRateInfo commentRateInfo)
        {
            await _commentRateService.Add(commentRateInfo);
            return NoContent();
        }

        // DELETE: api/Comments/5
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _commentService.GetById(id);
            if (comment == null)
            {
                return NotFound();
            }

            await _commentService.Delete(id);
            return NoContent();
        }

        [HttpDelete("DeleteRate/{recipeId}")]
        public async Task<IActionResult> DeleteCommentRate(int commentId)
        {
            var Rate = _commentRateService.GetById(commentId);
            if (Rate == null)
            {
                return NotFound();
            }

            await _commentRateService.Delete(commentId);
            return NoContent();
        }
    }
}
