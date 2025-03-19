using Dashboard.Models;
using Newtonsoft.Json;
using System.Data;
using System.Globalization;
using System.Net.Http.Headers;
using System.Text;

namespace Dashboard.Service
{
    public class Config
    {
        private string baseURL = "http://recipe-hub.runasp.net/swagger";

        public async Task<DataTable> get_allAsync(string url)
        {
            DataTable dt = new DataTable();
            using (var Recipes = new HttpClient())
            {
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await Recipes.GetAsync(url);
                if (Res.IsSuccessStatusCode)
                {
                    var RecipesResponse = Res.Content.ReadAsStringAsync().Result;
                    dt = JsonConvert.DeserializeObject<DataTable>(RecipesResponse);
                }
                return dt;
            }
        }

        public async Task<object> get_by_idAsync(string url, int id)
        {

            using (var Recipes = new HttpClient())
            {
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await Recipes.GetAsync($"{url}/{id}");
                if (Res.IsSuccessStatusCode)
                {
                    var RecipesResponse = Res.Content.ReadAsStringAsync().Result;
                    var dt = JsonConvert.DeserializeObject<object>(RecipesResponse);
                    return dt;
                }
                return null;
            }
        }

        public async Task<bool> createAsync(string url, object data)
        {
            using (var Recipes = new HttpClient())
            {
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                HttpResponseMessage Res = await Recipes.PostAsync(url, content);
                return Res.IsSuccessStatusCode;
            }
        }

        public async Task<bool> updateAsync(string url, int id, object data)
        {
            using (var Recipes = new HttpClient())
            {
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                HttpResponseMessage Res = await Recipes.PutAsync($"{url}/{id}", content);
                return Res.IsSuccessStatusCode;
            }
        }

        public async Task<bool> deleteAsync(string url, int id)
        {
            using (var Recipes = new HttpClient())
            {
                Recipes.BaseAddress = new Uri(baseURL);
                Recipes.DefaultRequestHeaders.Clear();
                Recipes.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await Recipes.DeleteAsync($"{url}/{id}");
                return Res.IsSuccessStatusCode;
            }
        }
    }
}
