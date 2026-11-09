using Dashboard.Models;
using Dashboard.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Linq;
using System.Net.Http.Headers;

namespace Dashboard.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private string baseURL = "http://recipe-hub.runasp.net/swagger";

        public async Task<IActionResult> IndexAsync()
        {
            using (var API = new HttpClient())
            {
                Dashbord_info dashbord_Info = new Dashbord_info();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage reciperes = await API.GetAsync($"/api/Recipes/GetAll");
                if (reciperes.IsSuccessStatusCode)
                {
                    var apirecipeResponse = await reciperes.Content.ReadAsStringAsync();
                    List<Recipe> recipes = JsonConvert.DeserializeObject<List<Recipe>>(apirecipeResponse);
                    dashbord_Info.Totle_Recipes = recipes.Count;
                    int likes = 0;
                    int views = 0;
                    int maxrecipes = 3;
                    List<Recipe> POPrecipes = [];
                    foreach (var recipe in recipes.OrderBy(r => r.View))
                    {
                        if (maxrecipes > 0)
                        {
                            POPrecipes.Add(recipe);
                            maxrecipes--;
                        }
                        
                        views += recipe.View;
                        likes += recipe.Rate;
                    }
                    dashbord_Info.Totle_Likes = likes;
                    dashbord_Info.Totle_Views = views;
                    dashbord_Info.recipes = POPrecipes;
                }

                HttpResponseMessage userres = await API.GetAsync($"/api/users/GetAll");
                if (userres.IsSuccessStatusCode)
                {
                    var apiusereResponse = await userres.Content.ReadAsStringAsync();
                    List<User> users = JsonConvert.DeserializeObject<List<User>>(apiusereResponse);
                    dashbord_Info.Totle_Users = users.Count;
                    HttpResponseMessage userCommres = await API.GetAsync($"/api/Comments/GetAll");
                    if (userCommres.IsSuccessStatusCode)
                    {
                        var apiuserCommResponse = await userCommres.Content.ReadAsStringAsync();
                        List<Comment> comments = JsonConvert.DeserializeObject<List<Comment>>(apiuserCommResponse);
                        List<int> userComments = [];
                        int userComment = 0; 
                        foreach (var comment in comments)
                        {
                            if (!userComments.Contains(comment.userid))
                            {
                                userComment++;
                            }
                            else
                            {
                                userComments.Add(comment.userid);
                            }

                        }
                        dashbord_Info.Totle_Users = users.Count;
                        dashbord_Info.Totle_users_that_comments_on_recipes = (userComment/users.Count)/ users.Count;

                    }
                }

                return View(dashbord_Info);
            }
        }
    }
}
