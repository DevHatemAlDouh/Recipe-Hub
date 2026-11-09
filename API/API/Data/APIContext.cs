using API.Models;
using Microsoft.CodeAnalysis.Elfie.Extensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class APIContext : DbContext
    {
        public APIContext(DbContextOptions<APIContext> options)
            : base(options)
        {
        }

        // DbSets for each model
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserPermission> UserPermissions { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<CommentRate> CommentRates { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Suggestion> Suggestions { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<RecipeCategory> RecipeCategories { get; set; }
        public DbSet<RecipeRate> RecipeRates { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Penalty> Penalties { get; set; }
        public DbSet<Step> Steps { get; set; }
        public DbSet<UserPenalty> UserPenalties { get; set; }
        public DbSet<Terms> Terms { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationships for Favorite
            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.Ingredient)
                .WithMany(i => i.Favorites)
                .HasForeignKey(f => f.IngredientID)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure relationships for Report
            modelBuilder.Entity<Report>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reports)
                .HasForeignKey(r => r.FromUserID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships for Recipe
            modelBuilder.Entity<Recipe>()
                .HasOne(r => r.User)
                .WithMany(u => u.Recipes)
                .HasForeignKey(r => r.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure relationships for CommentRate
            modelBuilder.Entity<CommentRate>()
                .HasOne(cr => cr.User)
                .WithMany(u => u.CommentRates)
                .HasForeignKey(cr => cr.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CommentRate>()
                .HasOne(cr => cr.Comment)
                .WithMany(c => c.CommentRates)
                .HasForeignKey(cr => cr.CommentID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships for RecipeCategory
            modelBuilder.Entity<RecipeCategory>()
                .HasOne(rc => rc.Recipe)
                .WithMany(r => r.RecipeCategories)
                .HasForeignKey(rc => rc.RecipeID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RecipeCategory>()
                .HasOne(rc => rc.Category)
                .WithMany(c => c.RecipeCategories)
                .HasForeignKey(rc => rc.CategoryID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships for StepIngredient
            modelBuilder.Entity<RecipeIngredient>()
                .HasOne(si => si.Ingredient)
                .WithMany(i => i.RecipeIngredients)
                .HasForeignKey(si => si.IngredientID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RecipeIngredient>()
                .HasOne(si => si.recipe)
                .WithMany(s => s.RecipeIngredients)
                .HasForeignKey(si => si.RecipeID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships for Comment
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Recipe)
                .WithMany(r => r.Comments)
                .HasForeignKey(c => c.RecipeID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships for RecipeRate
            modelBuilder.Entity<RecipeRate>()
                .HasOne(rr => rr.Recipe)
                .WithMany(r => r.RecipeRates)
                .HasForeignKey(rr => rr.RecipeID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RecipeRate>()
                .HasOne(rr => rr.User)
                .WithMany(u => u.RecipeRates)
                .HasForeignKey(rr => rr.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships for Step
            modelBuilder.Entity<Step>()
                .HasOne(s => s.Recipe)
                .WithMany(r => r.Steps)
                .HasForeignKey(s => s.RecipeID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships for UserPenalty
            modelBuilder.Entity<UserPenalty>()
                .HasOne(up => up.User)
                .WithMany(u => u.UserPenalties)
                .HasForeignKey(up => up.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserPenalty>()
                .HasOne(up => up.Penalty)
                .WithMany(p => p.UserPenalties)
                .HasForeignKey(up => up.PenaltyID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships for UserPenalty
            modelBuilder.Entity<Terms>()
                .HasOne(up => up.permission)
                .WithMany(u => u.Terms)
                .HasForeignKey(up => up.permissionid)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Terms>()
                .HasOne(up => up.penalty)
                .WithMany(p => p.Terms)
                .HasForeignKey(up => up.penaltyid)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships for UserPermission
            modelBuilder.Entity<UserPermission>()
                .HasOne(up => up.User)
                .WithMany(u => u.UserPermissions)
                .HasForeignKey(up => up.UserID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserPermission>()
                .HasOne(up => up.Permission)
                .WithMany(p => p.UserPermissions)
                .HasForeignKey(up => up.PermissionID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships for Suggestion
            modelBuilder.Entity<Suggestion>()
                .HasOne(s => s.User)
                .WithMany(u => u.Suggestions)
                .HasForeignKey(s => s.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Suggestion>()
                .HasOne(s => s.Recipe)
                .WithMany(s => s.Suggestions)
                .HasForeignKey(s => s.RecipeID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Permission>()
                .HasData(
                new Permission() 
                {   Id = 1,
                    Title = "Admin",
                    UserPermissions = new List<UserPermission>(),
                    CreatedAt = new DateTime(2025, 3, 27)
                },
                new Permission() 
                {   Id = 2,
                    Title = "account access",
                    UserPermissions = new List<UserPermission>(),
                    CreatedAt = new DateTime(2025, 3, 27)
                });

            modelBuilder.Entity<User>()
                .HasData(
                new User()
                {
                    Id = 1,
                    UserName = "A.F.H.2M",
                    PhoneNumber = "730881465",
                    CountryCode = "+967",
                    Email = "recipehub@gmail.com",
                    Password = "fb1a081025d1a03db826af9d11bac5b3953e1e6ebd4387f02a1fce89893fca68",
                    UserImage = Convert.FromBase64String("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"),
                    CommentRates = new List<CommentRate>(),
                    Comments = new List<Comment>(),
                    RecipeRates = new List<RecipeRate>(),
                    UserPermissions = new List<UserPermission>(),
                    UserPenalties = new List<UserPenalty>(),
                    Reports = new List<Report>(),
                    Favorites = new List<Favorite>(),
                    CreatedAt = new DateTime(2025, 3, 27),

                });
            modelBuilder.Entity<UserPermission>()
                .HasData(
                new UserPermission()
                {
                    Id = 1,
                    UserID = 1,
                    PermissionID = 1,
                    CreatedAt = new DateTime(2025, 3, 27)
                },
                new UserPermission()
                {
                    Id = 2,
                    UserID = 1,
                    PermissionID = 2,
                    CreatedAt = new DateTime(2025, 3, 27)
                }
                );
        }
    }
}