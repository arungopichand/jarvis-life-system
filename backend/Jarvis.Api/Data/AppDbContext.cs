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

    public DbSet<LearningLog> LearningLogs => Set<LearningLog>();

    public DbSet<CommunicationLog> CommunicationLogs => Set<CommunicationLog>();

    public DbSet<LearningTopicProgress> LearningTopicProgresses => Set<LearningTopicProgress>();

    public DbSet<VocabularyEntry> VocabularyEntries => Set<VocabularyEntry>();

    public DbSet<IncomeLog> IncomeLogs => Set<IncomeLog>();

    public DbSet<DiaryEntry> DiaryEntries => Set<DiaryEntry>();

    public DbSet<BlogDraft> BlogDrafts => Set<BlogDraft>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Expense>()
            .Property(expense => expense.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<UserSettings>()
            .Property(settings => settings.DailySpendingLimit)
            .HasPrecision(18, 2);

        modelBuilder.Entity<LearningLog>()
            .Property(log => log.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        modelBuilder.Entity<CommunicationLog>()
            .Property(log => log.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        modelBuilder.Entity<IncomeLog>()
            .Property(log => log.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<IncomeLog>()
            .Property(log => log.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        modelBuilder.Entity<DiaryEntry>()
            .Property(entry => entry.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        modelBuilder.Entity<BlogDraft>()
            .Property(draft => draft.CreatedAt)
            .HasDefaultValueSql("GETDATE()");

        modelBuilder.Entity<BlogDraft>()
            .Property(draft => draft.UpdatedAt)
            .HasDefaultValueSql("GETDATE()");

        modelBuilder.Entity<LearningTopicProgress>()
            .HasIndex(progress => new { progress.Topic, progress.Category })
            .IsUnique();

        modelBuilder.Entity<VocabularyEntry>()
            .HasIndex(entry => entry.Word)
            .IsUnique();
    }
}
