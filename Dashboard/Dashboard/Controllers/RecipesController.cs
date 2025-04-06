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
                                recipe_Details.categories = JsonConvert.DeserializeObject<List<Category>>(APICategorieResponse);

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
                return View(recipe_Details);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(Recipe_details recipe_Details)
        {
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var Recipe = JsonConvert.SerializeObject(recipe_Details.Recipe);
                var content = new StringContent(Recipe, System.Text.Encoding.UTF8, "application/json");
                HttpResponseMessage Res = await API.PostAsync("/api/Recipes/Create", content);
                if (Res.IsSuccessStatusCode)
                {
                    return RedirectToAction("Index");
                }
            }
            return View(recipe_Details);

        }
    }
}
