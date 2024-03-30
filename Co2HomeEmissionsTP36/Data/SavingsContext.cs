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
        
        modelBuilder.Entity<SavingsCategory>()
            .HasKey(c => c.CategoryId);

        modelBuilder.Entity<Concession>()
            .HasKey(c => c.ConcessionId);
        
        modelBuilder.Entity<Savings>()
            .HasKey(s => s.SavingsId);
        
        modelBuilder.Entity<Savings>()
            .HasOne(s => s.Category)
            .WithMany()
            .HasForeignKey(s => s.CategoryId);

        modelBuilder.Entity<Savings>()
            .HasOne(s => s.Concession)
            .WithMany()
            .HasForeignKey(s => s.ConcessionId);
    }
}