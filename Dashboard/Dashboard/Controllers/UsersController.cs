using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Data;
using System.Text;
using Dashboard.Service;
using System.Security;

namespace Dashboard.Controllers
{
    public class UsersController : Controller
    {
        private string baseURL = "http://recipe-hub.runasp.net/swagger";
        private Hashing _hashing;
        public UsersController(Hashing hashing)
        {
            _hashing = hashing;
        }
        
        public async Task<IActionResult> Index()
        {
            DataTable dt = new DataTable();
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await API.GetAsync("/api/users/GetAll");
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
                User user = new User();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await API.GetAsync($"/api/users/GetById/{id}");
                if (Res.IsSuccessStatusCode)
                {
                    var APIResponse = Res.Content.ReadAsStringAsync().Result;
                    user = JsonConvert.DeserializeObject<User>(APIResponse);
                    
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
        public async Task<IActionResult> Create([FromForm] User data)
        {
            if (data.UserImageBase64 != null && data.UserImageBase64.Length > 0)
            {
                using (var memoryStream = new System.IO.MemoryStream())
                {
                    // Copy the uploaded file to the memory stream
                    await data.UserImageBase64.CopyToAsync(memoryStream);
                    byte[] imageBytes = memoryStream.ToArray();
                    data.UserImage = Convert.ToBase64String(imageBytes); // Store as Base64
                }
            }

            data.Password = _hashing.HashPassword(data.Password);

            bool result;
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                HttpResponseMessage Res = await API.PostAsync("/api/users/Add", content);

                if (!Res.IsSuccessStatusCode)
                {
                    // Handle error
                    ModelState.AddModelError(string.Empty, "Server error. Please contact administrator.");
                    return View(data);
                }

                result = true; // Indicate success
            }

            if (result)
            {
                return RedirectToAction("Index"); // Redirect to Index after successful creation
            }
            return View(data); // Return to the view if creation fails
        }


        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            using (var API = new HttpClient())
            {
                User user = new User();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await API.GetAsync($"/api/users/GetById/{id}");
                if (Res.IsSuccessStatusCode)
                {
                    var APIResponse = Res.Content.ReadAsStringAsync().Result;
                    user = JsonConvert.DeserializeObject<User>(APIResponse);

                }
                return View(user);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, [FromForm] User data)
        {
            if (data.UserImageBase64 != null && data.UserImageBase64.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await data.UserImageBase64.CopyToAsync(memoryStream);
                    byte[] imageBytes = memoryStream.ToArray();
                    data.UserImage = Convert.ToBase64String(imageBytes); // Assuming User has this property
                }
            }

            data.Password = _hashing.HashPassword(data.Password);

            bool result;
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
                HttpResponseMessage Res = await API.PutAsync($"/api/users/Update/{id}", content);

                if (!Res.IsSuccessStatusCode)
                {
                    // Handle error
                    ModelState.AddModelError(string.Empty, "Server error. Please contact administrator.");
                    return View(data);
                }

                result = true; // Set to true if successful
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
                User user = new User();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage Res = await API.GetAsync($"/api/users/GetById/{id}");
                if (Res.IsSuccessStatusCode)
                {
                    var APIResponse = Res.Content.ReadAsStringAsync().Result;
                    user = JsonConvert.DeserializeObject<User>(APIResponse);

                }
                return View(user);
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
                HttpResponseMessage Res = await API.DeleteAsync($"/api/users/Delete/{id}");
                result = Res.IsSuccessStatusCode;
            }
            if (result)
            {
                return RedirectToAction("Index");
            }
            return View();
        }

        public async Task<IActionResult> Permissions(int id)
        {
            
            using (var API = new HttpClient())
            {
                User_All_Permissions user_All_Permissions = new User_All_Permissions();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage userResponse = await API.GetAsync($"/api/users/GetById/{id}");
                if (userResponse.IsSuccessStatusCode)
                {
                    var userApiResponse = await userResponse.Content.ReadAsStringAsync();
                    user_All_Permissions.user = JsonConvert.DeserializeObject<User>(userApiResponse);
                }

                HttpResponseMessage userPermissionResponse = await API.GetAsync($"/api/users/GetUserPermissionsById?userId={id}");
                if (userPermissionResponse.IsSuccessStatusCode)
                {
                    var apiResponse = await userPermissionResponse.Content.ReadAsStringAsync();
                    user_All_Permissions.user_permission = JsonConvert.DeserializeObject<List<User_Permission>>(apiResponse);
                }

                var permissionTasks = user_All_Permissions.user_permission.Select(async permission =>
                {
                    HttpResponseMessage permissionsResponse = await API.GetAsync($"/api/Permissions/GetById/{permission.PermissionID}");
                    if (permissionsResponse.IsSuccessStatusCode)
                    {
                        var apiResponse = await permissionsResponse.Content.ReadAsStringAsync();
                        return JsonConvert.DeserializeObject<Permission>(apiResponse);
                    }
                    return null;
                });

                var permissions = await Task.WhenAll(permissionTasks);
                user_All_Permissions.permission = permissions.Where(p => p != null).ToList();

                return View(user_All_Permissions);
            }
        }

        public async Task<IActionResult> GrantPermission(int id)
        {
            // Create an instance of User_Permission_form
            var userPermissionForm = new User_Permission_form
            {
                user_permission = new User_Permission(),
                user = new User(),
                permissions = new List<Permission>()
            };

            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // Get user information
                HttpResponseMessage userResponse = await API.GetAsync($"/api/users/GetById/{id}");
                if (userResponse.IsSuccessStatusCode)
                {
                    var userApiResponse = await userResponse.Content.ReadAsStringAsync();
                    userPermissionForm.user = JsonConvert.DeserializeObject<User>(userApiResponse);
                }

                // Get all permissions
                HttpResponseMessage permissionsResponse = await API.GetAsync("/api/Permissions/GetAll");
                if (permissionsResponse.IsSuccessStatusCode)
                {
                    var permissionsApiResponse = await permissionsResponse.Content.ReadAsStringAsync();
                    userPermissionForm.permissions = JsonConvert.DeserializeObject<List<Permission>>(permissionsApiResponse);
                }
            }

            return View(userPermissionForm); // Pass the model to the view
        }

        [HttpPost]
        public async Task<IActionResult> GrantPermission([FromForm] User_Permission_form userPermissionform)
        {
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var content = new StringContent(JsonConvert.SerializeObject(userPermissionform.user_permission), Encoding.UTF8, "application/json");
                HttpResponseMessage Res = await API.PostAsync("/api/Permissions/GrantPermission", content);

                if (!Res.IsSuccessStatusCode)
                {
                    // Handle error
                    ModelState.AddModelError(string.Empty, "Failed to grant permission. Please contact administrator.");
                    return View(userPermissionform);
                }
            }

            return RedirectToAction("Index"); // Redirect to Index after successful grant
        }



        public async Task<IActionResult> RevokePermission(int id)
        {
            
            using (var API = new HttpClient())
            {
                User_Revoke_Permission userRevokePermission = new User_Revoke_Permission();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage userpermissionRes = await API.GetAsync($"/api/users/GetUserPermissionsById?userId={id}");
                if (userpermissionRes.IsSuccessStatusCode)
                {
                    var APIResponse = userpermissionRes.Content.ReadAsStringAsync().Result;
                    userRevokePermission.user_permission = JsonConvert.DeserializeObject<User_Permission>(APIResponse);
                }

                HttpResponseMessage Res = await API.GetAsync($"/api/users/GetById/{userRevokePermission.user_permission.UserID}");
                if (Res.IsSuccessStatusCode)
                {
                    var APIResponse = Res.Content.ReadAsStringAsync().Result;
                    userRevokePermission.user = JsonConvert.DeserializeObject<User>(APIResponse);
                }

                HttpResponseMessage permissionsResponse = await API.GetAsync($"/api/Permissions/GetById/{userRevokePermission.user_permission.PermissionID}");
                if (permissionsResponse.IsSuccessStatusCode)
                {
                    var apiResponse = await permissionsResponse.Content.ReadAsStringAsync();
                    userRevokePermission.permission = JsonConvert.DeserializeObject<Permission>(apiResponse);
                }

                return View(userRevokePermission);
            }
        }

        [HttpPost, ActionName("RevokePermission")]
        public async Task<IActionResult> RevokeConfirmed(int id)
        {
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage Res = await API.DeleteAsync($"/api/Permissions/Revoke/{id}");

                if (!Res.IsSuccessStatusCode)
                {
                    // Handle error
                    ModelState.AddModelError(string.Empty, "Failed to revoke permission. Please contact administrator.");
                    return View();
                }
            }

            return RedirectToAction("Index"); // Redirect to Index after successful revoke
        }


        public async Task<IActionResult> Penalties(int id)
        {

            using (var API = new HttpClient())
            {
                User_All_Penalties user_All_Penalties = new User_All_Penalties();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage userResponse = await API.GetAsync($"/api/users/GetById/{id}");
                if (userResponse.IsSuccessStatusCode)
                {
                    var userApiResponse = await userResponse.Content.ReadAsStringAsync();
                    user_All_Penalties.user = JsonConvert.DeserializeObject<User>(userApiResponse);
                }

                HttpResponseMessage userpenaltyResponse = await API.GetAsync($"/api/users/GetUserPenaltiesById?userId={id}");
                if (userpenaltyResponse.IsSuccessStatusCode)
                {
                    var apiResponse = await userpenaltyResponse.Content.ReadAsStringAsync();
                    user_All_Penalties.user_Penalties = JsonConvert.DeserializeObject<List<User_Penalty>>(apiResponse);
                }

                var penaltyTasks = user_All_Penalties.user_Penalties.Select(async penalty =>
                {
                    HttpResponseMessage ppenaltiesResponse = await API.GetAsync($"/api/Penalties/GetById/{penalty.PenaltyID}");
                    if (ppenaltiesResponse.IsSuccessStatusCode)
                    {
                        var apiResponse = await ppenaltiesResponse.Content.ReadAsStringAsync();
                        return JsonConvert.DeserializeObject<Penalty>(apiResponse);
                    }
                    return null;
                });

                var penalties = await Task.WhenAll(penaltyTasks);
                user_All_Penalties.penalties = penalties.Where(p => p != null).ToList();

                return View(user_All_Penalties);
            }
        }

        public async Task<IActionResult> GrantPenalty(int id)
        {
            // Create an instance of User_Permission_form
            var userPenaltyForm = new User_Penalty_form
            {
                user = new User(),
                user_Penalty = new User_Penalty(),
                penalties = new List<Penalty>()
            };

            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                // Get user information
                HttpResponseMessage userResponse = await API.GetAsync($"/api/users/GetById/{id}");
                if (userResponse.IsSuccessStatusCode)
                {
                    var userApiResponse = await userResponse.Content.ReadAsStringAsync();
                    userPenaltyForm.user = JsonConvert.DeserializeObject<User>(userApiResponse);
                }

                // Get all permissions
                HttpResponseMessage permissionsResponse = await API.GetAsync("/api/Penalties/GetAll");
                if (permissionsResponse.IsSuccessStatusCode)
                {
                    var permissionsApiResponse = await permissionsResponse.Content.ReadAsStringAsync();
                    userPenaltyForm.penalties = JsonConvert.DeserializeObject<List<Penalty>>(permissionsApiResponse);
                }
            }

            return View(userPenaltyForm); // Pass the model to the view
        }

        [HttpPost]
        public async Task<IActionResult> GrantPenalty([FromForm] User_Penalty_form userPenaltyform)
        {
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var content = new StringContent(JsonConvert.SerializeObject(userPenaltyform.user_Penalty), Encoding.UTF8, "application/json");
                HttpResponseMessage Res = await API.PostAsync("/api/Penalties/GrantPenalties", content);

                if (!Res.IsSuccessStatusCode)
                {
                    // Handle error
                    ModelState.AddModelError(string.Empty, "Failed to grant permission. Please contact administrator.");
                    return View(userPenaltyform);
                }
            }

            return RedirectToAction("Index"); // Redirect to Index after successful grant
        }

        public async Task<IActionResult> RevokePenalty(int id)
        {
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                HttpResponseMessage Res = await API.DeleteAsync($"/api/Permissions/Revoke/{id}");
            }

            return RedirectToAction("Index"); // Redirect to Index after successful revoke
        }
    }
}
