using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Net.Http.Headers;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
                Report_Details report_Details = new Report_Details();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage res = await API.GetAsync($"/api/users/GetReportById/{id}");
                if (res.IsSuccessStatusCode)
                {
                    var apiResponse = await res.Content.ReadAsStringAsync();
                    report_Details.Report = JsonConvert.DeserializeObject<Report>(apiResponse);
                    HttpResponseMessage reportarres = await API.GetAsync($"/api/users/GetById/{report_Details.Report.fromUserid}");
                    if (reportarres.IsSuccessStatusCode)
                    {
                        var apireportarResponse = await reportarres.Content.ReadAsStringAsync();
                        report_Details.Reporter = JsonConvert.DeserializeObject<User>(apireportarResponse);

                    }
                    HttpResponseMessage reportedres = await API.GetAsync($"/api/users/GetById/{report_Details.Report.atoUserid}");
                    if (reportedres.IsSuccessStatusCode)
                    {
                        var apireportedResponse = await reportedres.Content.ReadAsStringAsync();
                        report_Details.Reported = JsonConvert.DeserializeObject<User>(apireportedResponse);

                    }
                }

                return View(report_Details);
            }
        }

        public async Task<IActionResult> Update(int id)
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
                    var content = new StringContent(JsonConvert.SerializeObject(report), Encoding.UTF8, "application/json");
                    HttpResponseMessage upres = await API.PutAsync($"/api/Categories/Update/{id}", content);
                    if (upres.IsSuccessStatusCode)
                    {
                        return RedirectToAction("Index");
                    }
                }
                return RedirectToAction("Details", report.Id);
            }
        }
    }
}
