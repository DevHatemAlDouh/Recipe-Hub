using Microsoft.AspNetCore.Mvc;
using API.Models;
using API.Service;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipesController : ControllerBase
    {
        private readonly ICRUDService<RecipeInfo> _recipeService;
        private readonly RecipeAndCategoryAndComment _recipeAndCategory;
        private readonly RecipeSteps _recipeSteps;
        private readonly RecipeSuggestions _recipeSuggestions;
        private readonly RecipeRateandViwsService _recipeRateService;
        private readonly RecipeIngredientServes _recipeIngredient;

        public RecipesController(
            ICRUDService<RecipeInfo> recipeService, RecipeSteps recipeSteps,
            RecipeAndCategoryAndComment recipeAndCategory,
            RecipeSuggestions recipeSuggestions,
            RecipeRateandViwsService recipeRateService, RecipeIngredientServes recipeIngredient)
        {
            _recipeService = recipeService;
            _recipeSteps = recipeSteps;
            _recipeAndCategory = recipeAndCategory;
            _recipeSuggestions = recipeSuggestions;
            _recipeRateService = recipeRateService;
            _recipeIngredient = recipeIngredient;
        }

        // GET: api/Recipes
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<RecipeInfo>>> GetRecips()
        {
            var recipes = await _recipeService.GetAll();
            return Ok(recipes);
        }

        [HttpGet("GetAllCategories/")]
        public async Task<ActionResult<IEnumerable<CategoryInfo>>> GetCategories(int recipeId)
        {
            var recipes = await _recipeAndCategory.GetAllCategoriesInRecipe(recipeId);
            return Ok(recipes);
        }

        [HttpGet("GetAllComments/")]
        public async Task<ActionResult<IEnumerable<CommentInfo>>> GetComments(int recipeId)
        {
            var recipes = await _recipeAndCategory.GetAllCommentsInRecipe(recipeId);
            return Ok(recipes);
        }

        [HttpGet("GetAllSuggestions/")]
        public async Task<ActionResult<IEnumerable<SuggestionInfo>>> GetSuggestions(int recipeId)
        {
            var recipes = await _recipeSuggestions.GetAll(recipeId);
            return Ok(recipes);
        }

        // GET: api/Steps
        [HttpGet("GetAllSteps/")]
        public async Task<ActionResult<IEnumerable<StepInfo>>> GetSteps(int recipeid)
        {
            var steps = await _recipeSteps.GetAll(recipeid);
            return Ok(steps);
        }

        // GET: api/Recipes
        [HttpGet("GetAllIngredient/")]
        public async Task<ActionResult<IEnumerable<RecipeIngredientinfo>>> GetStepIngredientInfo(int recipeid)
        {
            var steps = await _recipeIngredient.GetAll(recipeid);
            return Ok(steps);
        }

        // GET: api/Recipes/5
        [HttpGet("GetById/{recipeId}")]
        public async Task<ActionResult<RecipeInfo>> GetRecipe(int recipeId)
        {
            var recipe = await _recipeService.GetById(recipeId);

            if (recipe == null)
            {
                return NotFound();
            }

            return Ok(recipe);
        }

        // PUT: api/Recipes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("Update/{recipeId}")]
        public async Task<IActionResult> PutRecipe(int recipeId, RecipeInfo recipeInfo)
        {
            if (recipeId != recipeInfo.Id)
            {
                return BadRequest();
            }

            await _recipeService.Update(recipeInfo);
            return NoContent();
        }

        [HttpPut("UpdateRate/{recipeId}")]
        public async Task<IActionResult> PutRecipeRate(int recipeId)
        {
            
            await _recipeRateService.UpdateRate(recipeId);
            return NoContent();
        }

        [HttpPut("UpdateView/{recipeId}")]
        public async Task<IActionResult> PutRecipeView(int recipeId)
        {

            await _recipeRateService.UpdateView(recipeId);
            return NoContent();
        }

        // PUT: api/Steps/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("UpdateIngredient/{Id}")]
        public async Task<IActionResult> PutStepIngredientInfo(int Id, RecipeIngredientinfo recipeIngredientInfo)
        {
            if (Id != recipeIngredientInfo.Id)
            {
                return BadRequest();
            }

            await _recipeIngredient.Update(recipeIngredientInfo);
            return NoContent();
        }

        // POST: api/Recipes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Add")]
        public async Task<ActionResult<RecipeInfo>> PostRecipe(RecipeInfo recipeInfo)
        {
            await _recipeService.Add(recipeInfo);
            return CreatedAtRoute(new { recipeId = recipeInfo.Id }, recipeInfo);
        }

        [HttpPost("AddRate")]
        public async Task<ActionResult<RecipeRateInfo>> PostRecipeRate(RecipeRateInfo recipeRateInfo)
        {
            await _recipeRateService.Add(recipeRateInfo);
            return NoContent();
        }

        // POST: api/Steps
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Ingredient/Add")]
        public async Task<ActionResult<RecipeIngredientinfo>> PostStepIngredientInfo(RecipeIngredientinfo recipIngredientInfo)
        {
            await _recipeIngredient.Add(recipIngredientInfo);
            return NoContent();
        }

        // DELETE: api/Recipes/5
        [HttpDelete("Delete/{recipeId}")]
        public async Task<IActionResult> DeleteRecipe(int recipeId)
        {
            var recipe = await _recipeService.GetById(recipeId);
            if (recipe == null)
            {
                return NotFound();
            }

            await _recipeService.Delete(recipeId);
            await _recipeIngredient.Delete(recipeId);
            await _recipeRateService.Delete(recipeId);
            return NoContent();
        }

        [HttpDelete("DeleteRate/{recipeId}")]
        public async Task<IActionResult> DeleteRecipeRate(int recipeId)
        {
            var Rate = await _recipeRateService.GetById(recipeId);
            if (Rate == null)
            {
                return NotFound();
            }

            await _recipeRateService.Delete(recipeId);
            return NoContent();
        }

        // DELETE: api/Steps/5
        [HttpDelete("DeleteIngredient/{recipeId}")]
        public async Task<IActionResult> DeleteStepIngredientInfo(int recipeId)
        {
            var step = await _recipeIngredient.GetAll(recipeId);
            if (step == null)
            {
                return NotFound();
            }

            await _recipeIngredient.Delete(recipeId);
            return NoContent();
        }
    }
}
