using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Net.Http.Headers;

namespace Dashboard.Controllers
{
    public class ReportsController : Controller
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
                HttpResponseMessage res = await API.GetAsync("/api/users/GetAllReports");
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
                Report report = new Report();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage res = await API.GetAsync($"/api/users/GetReportById/{id}");
                if (res.IsSuccessStatusCode)
                {
                    var apiResponse = await res.Content.ReadAsStringAsync();
                    report = JsonConvert.DeserializeObject<Report>(apiResponse);
                }
                return View(report);
            }
        }
    }
}
