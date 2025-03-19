using Dashboard.Models;
using Newtonsoft.Json;
using System.Data;
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

        
    }
}
