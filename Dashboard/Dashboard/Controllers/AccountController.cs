using Dashboard.Models;
using Dashboard.Service;
using Microsoft.AspNetCore.Mvc;

namespace Dashboard.Controllers
{
    public class AccountController : Controller
    {
        private readonly AccountService _accountService;
        private readonly CustomAuthenticationStateProvider _authenticationStateProvider;

        public AccountController(AccountService accountService, CustomAuthenticationStateProvider authenticationStateProvider)
        {
            _accountService = accountService;
            _authenticationStateProvider = authenticationStateProvider;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(Login model)
        {
            if (ModelState.IsValid)
            {
                User isSuccess = await _accountService.LoginAsync(model);

                if (isSuccess != null)
                {
                    await _authenticationStateProvider.SignInAsync(isSuccess);
                    // If successful, redirect to the home page
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    // If authentication fails, return the login view with an error message
                    ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                }
            }

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await _authenticationStateProvider.SignOutAsync();
            return RedirectToAction("Login", "Account");
        }
    }
}
