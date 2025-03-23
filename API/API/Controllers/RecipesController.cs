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
        private readonly UserRecipes _userRecipes;
        private readonly RecipeSteps _recipeSteps;
        private readonly RecipeSuggestions _recipeSuggestions;
        private readonly RecipeRateService _recipeRateService;

        public RecipesController(
            ICRUDService<RecipeInfo> recipeService,
            UserRecipes userRecipes, RecipeSteps recipeSteps,
            RecipeAndCategoryAndComment recipeAndCategory,
            RecipeSuggestions recipeSuggestions,
            RecipeRateService recipeRateService)
        {
            _recipeService = recipeService;
            _userRecipes = userRecipes;
            _recipeSteps = recipeSteps;
            _recipeAndCategory = recipeAndCategory;
            _recipeSuggestions = recipeSuggestions;
            _recipeRateService = recipeRateService;
        }

        // GET: api/Recipes
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<RecipeInfo>>> GetRecips()
        {
            var recipes = await _recipeService.GetAll();
            return Ok(recipes);
        }

        [HttpGet("GetAllCategories/{recipeId}")]
        public async Task<ActionResult<IEnumerable<CategoryInfo>>> GetCategories(int recipeId)
        {
            var recipes = await _recipeAndCategory.GetAllCategoriesInRecipe(recipeId);
            return Ok(recipes);
        }

        [HttpGet("GetAllComments/{recipeId}")]
        public async Task<ActionResult<IEnumerable<CommentInfo>>> GetComments(int recipeId)
        {
            var recipes = await _recipeAndCategory.GetAllCommentsInRecipe(recipeId);
            return Ok(recipes);
        }

        [HttpGet("GetAllSuggestions/{recipeId}")]
        public async Task<ActionResult<IEnumerable<SuggestionInfo>>> GetSuggestions(int recipeId)
        {
            var recipes = await _recipeSuggestions.GetAll(recipeId);
            return Ok(recipes);
        }

        // GET: api/Steps
        [HttpGet("GetAllSteps/{recipeId}")]
        public async Task<ActionResult<IEnumerable<StepInfo>>> GetSteps(int recipeid)
        {
            var steps = await _recipeSteps.GetAll(recipeid);
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
            
            await _recipeRateService.Update(recipeId);
            return NoContent();
        }

        // POST: api/Recipes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Add")]
        public async Task<ActionResult<RecipeInfo>> PostRecipe(RecipeInfo recipeInfo)
        {
            await _recipeService.Add(recipeInfo);
            return NoContent();
        }

        [HttpPost("AddRate")]
        public async Task<ActionResult<RecipeRateInfo>> PostRecipeRate(RecipeRateInfo recipeRateInfo)
        {
            await _recipeRateService.Add(recipeRateInfo);
            return NoContent();
        }

        // DELETE: api/Recipes/5
        [HttpDelete("Delete/{recipeId}")]
        public async Task<IActionResult> DeleteRecipe(int recipeId)
        {
            var recipe = _recipeService.GetById(recipeId);
            if (recipe == null)
            {
                return NotFound();
            }

            await _recipeService.Delete(recipeId);
            return NoContent();
        }

        [HttpDelete("DeleteRate/{recipeId}")]
        public async Task<IActionResult> DeleteRecipeRate(int recipeId)
        {
            var Rate = _recipeRateService.GetById(recipeId);
            if (Rate == null)
            {
                return NotFound();
            }

            await _recipeService.Delete(recipeId);
            return NoContent();
        }
    }
}
