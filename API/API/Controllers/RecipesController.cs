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
    public class RecipesController : ControllerBase
    {
        private readonly ICRUDService<RecipeInfo> _recipeService;
        private readonly UserRecipes _userRecipes;
        private readonly RecipeSteps _recipeSteps;

        public RecipesController(ICRUDService<RecipeInfo> recipeService, UserRecipes userRecipes, RecipeSteps recipeSteps)
        {
            _recipeService = recipeService;
            _userRecipes = userRecipes;
            _recipeSteps = recipeSteps;
        }

        // GET: api/Recipes
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<RecipeInfo>>> GetRecips()
        {
            var recipes = await Task.FromResult(_recipeService.GetAll());
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

        // POST: api/Recipes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Add")]
        public async Task<ActionResult<RecipeInfo>> PostRecipeInfo(RecipeInfo recipeInfo)
        {
            await _recipeService.Add(recipeInfo);
            return CreatedAtAction(nameof(GetRecipe), new { permissionId = recipeInfo.Id }, recipeInfo);
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
    }
}
