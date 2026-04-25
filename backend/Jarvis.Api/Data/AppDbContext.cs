using Jarvis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Mission> Missions => Set<Mission>();

    public DbSet<MissionTemplate> MissionTemplates => Set<MissionTemplate>();

    public DbSet<Expense> Expenses => Set<Expense>();

    public DbSet<DailyLog> DailyLogs => Set<DailyLog>();

    public DbSet<UserSettings> UserSettings => Set<UserSettings>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Expense>()
            .Property(expense => expense.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<UserSettings>()
            .Property(settings => settings.DailySpendingLimit)
            .HasPrecision(18, 2);
    }
}
