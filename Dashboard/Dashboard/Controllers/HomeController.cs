using Dashboard.Models;
using Dashboard.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Diagnostics;
using System.Net.Http.Headers;

namespace Dashboard.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        //private string baseURL = "http://recipe-hub.runasp.net/swagger";
        //public async Task<IActionResult> Index()
        //{
        //    DataTable dt = new DataTable();
        //    using (var API = new HttpClient())
        //    {
        //        API.BaseAddress = new Uri(baseURL);
        //        API.DefaultRequestHeaders.Clear();
        //        API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        //        HttpResponseMessage Res = await API.GetAsync("/api/users/GetAll");
        //        if (Res.IsSuccessStatusCode)
        //        {
        //            var APIResponse = Res.Content.ReadAsStringAsync().Result;
        //            dt = JsonConvert.DeserializeObject<DataTable>(APIResponse);
        //        }
        //        return View(dt);
        //    }
        //}

        public async Task<IActionResult> Index()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
