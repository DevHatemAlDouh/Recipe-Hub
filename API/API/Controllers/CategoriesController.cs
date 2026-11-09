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
    public class CategoriesController : ControllerBase
    {
        private readonly ICRUDService<CategoryInfo> _categoryService;
        private readonly RecipeAndCategoryAndComment _recipeAndCategory;

        public CategoriesController(ICRUDService<CategoryInfo> categoryService, RecipeAndCategoryAndComment recipeAndCategory)
        {
            _categoryService = categoryService;
            _recipeAndCategory = recipeAndCategory;
        }

        // GET: api/Categories
        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<CategoryInfo>>> GetCategories()
        {
            var Categories = await _categoryService.GetAll();
            return Ok(Categories);
        }

        // GET: api/Categories
        [HttpGet("GetAllRecipes/{categoryId}")]
        public async Task<ActionResult<IEnumerable<RecipeInfo>>> GetRecipes(int categoryId)
        {
            var Recipes = await _recipeAndCategory.GetAllRecipeWithCategory(categoryId);
            return Ok(Recipes);
        }

        // GET: api/Categories/5
        [HttpGet("GetById/{categoryId}")]
        public async Task<ActionResult<CategoryInfo>> GetCategory(int categoryId)
        {
            var categoryInfo = await _categoryService.GetById(categoryId);

            if (categoryInfo == null)
            {
                return NotFound();
            }

            return categoryInfo;
        }

        // PUT: api/Categories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("Update/{categoryId}")]
        public async Task<IActionResult> PutCategory(int categoryId, CategoryInfo categoryInfo)
        {
            if (categoryId != categoryInfo.Id)
            {
                return BadRequest();
            }

            await _categoryService.Update(categoryInfo);
            return NoContent();
        }

        // POST: api/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Add")]
        public async Task<ActionResult<CategoryInfo>> PostCategory(CategoryInfo categoryInfo)
        {
            await _categoryService.Add(categoryInfo);
            return NoContent();
        }

        // DELETE: api/Categories/5
        [HttpDelete("Delete/{categoryId}")]
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            var categoryInfo = await _categoryService.GetById(categoryId);
            if (categoryInfo == null)
            {
                return NotFound();
            }

            await _categoryService.Delete(categoryId);

            return NoContent();
        }
    }
}
