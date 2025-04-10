using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Net.Http.Headers;

namespace Dashboard.Controllers
{
    public class RecipesController : Controller
    {
        private string baseURL = "http://recipe-hub.runasp.net/swagger";
        public async Task<IActionResult> Index()
        {
            DataTable dt = new DataTable();
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await API.GetAsync("/api/Recipes/GetAll");
                if (Res.IsSuccessStatusCode)
                {
                    var APIResponse = Res.Content.ReadAsStringAsync().Result;
                    dt = JsonConvert.DeserializeObject<DataTable>(APIResponse);
                }
                return View(dt);
            }
        }

        public async Task<IActionResult> Details(int id)
        {
            using (var API = new HttpClient())
            {
                Recipe_details recipe_Details = new Recipe_details();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await API.GetAsync($"/api/Recipes/GetById/{id}");
                if (Res.IsSuccessStatusCode)
                {
                    var APIResponse = Res.Content.ReadAsStringAsync().Result;
                    recipe_Details.Recipe = JsonConvert.DeserializeObject<Recipe>(APIResponse);

                    HttpResponseMessage ingredientRes = await API.GetAsync($"/api/Recipes/GetAllSteps?recipeid={id}");
                    if (ingredientRes.IsSuccessStatusCode)
                    {
                        var APIIngredientResponse = ingredientRes.Content.ReadAsStringAsync().Result;
                        recipe_Details.steps = JsonConvert.DeserializeObject<List<Step>>(APIIngredientResponse);

                        HttpResponseMessage stepRes = await API.GetAsync($"/api/Recipes/GetAllIngredient?recipeid={id}");
                        if (stepRes.IsSuccessStatusCode)
                        {
                            var APIStepResponse = stepRes.Content.ReadAsStringAsync().Result;
                            recipe_Details.recipeIngredients = JsonConvert.DeserializeObject<List<RecipeIngredient>>(APIStepResponse);

                            var ingredientTasks = recipe_Details.recipeIngredients.Select(async ingredient =>
                            {
                                HttpResponseMessage permissionsResponse = await API.GetAsync($"/api/Ingredients/GetById/{ingredient.IngredientID}");
                                if (permissionsResponse.IsSuccessStatusCode)
                                {
                                    var apiResponse = await permissionsResponse.Content.ReadAsStringAsync();
                                    return JsonConvert.DeserializeObject<Ingredient>(apiResponse);
                                }
                                return null;
                            });

                            var ingredients = await Task.WhenAll(ingredientTasks);
                            recipe_Details.ingredients = ingredients.Where(p => p != null).ToList();

                            HttpResponseMessage categorieRes = await API.GetAsync($"/api/Recipes/GetAllCategories?recipeId={id}");
                            if (categorieRes.IsSuccessStatusCode)
                            {
                                var APICategorieResponse = categorieRes.Content.ReadAsStringAsync().Result;
                                recipe_Details.recipeCategories = JsonConvert.DeserializeObject<List<RecipeCategory>>(APICategorieResponse);

                            }
                        }

                    }
                }

                return View(recipe_Details);
            }
        }

        public async Task<IActionResult> Create()
        {
            using (var API = new HttpClient())
            {
                Recipe_details recipe_Details = new Recipe_details();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await API.GetAsync("/api/Ingredients/GetAll");
                if (Res.IsSuccessStatusCode)
                {
                    var APIResponse = Res.Content.ReadAsStringAsync().Result;
                    recipe_Details.ingredients = JsonConvert.DeserializeObject<List<Ingredient>>(APIResponse);
                }
                HttpResponseMessage categorieRes = await API.GetAsync($"/api/Categories/GetAll");
                if (categorieRes.IsSuccessStatusCode)
                {
                    var APICategorieResponse = categorieRes.Content.ReadAsStringAsync().Result;
                    recipe_Details.categories = JsonConvert.DeserializeObject<List<Category>>(APICategorieResponse);

                }
                return View(recipe_Details);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Recipe_details recipe_Details)
        {
            using (var API = new HttpClient())
            {
                recipe_Details.Recipe.UserId = 1;

                // Process recipe background image
                if (recipe_Details.Recipe.backgroundImageBase64 != null && recipe_Details.Recipe.backgroundImageBase64.Length > 0)
                {
                    recipe_Details.Recipe.backgroundImage = await ConvertToBase64Async(recipe_Details.Recipe.backgroundImageBase64);
                }

                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // Serialize and send the recipe
                var recipeContent = await SendRecipeAsync(API, recipe_Details.Recipe);
                if (recipeContent != null)
                {
                    recipe_Details.Recipe = JsonConvert.DeserializeObject<Recipe>(recipeContent);
                    await ProcessStepsAsync(API, recipe_Details.steps, recipe_Details.Recipe.Id);
                    await ProcessIngredientsAsync(API, recipe_Details.recipeIngredients, recipe_Details.Recipe.Id);
                    await ProcessCategoresAsync(API, recipe_Details.recipeCategories, recipe_Details.Recipe.Id);

                    return RedirectToAction("Index");
                }
            }
            return View(recipe_Details);
        }

        public async Task<IActionResult> Edit(int id)
        {
            using (var API = new HttpClient())
            {
                Recipe_details recipe_Details = new Recipe_details();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await API.GetAsync($"/api/Recipes/GetById/{id}");
                if (Res.IsSuccessStatusCode)
                {
                    var APIResponse = Res.Content.ReadAsStringAsync().Result;
                    recipe_Details.Recipe = JsonConvert.DeserializeObject<Recipe>(APIResponse);
                    HttpResponseMessage IngredentsRes = await API.GetAsync("/api/Ingredients/GetAll");
                    if (IngredentsRes.IsSuccessStatusCode)
                    {
                        var IngredentsAPIResponse = IngredentsRes.Content.ReadAsStringAsync().Result;
                        recipe_Details.ingredients = JsonConvert.DeserializeObject<List<Ingredient>>(IngredentsAPIResponse);
                    }
                    HttpResponseMessage CategoriesRes = await API.GetAsync("/api/Categories/GetAll");
                    if (CategoriesRes.IsSuccessStatusCode)
                    {
                        var CategoriesAPIResponse = CategoriesRes.Content.ReadAsStringAsync().Result;
                        recipe_Details.categories = JsonConvert.DeserializeObject<List<Category>>(CategoriesAPIResponse);
                    }
                    HttpResponseMessage StepRes = await API.GetAsync($"/api/Recipes/GetAllSteps?recipeid={id}");
                    if (StepRes.IsSuccessStatusCode)
                    {
                        var StepAPIResponse = StepRes.Content.ReadAsStringAsync().Result;
                        recipe_Details.Lsteps = JsonConvert.DeserializeObject<List<Step>>(StepAPIResponse);
                    }
                    HttpResponseMessage RecpieIngredentsRes = await API.GetAsync($"/api/Recipes/GetAllIngredient?recipeid={id}");
                    if (RecpieIngredentsRes.IsSuccessStatusCode)
                    { 
                        var RecpieIngredentsAPIResponse = RecpieIngredentsRes.Content.ReadAsStringAsync().Result;
                        recipe_Details.LrecipeIngredients = JsonConvert.DeserializeObject<List<RecipeIngredient>>(RecpieIngredentsAPIResponse);
                    }
                    HttpResponseMessage RecpieCategoriesRes = await API.GetAsync($"/api/Recipes/GetAllCategories?recipeid={id}");
                    if (RecpieCategoriesRes.IsSuccessStatusCode)
                    {
                        var RecpieCategoriesAPIResponse = RecpieCategoriesRes.Content.ReadAsStringAsync().Result;
                        recipe_Details.LrecipeCategories = JsonConvert.DeserializeObject<List<RecipeCategory>>(RecpieCategoriesAPIResponse);
                    }
                }

                ViewBag.Steps = recipe_Details.Lsteps.Count;
                ViewBag.RecipeIngredents = recipe_Details.LrecipeIngredients.Count;
                ViewBag.RecpieCategories = recipe_Details.LrecipeCategories.Count;
                return View(recipe_Details);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id,[FromForm] Recipe_details data)
        {
            using (var API = new HttpClient())
            {

                // Process recipe background image
                if (data.Recipe.backgroundImageBase64 != null && data.Recipe.backgroundImageBase64.Length > 0)
                {
                    data.Recipe.backgroundImage = await ConvertToBase64Async(data.Recipe.backgroundImageBase64);
                }

                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // Serialize and send the recipe
                var recipeContent = await UpdateRecipeAsync(API, data.Recipe);
                if (recipeContent != null)
                {
                    await UpdateStepsAsync(API, data.steps, data.Recipe.Id);
                    await UpdateIngredientsAsync(API, data.recipeIngredients, data.Recipe.Id);
                    await UpdateCategoresAsync(API, data.recipeCategories, data.Recipe.Id);
                    return RedirectToAction("Index");
                }
            }
            return RedirectToAction("Edit", id);
        }

        public async Task<IActionResult> Delete(int id)
        {
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await API.GetAsync($"/api/Recipes/GetById/{id}");
                if (response.IsSuccessStatusCode)
                {
                    var apiResponse = await response.Content.ReadAsStringAsync();
                    var recipeDetails = JsonConvert.DeserializeObject<Recipe>(apiResponse);
                    return View(recipeDetails);
                }

                return NotFound();
            }
        }
        
        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await API.DeleteAsync($"/api/Recipes/Delete/{id}");
                if (response.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }

                ModelState.AddModelError("", "Failed to delete the recipe.");
                return View(await GetRecipeDetailsAsync(API, id)); // Show the recipe details again
            }
        }

        // Helper method to fetch recipe details
        private async Task<Recipe> GetRecipeDetailsAsync(HttpClient API, int id)
        {
            var response = await API.GetAsync($"/api/Recipes/GetById/{id}");
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<Recipe>(content);
            }
            return null;
        }

        private async Task<string> SendRecipeAsync(HttpClient API, Recipe recipe)
        {
            var recipeJson = JsonConvert.SerializeObject(recipe);
            var content = new StringContent(recipeJson, System.Text.Encoding.UTF8, "application/json");
            var response = await API.PostAsync("/api/Recipes/Add", content);

            return response.IsSuccessStatusCode ? await response.Content.ReadAsStringAsync() : null;
        }

        private async Task<string> UpdateRecipeAsync(HttpClient API, Recipe recipe)
        {
            var recipeJson = JsonConvert.SerializeObject(recipe);
            var content = new StringContent(recipeJson, System.Text.Encoding.UTF8, "application/json");
            var response = await API.PutAsync($"/api/Recipes/Update/{recipe.Id}", content); // Change to PUT

            return response.IsSuccessStatusCode ? await response.Content.ReadAsStringAsync() : null;
        }

        private async Task ProcessStepAsync(HttpClient API, Step step, int recipeId)
        {
            if (step.backgroundImageBase64 != null && step.backgroundImageBase64.Length > 0)
            {
                step.backgroundImage = await ConvertToBase64Async(step.backgroundImageBase64);
            }

            var stepPayload = new Step
            {
                RecipeID = recipeId,
                StepNumber = step.StepNumber,
                description = step.description,
                backgroundImage = step.backgroundImage,
            };

            var stepJson = JsonConvert.SerializeObject(stepPayload);
            var stepContent = new StringContent(stepJson, System.Text.Encoding.UTF8, "application/json");
            await API.PostAsync("/api/Steps/Add", stepContent);
        }

        private async Task ProcessStepsAsync(HttpClient API, ICollection<Step> steps, int recipeId)
        {
            foreach (var step in steps)
            {
                await ProcessStepAsync(API, step, recipeId);
            }
        }

        private async Task UpdateStepsAsync(HttpClient API, ICollection<Step> steps, int recipeId)
        {
            foreach (var step in steps)
            {
                if(step.Id == 0)
                {
                    await ProcessStepAsync(API, step, recipeId);
                }

                if (step.backgroundImageBase64 != null && step.backgroundImageBase64.Length > 0)
                {
                    step.backgroundImage = await ConvertToBase64Async(step.backgroundImageBase64);
                }

                var stepPayload = new Step
                {
                    RecipeID = recipeId,
                    StepNumber = step.StepNumber,
                    description = step.description,
                    backgroundImage = step.backgroundImage,
                };

                var stepJson = JsonConvert.SerializeObject(stepPayload);
                var stepContent = new StringContent(stepJson, System.Text.Encoding.UTF8, "application/json");
                await API.PutAsync($"/api/Steps/Update/{step.Id}", stepContent);
            }
        }

        private async Task ProcessCategoryAsync(HttpClient API, RecipeCategory category, int recipeId)
        {
            var categoryPayload = new RecipeCategory
            {
                RecipeID = recipeId,
                CategoryID = category.CategoryID,
            };

            var categoryJson = JsonConvert.SerializeObject(categoryPayload);
            var categoryContent = new StringContent(categoryJson, System.Text.Encoding.UTF8, "application/json");
                await API.PostAsync("/api/Recipes/Category/Add", categoryContent);
        }

        private async Task ProcessCategoresAsync(HttpClient API, ICollection<RecipeCategory> categores, int recipeId)
        {
            foreach (var category in categores)
            {
                await ProcessCategoryAsync(API, category, recipeId);
            }
        }

        private async Task UpdateCategoresAsync(HttpClient API, ICollection<RecipeCategory> Categores, int recipeId)
        {
            foreach (var category in Categores)
            {
                if(category.Id == 0)
                {
                    await ProcessCategoryAsync(API, category, recipeId);
                }
                var categoryPayload = new RecipeCategory
                {
                    RecipeID = recipeId,
                    CategoryID = category.CategoryID,
                };

                var categoryJson = JsonConvert.SerializeObject(categoryPayload);
                var categoryContent = new StringContent(categoryJson, System.Text.Encoding.UTF8, "application/json");
                await API.PutAsync($"/api/Recipes/UpdateCategory/{category.Id}", categoryContent);
            }
        }

        private async Task ProcessIngredientAsync(HttpClient API, RecipeIngredient ingredient, int recipeId)
        {
            var ingredientPayload = new RecipeIngredient
            {
                RecipeID = recipeId,
                IngredientID = ingredient.IngredientID,
                quantity = ingredient.quantity,
                unit = ingredient.unit,
            };

            var ingredientJson = JsonConvert.SerializeObject(ingredientPayload);
            var ingredientContent = new StringContent(ingredientJson, System.Text.Encoding.UTF8, "application/json");
            await API.PostAsync("/api/Recipes/Ingredient/Add", ingredientContent);
        }

        private async Task ProcessIngredientsAsync(HttpClient API, ICollection<RecipeIngredient> ingredients, int recipeId)
        {
            foreach (var ingredient in ingredients)
            {
                await ProcessIngredientAsync(API, ingredient, recipeId);
            }
        }

        private async Task UpdateIngredientsAsync(HttpClient API, ICollection<RecipeIngredient> ingredients, int recipeId)
        {
            foreach (var ingredient in ingredients)
            {
                if(ingredient.Id == 0)
                {
                    await ProcessIngredientAsync(API, ingredient, recipeId);
                }
                var ingredientPayload = new RecipeIngredient
                {
                    RecipeID = recipeId,
                    IngredientID = ingredient.IngredientID,
                    quantity = ingredient.quantity,
                    unit = ingredient.unit,
                };

                var ingredientJson = JsonConvert.SerializeObject(ingredientPayload);
                var ingredientContent = new StringContent(ingredientJson, System.Text.Encoding.UTF8, "application/json");
                await API.PutAsync($"/api/Recipes/UpdateIngredient/{ingredient.Id}", ingredientContent);
            }
        }

        private async Task<string> ConvertToBase64Async(IFormFile file)
        {
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                byte[] imageBytes = memoryStream.ToArray();
                return Convert.ToBase64String(imageBytes);
            }
        }
    }
}
