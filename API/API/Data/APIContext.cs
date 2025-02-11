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
        public DbSet<StepIngredient> StepIngredients { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<RecipeCategory> RecipeCategories { get; set; }
        public DbSet<RecipeRate> RecipeRates { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Penalty> Penalties { get; set; }
        public DbSet<Step> Steps { get; set; }
        public DbSet<UserPenalty> UserPenalties { get; set; } // Added UserPenalty DbSet

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CommentRate>()
                .HasOne(cr => cr.User) // Assuming you have a navigation property for User
                .WithMany(u => u.CommentRates) // Assuming User has a collection of CommentRates
                .HasForeignKey(cr => cr.UserID)
                .OnDelete(DeleteBehavior.Restrict); // Change to Restrict or SetNull if appropriate

            modelBuilder.Entity<CommentRate>()
                .HasOne(cr => cr.Comment)
                .WithMany(c => c.CommentRates) // Assuming Comment has a collection of CommentRates
                .HasForeignKey(cr => cr.CommentID)
                .OnDelete(DeleteBehavior.Cascade); // Keep Cascade if desired

            modelBuilder.Entity<UserPermission>()
                .HasKey(up => new { up.UserID, up.PermissionID });

            modelBuilder.Entity<Favorite>()
                .HasKey(f => new { f.UserID, f.IngredientID });

            modelBuilder.Entity<RecipeCategory>()
                .HasKey(rc => new { rc.RecipeID, rc.CategoryID });

            // Configure relationships for StepIngredient
            modelBuilder.Entity<StepIngredient>()
                .HasOne(si => si.Ingredient)
                .WithMany(i => i.StepIngredients) // Ensure Ingredient has a collection of StepIngredients
                .HasForeignKey(si => si.IngredientID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StepIngredient>()
                .HasOne(si => si.Step)
                .WithMany(s => s.StepIngredients) // Ensure Step has a collection of StepIngredients
                .HasForeignKey(si => si.StepID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure relationships for Comment
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Recipe) // Ensure Comment has a navigation property to Recipe
                .WithMany(r => r.Comments) // Ensure Recipe has a collection of Comments
                .HasForeignKey(c => c.RecipeID)
                .OnDelete(DeleteBehavior.Cascade); // Optional: define delete behavior

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User) // Ensure Comment has a navigation property to User
                .WithMany(u => u.Comments) // Ensure User has a collection of Comments
                .HasForeignKey(c => c.UserID)
                .OnDelete(DeleteBehavior.Cascade); // Optional: define delete behavior

            // Configure relationships for RecipeRate
            modelBuilder.Entity<RecipeRate>()
                .HasOne(rr => rr.Recipe) // Ensure RecipeRate has a navigation property to Recipe
                .WithMany(r => r.RecipeRates) // Ensure Recipe has a collection of RecipeRates
                .HasForeignKey(rr => rr.RecipeID)
                .OnDelete(DeleteBehavior.Cascade); // Optional: define delete behavior

            modelBuilder.Entity<RecipeRate>()
                .HasOne(rr => rr.User) // Ensure RecipeRate has a navigation property to User
                .WithMany(u => u.RecipeRates) // Ensure User has a collection of RecipeRates
                .HasForeignKey(rr => rr.UserID)
                .OnDelete(DeleteBehavior.Cascade); // Optional: define delete behavior

            // Configure relationships for Step
            modelBuilder.Entity<Step>()
                .HasOne(s => s.Recipe) // Ensure Step has a navigation property to Recipe
                .WithMany(r => r.Steps) // Ensure Recipe has a collection of Steps
                .HasForeignKey(s => s.RecipeID)
                .OnDelete(DeleteBehavior.Cascade); // Optional: define delete behavior

            // Configure relationships for UserPenalty
            modelBuilder.Entity<UserPenalty>()
                .HasOne(up => up.User) // Ensure UserPenalty has a navigation property to User
                .WithMany(u => u.UserPenalties) // Ensure User has a collection of UserPenalties
                .HasForeignKey(up => up.UserID)
                .OnDelete(DeleteBehavior.Cascade); // Optional: define delete behavior

            modelBuilder.Entity<UserPenalty>()
                .HasOne(up => up.Penalty) // Ensure UserPenalty has a navigation property to Penalty
                .WithMany(p => p.UserPenalties) // Ensure Penalty has a collection of UserPenalties
                .HasForeignKey(up => up.PenaltyID)
                .OnDelete(DeleteBehavior.Cascade); // Optional: define delete behavior

            // Configure UserPermission relationship
            modelBuilder.Entity<UserPermission>()
                .HasKey(up => new { up.UserID, up.PermissionID });

            modelBuilder.Entity<UserPermission>()
                .HasOne(up => up.User)
                .WithMany(u => u.UserPermissions) // Ensure User has a collection of UserPermissions
                .HasForeignKey(up => up.UserID)
                .OnDelete(DeleteBehavior.Cascade); // Choose delete behavior

            modelBuilder.Entity<UserPermission>()
                .HasOne(up => up.Permission)
                .WithMany(p => p.UserPermissions) // Ensure Permission has a collection of UserPermissions
                .HasForeignKey(up => up.PermissionID)
                .OnDelete(DeleteBehavior.Cascade); // Choose delete behavior

            // Additional configurations can be added as needed
        }
    }
}