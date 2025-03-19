using Dashboard.Models;
using Dashboard.Service;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System;
using System.Data;
using System.Text;

namespace Dashboard.Controllers
{
    public class UsersController : Controller
    {
        private string baseURL = "http://recipe-hub.runasp.net/swagger";

        public async Task<IActionResult> Index()
        {
            DataTable dt = new DataTable();
            using (var Recipes = new HttpClient())
            {
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await Recipes.GetAsync("/api/users/GetAll");
                if (Res.IsSuccessStatusCode)
                {
                    var RecipesResponse = Res.Content.ReadAsStringAsync().Result;
                    dt = JsonConvert.DeserializeObject<DataTable>(RecipesResponse);
                }
                return View(dt);
            }
        }

        public async Task<IActionResult> Details(int id)
        {
            using (var Recipes = new HttpClient())
            {
                User user = new User();
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await Recipes.GetAsync($"/api/users/GetById/{id}");
                if (Res.IsSuccessStatusCode)
                {
                    var RecipesResponse = Res.Content.ReadAsStringAsync().Result;
                    user = JsonConvert.DeserializeObject<User>(RecipesResponse);
                    
                }
                return View(user);
            }
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] object data)
        {
            bool result;
            using (var Recipes = new HttpClient())
            {
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                HttpResponseMessage Res = await Recipes.PostAsync("/api/users/Add", content);
                result = Res.IsSuccessStatusCode;
            }
            if (result)
            {
                return RedirectToAction("Index");
            }
            return View(data);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            using (var Recipes = new HttpClient())
            {
                User user = new User();
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await Recipes.GetAsync($"/api/users/GetById/{id}");
                if (Res.IsSuccessStatusCode)
                {
                    var RecipesResponse = Res.Content.ReadAsStringAsync().Result;
                    user = JsonConvert.DeserializeObject<User>(RecipesResponse);

                }
                return View(user);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, [FromForm] object data)
        {
            bool result;
            using (var Recipes = new HttpClient())
            {
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                HttpResponseMessage Res = await Recipes.PutAsync($"/api/users/Update/{id}", content);
                result = Res.IsSuccessStatusCode;
            }
            if (result)
            {
                return RedirectToAction("Index");
            }
            return View(data);
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            using (var Recipes = new HttpClient())
            {
                User user = new User();
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await Recipes.GetAsync($"/api/users/GetById/{id}");
                if (Res.IsSuccessStatusCode)
                {
                    var RecipesResponse = Res.Content.ReadAsStringAsync().Result;
                    user = JsonConvert.DeserializeObject<User>(RecipesResponse);

                }
                return View(user);
            }
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            bool result;
            using (var Recipes = new HttpClient())
            {
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await Recipes.DeleteAsync($"/api/users/Delete/{id}");
                result = Res.IsSuccessStatusCode;
            }
            if (result)
            {
                return RedirectToAction("Index");
            }
            return View();
        }
    }
}
