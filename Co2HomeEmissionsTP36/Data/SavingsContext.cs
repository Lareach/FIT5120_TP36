using Co2HomeEmissionsTP36.Models;
using Microsoft.EntityFrameworkCore;

namespace Co2HomeEmissionsTP36.Data;

public class SavingsContext : DbContext
{
    public SavingsContext(DbContextOptions<SavingsContext> options) : base(options)
    {

    }

    public DbSet<SavingsCategory> category { get; set; }
    public DbSet<Concession> concession { get; set; }
    public DbSet<Savings> savings { get; set; }
    
    public DbSet<SavingsConcession>? savingsConcession { get; }
    
    // Define database schema
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SavingsCategory>()
            .Property(c => c.Uid)
            .ValueGeneratedOnAdd();
        
        modelBuilder.Entity<Concession>()
            .Property(c => c.Uid)
            .ValueGeneratedOnAdd();
        
        modelBuilder.Entity<Savings>()
            .Property(c => c.Uid)
            .ValueGeneratedOnAdd();
        
        modelBuilder.Entity<SavingsConcession>()
            .Property(c => c.Uid)
            .ValueGeneratedOnAdd();
        
        modelBuilder.Entity<SavingsCategory>()
            .HasKey(c => c.CategoryId);

        modelBuilder.Entity<Concession>()
            .HasKey(c => c.ConcessionId);
        
        modelBuilder.Entity<Savings>()
            .HasKey(s => s.SavingsId);
        
        modelBuilder.Entity<SavingsConcession>()
            .HasKey(sc => new { sc.SavingsId, sc.ConcessionId });
        
        modelBuilder.Entity<Savings>()
            .HasOne(s => s.Category)
            .WithMany()
            .HasForeignKey(s => s.CategoryId);

        modelBuilder.Entity<SavingsConcession>()
            .HasOne(sc => sc.Savings)
            .WithMany()
            .HasForeignKey(sc => sc.SavingsId);

        modelBuilder.Entity<SavingsConcession>()
            .HasOne(sc => sc.Concession)
            .WithMany()
            .HasForeignKey(sc => sc.ConcessionId);
    }
}
