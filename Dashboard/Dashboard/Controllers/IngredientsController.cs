using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Dashboard.Controllers
{
    public class IngredientsController : Controller
    {
        private string baseURL = "http://recipe-hub.runasp.net/swagger";

        public async Task<IActionResult> IndexAsync()
        {
            DataTable dt = new DataTable();
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage res = await API.GetAsync("/api/Ingredients/GetAll");
                if (res.IsSuccessStatusCode)
                {
                    var apiResponse = await res.Content.ReadAsStringAsync();
                    dt = JsonConvert.DeserializeObject<DataTable>(apiResponse);
                }
                return View(dt);
            }
        }

        public async Task<IActionResult> Details(int id)
        {
            using (var API = new HttpClient())
            {
                Ingredient ingredient = new Ingredient();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage res = await API.GetAsync($"/api/Ingredients/GetById/{id}");
                if (res.IsSuccessStatusCode)
                {
                    var apiResponse = await res.Content.ReadAsStringAsync();
                    ingredient = JsonConvert.DeserializeObject<Ingredient>(apiResponse);
                }
                return View(ingredient);
            }
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Ingredient data)
        {
            bool result;
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                HttpResponseMessage res = await API.PostAsync("/api/Ingredients/Add", content);
                result = res.IsSuccessStatusCode;
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
            using (var API = new HttpClient())
            {
                Ingredient ingredient = new Ingredient();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage res = await API.GetAsync($"/api/Ingredients/GetById/{id}");
                if (res.IsSuccessStatusCode)
                {
                    var apiResponse = await res.Content.ReadAsStringAsync();
                    ingredient = JsonConvert.DeserializeObject<Ingredient>(apiResponse);
                }
                return View(ingredient);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, [FromForm] Ingredient data)
        {
            bool result;
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                HttpResponseMessage res = await API.PutAsync($"/api/Ingredients/Update/{id}", content);
                result = res.IsSuccessStatusCode;
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
            using (var API = new HttpClient())
            {
                Ingredient ingredient = new Ingredient();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage res = await API.GetAsync($"/api/Ingredients/GetById/{id}");
                if (res.IsSuccessStatusCode)
                {
                    var apiResponse = await res.Content.ReadAsStringAsync();
                    ingredient = JsonConvert.DeserializeObject<Ingredient>(apiResponse);
                }
                return View(ingredient);
            }
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            bool result;
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage res = await API.DeleteAsync($"/api/Ingredients/Delete/{id}");
                result = res.IsSuccessStatusCode;
            }
            if (result)
            {
                return RedirectToAction("Index");
            }
            return View();
        }
    }
}
