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

builder.Services.AddScoped<ICRUDService<UserInfo>, UserService>();
builder.Services.AddScoped<ICRUDService<PenaltyInfo>, PenaltyService>();
builder.Services.AddScoped<ICRUDService<PermissionInfo>, PermissionService>();
builder.Services.AddScoped<ICRUDService<IngredientInfo>, IngredientService>();
builder.Services.AddScoped<ICRUDService<StepInfo>, StepService>();
builder.Services.AddScoped<ICRUDService<CategoryInfo>, CategoryService>();
builder.Services.AddScoped<ICRUDService<SuggestionInfo>, SuggestionService>();
builder.Services.AddScoped<ICRUDService<CommentInfo>, CommentService>();
builder.Services.AddScoped<UsePermissions>();
builder.Services.AddScoped<UserPenalties>();
builder.Services.AddScoped<UserRecipes>();
builder.Services.AddScoped<RecipeSteps>();
builder.Services.AddScoped<RecipeIngredient>();
builder.Services.AddScoped<RecipeAndCategoryAndComment>();
builder.Services.AddScoped<RecipeSuggestions>();
builder.Services.AddScoped<FavoriteService>();
builder.Services.AddScoped<RecipeRateService>();
builder.Services.AddScoped<CommentRateService>();
builder.Services.AddScoped<ReportService>();

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
