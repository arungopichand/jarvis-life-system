using Jarvis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Mission> Missions => Set<Mission>();

    public DbSet<Expense> Expenses => Set<Expense>();

    public DbSet<DailyLog> DailyLogs => Set<DailyLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Expense>()
            .Property(expense => expense.Amount)
            .HasPrecision(18, 2);
    }
}
