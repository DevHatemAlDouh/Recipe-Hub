using API.Models;
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
                .OnDelete(DeleteBehavior.Restrict);

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
                .HasOne(s => s.Step)
                .WithMany(s => s.Suggestions)
                .HasForeignKey(s => s.StepID)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}