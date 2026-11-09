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
        private readonly RecipeCategoryService _recipeCategoryService;

        public RecipesController(
            ICRUDService<RecipeInfo> recipeService, RecipeSteps recipeSteps,
            RecipeAndCategoryAndComment recipeAndCategory,
            RecipeSuggestions recipeSuggestions,
            RecipeRateandViwsService recipeRateService, RecipeIngredientServes recipeIngredient,
            RecipeCategoryService recipeCategoryService)
        {
            _recipeService = recipeService;
            _recipeSteps = recipeSteps;
            _recipeAndCategory = recipeAndCategory;
            _recipeSuggestions = recipeSuggestions;
            _recipeRateService = recipeRateService;
            _recipeIngredient = recipeIngredient;
            _recipeCategoryService = recipeCategoryService;
        }

        // GET: api/Recipes
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<RecipeInfo>>> GetRecips()
        {
            var recipes = await _recipeService.GetAll();
            return Ok(recipes);
        }

        [HttpGet("GetAllCategories/")]
        public async Task<ActionResult<IEnumerable<RecipeCategoryInfo>>> GetCategories(int recipeId)
        {
            var recipes = await _recipeCategoryService.GetAll(recipeId);
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

        [HttpPut("UpdateRate")]
        public async Task<IActionResult> PutRecipeRate(Rate rate)
        {
            
            await _recipeRateService.UpdateRate(rate);
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

        [HttpPut("UpdateCategory/{Id}")]
        public async Task<IActionResult> PutStepIngredientInfo(int Id, RecipeCategoryInfo recipeCategoryInfo)
        {
            if (Id != recipeCategoryInfo.Id)
            {
                return BadRequest();
            }

            await _recipeCategoryService.Update(recipeCategoryInfo);
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

        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Ingredient/Add")]
        public async Task<ActionResult<RecipeIngredientinfo>> PostRecipeIngredientInfo(RecipeIngredientinfo recipIngredientInfo)
        {
            await _recipeIngredient.Add(recipIngredientInfo);
            return NoContent();
        }

        [HttpPost("Category/Add")]
        public async Task<ActionResult<RecipeCategoryInfo>> PostRecipeCategoryInfo(RecipeCategoryInfo recipIngredientInfo)
        {
            await _recipeCategoryService.Add(recipIngredientInfo);
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
            await _recipeRateService.Delete(recipeId);
            await _recipeIngredient.DeleteAll(recipeId);
            await _recipeCategoryService.DeleteAll(recipeId);
            return NoContent();
        }

        [HttpDelete("DeleteIngredient/{Id}")]
        public async Task<IActionResult> DeleteRecipeIngredient(int Id)
        {
            var Rate = await _recipeIngredient.GetById(Id);
            if (Rate == null)
            {
                return NotFound();
            }

            await _recipeRateService.Delete(Id);
            return NoContent();
        }

        [HttpDelete("DeleteCategory/{Id}")]
        public async Task<IActionResult> DeleteRecipeRate(int Id)
        {
            var Rate = await _recipeCategoryService.GetById(Id);
            if (Rate == null)
            {
                return NotFound();
            }

            await _recipeRateService.Delete(Id);
            return NoContent();
        }
    }
}
