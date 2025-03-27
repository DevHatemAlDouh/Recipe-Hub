using Dashboard.Models;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace Dashboard.Service
{
    public class AccountService
    {
        private string baseURL = "http://recipe-hub.runasp.net/swagger";
        private Hashing _hashing;
        public AccountService(Hashing hashing) 
        {
            _hashing = hashing;
        }
        

        public async Task<bool> LoginAsync(Login user)
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
                    foreach (var _user in users)
                    {
                       if(_user.UserName == user.UserName && _hashing.VerifyPassword(user.Password, _user.Password))
                        {
                            HttpResponseMessage userresponse = await client.GetAsync($"/api/users/GetUserPermissionsById/{_user.Id}");
                            if (userresponse.IsSuccessStatusCode)
                            {
                                var userspermisstionResponse = await userresponse.Content.ReadAsStringAsync();
                                var userpermisstions = JsonConvert.DeserializeObject<List<User_Permission>>(userspermisstionResponse);

                                return userpermisstions.Any(u => u.PermissionID == 1 );
                            }
                        }
                    }

                    
                }
                return false;
            }
        }

        
    }
}
