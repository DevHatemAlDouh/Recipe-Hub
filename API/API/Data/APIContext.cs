using API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace API.Data
{
    public class APIContext : DbContext
    {
        public APIContext(DbContextOptions<APIContext> options)
            : base(options)
        {
        }

        public DbSet<Permission> Permissions { get; set; }
        public DbSet<UserPermission> UserPermissions { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<CommentRate> CommentRates { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Suggestion> Suggestions { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<StepIngredient> StepIngredients { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationships and constraints if needed
            modelBuilder.Entity<UserPermission>()
                .HasKey(up => new { up.UserID, up.PermissionID });

            modelBuilder.Entity<CommentRate>()
                .HasOne<Recipe>()
                .WithMany()
                .HasForeignKey(cr => cr.RecipeID);

            modelBuilder.Entity<Favorite>()
                .HasKey(f => new { f.UserID, f.RecipeID });

            modelBuilder.Entity<StepIngredient>()
                .HasOne<Ingredient>()
                .WithMany()
                .HasForeignKey(si => si.IngredientID);

            modelBuilder.Entity<StepIngredient>()
                .HasOne<Recipe>()
                .WithMany()
                .HasForeignKey(si => si.RecipeID);

            // Additional configurations can be added as needed
        }

    }
}
