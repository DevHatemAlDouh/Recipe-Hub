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
                var recipeDetails = new Recipe_details();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // Get Recipe
                var recipeResponse = await API.GetAsync($"/api/Recipes/GetById/{id}");
                if (recipeResponse.IsSuccessStatusCode)
                {
                    var recipeContent = await recipeResponse.Content.ReadAsStringAsync();
                    recipeDetails.Recipe = JsonConvert.DeserializeObject<Recipe>(recipeContent);

                    // Get Steps
                    var stepsResponse = await API.GetAsync($"/api/Recipes/GetAllSteps?recipeid={id}");
                    if (stepsResponse.IsSuccessStatusCode)
                    {
                        var stepsContent = await stepsResponse.Content.ReadAsStringAsync();
                        recipeDetails.steps = JsonConvert.DeserializeObject<List<Step>>(stepsContent);

                        // Get Ingredients
                        var ingredientsResponse = await API.GetAsync($"/api/Recipes/GetAllIngredient?recipeid={id}");
                        if (ingredientsResponse.IsSuccessStatusCode)
                        {
                            var ingredientsContent = await ingredientsResponse.Content.ReadAsStringAsync();
                            recipeDetails.recipeIngredients = JsonConvert.DeserializeObject<List<RecipeIngredient>>(ingredientsContent);

                            // Fetch detailed ingredient info
                            var ingredientTasks = recipeDetails.recipeIngredients.Select(async ingredient =>
                            {
                                var ingredientResponse = await API.GetAsync($"/api/Ingredients/GetById/{ingredient.IngredientID}");
                                if (ingredientResponse.IsSuccessStatusCode)
                                {
                                    var ingredientApiResponse = await ingredientResponse.Content.ReadAsStringAsync();
                                    return JsonConvert.DeserializeObject<Ingredient>(ingredientApiResponse);
                                }
                                return null;
                            });

                            recipeDetails.ingredients = (await Task.WhenAll(ingredientTasks)).Where(i => i != null).ToList();

                            // Fetch categories
                            var categoriesResponse = await API.GetAsync($"/api/Recipes/GetAllCategories?recipeId={id}");
                            if (categoriesResponse.IsSuccessStatusCode)
                            {
                                var categoriesContent = await categoriesResponse.Content.ReadAsStringAsync();
                                recipeDetails.recipeCategories = JsonConvert.DeserializeObject<List<RecipeCategory>>(categoriesContent);

                                var categoryTasks = recipeDetails.recipeCategories.Select(async category =>
                                {
                                    var categoryResponse = await API.GetAsync($"/api/Categories/GetById/{category.CategoryID}");
                                    if (categoryResponse.IsSuccessStatusCode)
                                    {
                                        var categoryApiResponse = await categoryResponse.Content.ReadAsStringAsync();
                                        return JsonConvert.DeserializeObject<Category>(categoryApiResponse);
                                    }
                                    return null;
                                });

                                recipeDetails.categories = (await Task.WhenAll(categoryTasks)).Where(c => c != null).ToList();
                            }
                        }
                    }
                }

                return View(recipeDetails);
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
                HttpResponseMessage Res = await API.GetAsync("/api/users/GetAll");
                if (Res.IsSuccessStatusCode)
                {
                    var APIResponse = Res.Content.ReadAsStringAsync().Result;
                    var users = JsonConvert.DeserializeObject<List<User>>(APIResponse);
                    foreach(var user in users)
                    {
                        if(user.UserName == User.Identity.Name)
                        {
                            recipe_Details.Recipe.UserId = user.Id;
                        }
                    }
                }
                

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

        public async Task<IActionResult> Comments(int id)
        {
            using (var API = new HttpClient())
            {
                var recipeComments = new RecipeComments();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // Get all comments
                HttpResponseMessage commRes = await API.GetAsync("/api/Comments/GetAll");
                if (commRes.IsSuccessStatusCode)
                {
                    var apiCommResponse = await commRes.Content.ReadAsStringAsync();
                    var comments = JsonConvert.DeserializeObject<List<Comment>>(apiCommResponse);

                    // Get all users
                    HttpResponseMessage userRes = await API.GetAsync("/api/Users/GetAll"); // Adjusted the endpoint
                    if (userRes.IsSuccessStatusCode)
                    {
                        var apiUserResponse = await userRes.Content.ReadAsStringAsync();
                        var users = JsonConvert.DeserializeObject<List<User>>(apiUserResponse);

                        // Filter comments and users
                        var recipeCommentsList = new List<Comment>();
                        var userCommentsList = new List<User>();

                        foreach (var comment in comments)
                        {
                            if (comment.recipeid == id)
                            {
                                recipeCommentsList.Add(comment);
                                var user = users.FirstOrDefault(u => u.Id == comment.userid);
                                if (user != null)
                                {
                                    userCommentsList.Add(user);
                                }
                            }
                        }

                        recipeComments.comments = recipeCommentsList;
                        recipeComments.users = userCommentsList;
                    }
                }

                return View(recipeComments);
            }
        }

        public async Task<IActionResult> Suggestions(int id)
        {
            using (var API = new HttpClient())
            {
                var recipeSuggestions = new RecipeSuggestions();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // Get all suggestions
                HttpResponseMessage suggRes = await API.GetAsync("/api/Suggestions/GetAll");
                if (suggRes.IsSuccessStatusCode)
                {
                    var apiSuggResponse = await suggRes.Content.ReadAsStringAsync();
                    var suggestions = JsonConvert.DeserializeObject<List<Suggestion>>(apiSuggResponse);
                    // Filter comments and users
                    var recipeSuggestionsList = new List<Suggestion>();

                    foreach (var suggestion in suggestions)
                    {
                        if (suggestion.RecipeID == id)
                        {
                            recipeSuggestionsList.Add(suggestion); 
                        }
                    }

                    recipeSuggestions.suggestions = recipeSuggestionsList;
                }

                return View(recipeSuggestions);
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
