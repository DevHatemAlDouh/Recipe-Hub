
using Dashboard.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Dashboard.Controllers
{
    public class PenaltiesController : Controller
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
                HttpResponseMessage res = await API.GetAsync("/api/Penalties/GetAll");
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
                PenaltyInfo penaltyInfo = new PenaltyInfo();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage res = await API.GetAsync($"/api/Penalties/GetById/{id}");
                if (res.IsSuccessStatusCode)
                {
                    var apiResponse = await res.Content.ReadAsStringAsync();
                    penaltyInfo.penalty = JsonConvert.DeserializeObject<Penalty>(apiResponse);
                }
                HttpResponseMessage termsRes = await API.GetAsync($"/api/Penalties/GetAllTerms?penaltyId={id}");
                if (termsRes.IsSuccessStatusCode)
                {
                    var apiResponse = termsRes.Content.ReadAsStringAsync().Result;
                    penaltyInfo.terms = JsonConvert.DeserializeObject<List<Terms>>(apiResponse);
                }
                HttpResponseMessage permationsres = await API.GetAsync($"/api/Permissions/GetAll");
                if (permationsres.IsSuccessStatusCode)
                {
                    var apiResponse = await permationsres.Content.ReadAsStringAsync();
                    penaltyInfo.permissions = JsonConvert.DeserializeObject<List<Permission>>(apiResponse);
                }
                return View(penaltyInfo);
            }
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {

            using (var API = new HttpClient())
            {
                PenaltyInfo penaltyInfo = new PenaltyInfo();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage permationsres = await API.GetAsync($"/api/Permissions/GetAll");
                if (permationsres.IsSuccessStatusCode)
                {
                    var apiResponse = await permationsres.Content.ReadAsStringAsync();
                    penaltyInfo.permissions = JsonConvert.DeserializeObject<List<Permission>>(apiResponse);
                }
                return View(penaltyInfo);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] PenaltyInfo data)
        {
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var content = new StringContent(JsonConvert.SerializeObject(data.penalty), Encoding.UTF8, "application/json");
                HttpResponseMessage res = await API.PostAsync("/api/Penalties/Add", content);
                if (res.IsSuccessStatusCode)
                {
                    var apiResponse = await res.Content.ReadAsStringAsync();
                    data.penalty = JsonConvert.DeserializeObject<Penalty>(apiResponse);

                    foreach (var term in data.terms)
                    {
                        term.penaltyid = data.penalty.Id;
                        var termcontent = new StringContent(JsonConvert.SerializeObject(term), Encoding.UTF8, "application/json");
                        HttpResponseMessage termres = await API.PostAsync("/api/Terms/Add", termcontent);
                    }
                    return RedirectToAction("Index");
                }
            }
            return View(data);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            using (var API = new HttpClient())
            {
                PenaltyInfo penaltyInfo = new PenaltyInfo();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage res = await API.GetAsync($"/api/Penalties/GetById/{id}");
                if (res.IsSuccessStatusCode)
                {
                    var apiResponse = await res.Content.ReadAsStringAsync();
                    penaltyInfo.penalty = JsonConvert.DeserializeObject<Penalty>(apiResponse);
                }
                HttpResponseMessage permationsres = await API.GetAsync($"/api/Permissions/GetAll");
                if (permationsres.IsSuccessStatusCode)
                {
                    var apiResponse = await permationsres.Content.ReadAsStringAsync();
                    penaltyInfo.permissions = JsonConvert.DeserializeObject<List<Permission>>(apiResponse);
                }
                HttpResponseMessage termsRes = await API.GetAsync($"/api/Penalties/GetAllTerms?penaltyId={id}");
                if (termsRes.IsSuccessStatusCode)
                {
                    var apiResponse = termsRes.Content.ReadAsStringAsync().Result;
                    penaltyInfo.Lterms = JsonConvert.DeserializeObject<List<Terms>>(apiResponse);
                }
                return View(penaltyInfo);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, [FromForm] PenaltyInfo data)
        {
            bool result;
            using (var API = new HttpClient())
            {
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var content = new StringContent(JsonConvert.SerializeObject(data.penalty), Encoding.UTF8, "application/json");
                HttpResponseMessage res = await API.PutAsync($"/api/Penalties/Update/{id}", content);
                if (res.IsSuccessStatusCode)
                {
                    var apiResponse = await res.Content.ReadAsStringAsync();

                    foreach (var term in data.terms)
                    {
                        if (term.Id == 0)
                        {
                            term.penaltyid = data.penalty.Id;
                            var termcontent = new StringContent(JsonConvert.SerializeObject(term), Encoding.UTF8, "application/json");
                            HttpResponseMessage termres = await API.PostAsync("/api/Terms/Add", termcontent);
                        }
                        else
                        {
                            var termcontent = new StringContent(JsonConvert.SerializeObject(term), Encoding.UTF8, "application/json");
                            HttpResponseMessage termres = await API.PostAsync($"/api/Terms/Update/{term.Id}", termcontent);
                        }
                        
                    }
                    return RedirectToAction("Index");
                }
            }
            return View(data);
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            using (var API = new HttpClient())
            {
                Penalty penalty = new Penalty();
                API.BaseAddress = new Uri(baseURL);
                API.DefaultRequestHeaders.Clear();
                API.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                HttpResponseMessage res = await API.GetAsync($"/api/Penalties/GetById/{id}");
                if (res.IsSuccessStatusCode)
                {
                    var apiResponse = await res.Content.ReadAsStringAsync();
                    penalty = JsonConvert.DeserializeObject<Penalty>(apiResponse);
                }
                return View(penalty);
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
                HttpResponseMessage res = await API.DeleteAsync($"/api/Penalties/Delete/{id}");
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
