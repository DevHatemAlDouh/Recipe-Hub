using Dashboard.Service;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configure cookie authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "UserLoginCookie";
        options.LoginPath = "/Account/Login"; // Set the login path
        //options.LogoutPath = "/Account/Logout"; // Optional: set the logout path
        //options.AccessDeniedPath = "/Account/AccessDenied"; // Optional: for access denied
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<AccountService>();
builder.Services.AddScoped<Hashing>();
builder.Services.AddScoped<CustomAuthenticationStateProvider>();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication(); // Ensure authentication is used
app.UseAuthorization(); // Ensure authorization is used

// Define the default route
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();