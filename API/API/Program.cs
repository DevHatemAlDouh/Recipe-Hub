using API.Data;
using API.Middlewares;
using Microsoft.EntityFrameworkCore;
using API.Controllers;
using API.Models;
using API.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<APIContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ICRUD<UserInfo>, UserService>();
builder.Services.AddScoped<ICRUD<PenaltyInfo>, PenaltyService>();
builder.Services.AddScoped<ICRUD<PermissionInfo>, PermissionService>();
builder.Services.AddScoped<UsePermissions>();
builder.Services.AddScoped<UserPenalties>();

var app = builder.Build();

app.UseMiddleware<SwaggerRedirectMiddleware>();

app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
};

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
