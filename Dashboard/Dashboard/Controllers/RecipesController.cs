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
                    recipe_Details.Recipe = JsonConvert.DeserializeObject<Recipes>(APIResponse);

                    HttpResponseMessage ingredientRes = await API.GetAsync($"/api/Recipes/GetAllSteps?recipeid={id}");
                    if (ingredientRes.IsSuccessStatusCode)
                    {
                        var APIIngredientResponse = ingredientRes.Content.ReadAsStringAsync().Result;
                        recipe_Details.ingredients = JsonConvert.DeserializeObject<List<Ingredient>>(APIIngredientResponse);

                        HttpResponseMessage stepRes = await API.GetAsync($"/api/Recipes/GetAllIngredient?recipeid={id}");
                        if (stepRes.IsSuccessStatusCode)
                        {
                            var APIStepResponse = stepRes.Content.ReadAsStringAsync().Result;
                            recipe_Details.steps = JsonConvert.DeserializeObject<List<Steps>>(APIStepResponse);

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
    }
}
