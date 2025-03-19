using Dashboard.Models;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Text;

namespace Dashboard.Service
{
    public class AccountService
    {
        private string baseURL = "http://recipe-hub.runasp.net/swagger";

        public async Task<bool> CreateUserAsync(User user)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseURL);
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var jsonContent = JsonConvert.SerializeObject(user);
                var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync("/api/users/Add", content);
                return response.IsSuccessStatusCode;
            }
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseURL);
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await client.GetAsync($"/api/users/GetById/{userId}");
                if (response.IsSuccessStatusCode)
                {
                    var userResponse = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<User>(userResponse);
                }
                return null;
            }
        }

        public async Task<bool> LoginAsync(User user)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseURL);
                client.DefaultRequestHeaders.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage response = await client.GetAsync("/api/users/GetAll");
                if (response.IsSuccessStatusCode)
                {
                    var usersResponse = await response.Content.ReadAsStringAsync();
                    var users = JsonConvert.DeserializeObject<List<User>>(usersResponse);

                    return users.Any(u => u.UserName == user.UserName && u.Password == user.Password);
                }
                return false;
            }
        }
    }
}
