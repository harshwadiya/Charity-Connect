    using Microsoft.EntityFrameworkCore;
    using dotnetapp.Models;

    namespace dotnetapp.Data
    {
        public class ApplicationDbContext : DbContext
        {
            public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

            public DbSet<Feedback> Feedbacks { get; set; }
            public DbSet<User> Users { get; set; }
            public DbSet<Charity> Charities { get; set; }
            public DbSet<Donation> Donations { get; set; }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                modelBuilder.Entity<Donation>()
                    .HasOne(d => d.Charity)
                    .WithMany()
                    .HasForeignKey(d => d.CharityId)
                    .OnDelete(DeleteBehavior.SetNull);

                modelBuilder.Entity<Donation>()
                    .HasOne(d => d.User)
                    .WithMany()
                    .HasForeignKey(d => d.UserId);

                modelBuilder.Entity<Feedback>()
                    .HasOne(f => f.User)
                    .WithMany()
                    .HasForeignKey(f => f.UserId);
                    
                base.OnModelCreating(modelBuilder);
            }   
        }
    }